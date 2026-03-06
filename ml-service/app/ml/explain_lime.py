from __future__ import annotations
import logging
from typing import List

import numpy as np

from app.schemas.infer import LIMEBlock, LIMERule

logger = logging.getLogger("explain_lime")


def compute_lime(
    feature_vector: np.ndarray,
    feature_names: list[str],
    lime_explainer,
    predict_fn,
    num_features: int = 10,
) -> LIMEBlock:
    """
    Compute LIME explanation for a single feature vector.
    Returns a LIMEBlock with weighted rules.
    Falls back to empty rules if explainer fails.
    """
    try:
        raw = feature_vector.flatten()

        explanation = lime_explainer.explain_instance(
            data_row=raw,
            predict_fn=predict_fn,
            num_features=num_features,
            num_samples=500,
        )

        # explanation.as_list() returns [(rule_str, weight), ...]
        rules: List[LIMERule] = []
        for rule_str, weight in explanation.as_list():
            rules.append(LIMERule(
                feature=rule_str,
                weight=round(float(weight), 6),
            ))

        return LIMEBlock(rules=rules)

    except Exception as e:
        logger.error("LIME explanation failed: %s", e)
        # fallback: return empty rules
        return LIMEBlock(rules=[])