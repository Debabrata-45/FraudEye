from __future__ import annotations
import json
import logging
import os
import numpy as np
import xgboost as xgb

logger = logging.getLogger("artifacts")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")


class ArtifactStore:
    def __init__(self) -> None:
        self.model: xgb.Booster | None = None
        self.feature_columns: list[str] | None = None
        self.shap_background: np.ndarray | None = None
        self.lime_background: np.ndarray | None = None
        self.shap_explainer = None
        self.lime_explainer = None

    def load(self) -> None:
        self._load_model()
        self._load_feature_columns()
        self._load_backgrounds()
        self._init_explainers()

    def _load_model(self) -> None:
        path = os.path.join(ARTIFACTS_DIR, "xgb_model.json")
        if not os.path.exists(path):
            logger.error("Model not found at %s", path)
            return
        booster = xgb.Booster()
        booster.load_model(path)
        self.model = booster
        logger.info("Loaded XGBoost model from %s", path)

    def _load_feature_columns(self) -> None:
        path = os.path.join(ARTIFACTS_DIR, "feature_columns.json")
        if not os.path.exists(path):
            logger.error("feature_columns.json not found at %s", path)
            return
        with open(path) as f:
            self.feature_columns = json.load(f)
        logger.info("Loaded %d feature columns", len(self.feature_columns))

    def _load_backgrounds(self) -> None:
        shap_path = os.path.join(ARTIFACTS_DIR, "shap_background.npy")
        lime_path = os.path.join(ARTIFACTS_DIR, "lime_background.npy")

        if os.path.exists(shap_path) and os.path.getsize(shap_path) > 0:
            self.shap_background = np.load(shap_path)
            logger.info("Loaded SHAP background shape=%s", self.shap_background.shape)
        else:
            logger.warning("SHAP background not found or empty, will use fallback")

        if os.path.exists(lime_path) and os.path.getsize(lime_path) > 0:
            self.lime_background = np.load(lime_path)
            logger.info("Loaded LIME background shape=%s", self.lime_background.shape)
        else:
            logger.warning("LIME background not found or empty, will use fallback")

    def _init_explainers(self) -> None:
        if self.model is None or self.feature_columns is None:
            logger.warning("Skipping explainer init — model or features not loaded")
            return

        self._init_shap()
        self._init_lime()

    def _init_shap(self) -> None:
        try:
            import shap
            if self.shap_background is not None:
                self.shap_explainer = shap.TreeExplainer(
                    self.model,
                    data=self.shap_background,
                    feature_perturbation="interventional"
                )
            else:
                self.shap_explainer = shap.TreeExplainer(self.model)
            logger.info("SHAP TreeExplainer initialized")
        except Exception as e:
            logger.error("Failed to init SHAP explainer: %s", e)

    def _init_lime(self) -> None:
        try:
            from lime.lime_tabular import LimeTabularExplainer
            import numpy as np

            if self.lime_background is not None:
                background = self.lime_background
            else:
                # fallback: zeros background
                background = np.zeros((1, len(self.feature_columns)))

            self.lime_explainer = LimeTabularExplainer(
                training_data=background,
                feature_names=self.feature_columns,
                mode="classification",
                discretize_continuous=True,
            )
            logger.info("LIME LimeTabularExplainer initialized")
        except Exception as e:
            logger.error("Failed to init LIME explainer: %s", e)

    def require_model(self) -> xgb.Booster:
        if self.model is None:
            raise RuntimeError("Model not loaded")
        return self.model

    def require_features(self) -> list[str]:
        if self.feature_columns is None:
            raise RuntimeError("Feature columns not loaded")
        return self.feature_columns


artifact_store = ArtifactStore()