from pydantic import BaseModel
import os


class Settings(BaseModel):
    app_name: str = "fraudeye-ml-service"
    model_dir: str = "models"
    model_filename: str = "xgb_v1.json"  # change if you store .bin
    model_version: str = "xgb_v1"

    # optional toggles
    log_level: str = "INFO"

    @property
    def model_path(self) -> str:
        return os.path.join(self.model_dir, self.model_filename)


settings = Settings(
    model_dir=os.getenv("MODEL_DIR", "models"),
    model_filename=os.getenv("MODEL_FILENAME", "xgb_v1.json"),
    model_version=os.getenv("MODEL_VERSION", "xgb_v1"),
    log_level=os.getenv("LOG_LEVEL", "INFO"),
)