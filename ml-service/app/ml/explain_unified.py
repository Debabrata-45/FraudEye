from __future__ import annotations
import logging
from typing import List

from app.schemas.infer import SHAPBlock, LIMEBlock, TopFactor

logger = logging.getLogger("explain_unified")


def unify_explanations(
    shap_block: SHAPBlock,
    lime_block: LIMEBlock,
    top_n: int = 5,
) -> List[TopFactor]:
    """
    Combine SHAP + LIME into a unified top factors list.
    Strategy:
    - Use SHAP values as primary signal (most reliable for XGBoost)
    - Use LIME as secondary signal to confirm/boost ranking
    - Return top_n factors sorted by absolute SHAP impact
    """
    try:
        # Build SHAP impact map
        shap_map: dict[str, float] = {
            entry.feature: entry.shapValue
            for entry in shap_block.values
        }

        # Build LIME weight map (feature name may be a rule string)
        lime_map: dict[str, float] = {}
        for rule in lime_block.rules:
            # LIME rules are often like "feature <= 0.5"
            # Extract base feature name from rule string
            feature_name = _extract_feature_name(rule.feature)
            if feature_name:
                lime_map[feature_name] = rule.weight

        # Build feature value map from SHAP block
        value_map: dict[str, float] = {
            entry.feature: entry.featureValue
            for entry in shap_block.values
        }

        # Score each feature: primary=abs(shap), secondary=abs(lime)
        scored: list[tuple[str, float]] = []
        for feature, shap_val in shap_map.items():
            lime_val = lime_map.get(feature, 0.0)
            # Combined score: SHAP weighted 70%, LIME 30%
            combined = 0.7 * abs(shap_val) + 0.3 * abs(lime_val)
            scored.append((feature, combined))

        # Sort by combined score descending
        scored.sort(key=lambda x: x[1], reverse=True)

        # Build TopFactor list
        top_factors: List[TopFactor] = []
        for feature, impact in scored[:top_n]:
            shap_val = shap_map.get(feature, 0.0)
            direction = "increases_risk" if shap_val > 0 else "decreases_risk"
            value = value_map.get(feature, 0.0)

            top_factors.append(TopFactor(
                feature=feature,
                impact=round(abs(impact), 6),
                direction=direction,
                value=value,
            ))

        return top_factors

    except Exception as e:
        logger.error("Unification of explanations failed: %s", e)
        return []


def _extract_feature_name(rule_str: str) -> str | None:
    """
    Extract base feature name from a LIME rule string.
    Examples:
      'geo_anomaly_km > 500.0'  -> 'geo_anomaly_km'
      'new_device <= 0.50'      -> 'new_device'
      'amount'                  -> 'amount'
    """
    try:
        for op in [" <= ", " > ", " < ", " >= ", " == ", " != "]:
            if op in rule_str:
                return rule_str.split(op)[0].strip()
        return rule_str.strip()
    except Exception:
        return None