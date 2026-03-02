import os
import logging
import xgboost as xgb

from app.core.settings import settings

logger = logging.getLogger("model_loader")


class ModelNotLoadedError(RuntimeError):
    pass


class ModelRegistry:
    def __init__(self) -> None:
        self.model: xgb.Booster | None = None

    def load(self) -> None:
        path = settings.model_path
        if not os.path.exists(path):
            self.model = None
            logger.error("Model file not found at %s", path)
            return

        booster = xgb.Booster()
        booster.load_model(path)
        self.model = booster
        logger.info("Loaded model: %s (version=%s)", path, settings.model_version)

    def require(self) -> xgb.Booster:
        if self.model is None:
            raise ModelNotLoadedError(
                f"Model not loaded. Expected at '{settings.model_path}'. "
                f"Set MODEL_FILENAME/MODEL_DIR or mount the model file."
            )
        return self.model


model_registry = ModelRegistry()