from __future__ import annotations
import logging
from typing import List

import numpy as np

from app.schemas.infer import SHAPBlock, SHAPEntry

logger = logging.getLogger("explain_shap")


def compute_shap(
    feature_vector: np.ndarray,
    feature_names: list[str],
    shap_explainer,
) -> SHAPBlock:
    """
    Compute SHAP values for a single feature vector.
    Returns a SHAPBlock with baseValue + per-feature shap values.
    Falls back to zeros if explainer fails.
    """
    try:
        shap_values = shap_explainer(feature_vector)

        # shap_values.values shape: (1, n_features) for binary classifier
        values = shap_values.values
        base = shap_values.base_values

        # handle shape variations
        if hasattr(values, "tolist"):
            vals = np.array(values).flatten().tolist()
        else:
            vals = list(values)

        if hasattr(base, "__len__"):
            base_value = float(np.array(base).flatten()[0])
        else:
            base_value = float(base)

        entries: List[SHAPEntry] = []
        raw = feature_vector.flatten().tolist()

        for i, name in enumerate(feature_names):
            entries.append(SHAPEntry(
                feature=name,
                shapValue=round(float(vals[i]), 6),
                featureValue=round(float(raw[i]), 6),
            ))

        return SHAPBlock(baseValue=round(base_value, 6), values=entries)

    except Exception as e:
        logger.error("SHAP explanation failed: %s", e)
        # fallback: return zeros
        entries = [
            SHAPEntry(feature=name, shapValue=0.0, featureValue=0.0)
            for name in feature_names
        ]
        return SHAPBlock(baseValue=0.0, values=entries)