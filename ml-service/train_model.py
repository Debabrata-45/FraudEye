import numpy as np
import xgboost as xgb
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

# Match EXACTLY the 10 features in prediction_service.py
X, y = make_classification(
    n_samples=10000,
    n_features=10,        # ← changed from 20 to 10
    n_informative=7,
    n_redundant=2,
    n_repeated=1,
    weights=[0.95, 0.05],
    random_state=42
)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

params = {
    "objective": "binary:logistic",
    "eval_metric": "auc",
    "max_depth": 6,
    "eta": 0.1,
    "scale_pos_weight": 19,
}

model = xgb.train(
    params,
    dtrain,
    num_boost_round=100,
    evals=[(dtest, "test")],
    verbose_eval=10
)

model.save_model("models/xgb_v1.json")
print("✅ Model saved to models/xgb_v1.json")