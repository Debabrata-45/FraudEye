import os
import numpy as np
import pandas as pd
import psycopg2
from dotenv import load_dotenv
from app.features.engineer import build_features
from app.features.schema import FEATURES

load_dotenv()

SQL = """
SELECT
    t.id::text                        AS transaction_id,
    t.user_id::text                   AS user_id,
    t.merchant_id,
    t.amount::float                   AS amount,
    t.currency,
    t.occurred_at::text               AS timestamp,
    t.device_id,
    t.geo_lat                         AS latitude,
    t.geo_lng                         AS longitude,
    t.ip_address,
    COALESCE(m.risk_score, 1)::float  AS merchant_risk_level,
    COALESCE(ua.avg_amount, 0)::float AS user_avg_spend_30d,
    COALESCE(ua.std_amount, 0)::float AS user_std_spend_30d,
    CASE WHEN f.verdict = 'FRAUD' THEN 1 ELSE 0 END AS fraud_label
FROM feedback f
JOIN transactions t ON t.id = f.transaction_id
LEFT JOIN merchants m ON m.id = t.merchant_id
LEFT JOIN (
    SELECT user_id,
           AVG(amount)::float  AS avg_amount,
           STDDEV(amount)::float AS std_amount
    FROM transactions GROUP BY user_id
) ua ON ua.user_id = t.user_id
WHERE f.verdict IN ('FRAUD', 'SAFE')
ORDER BY t.occurred_at ASC
"""


def load_feedback_dataset():
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    df = pd.read_sql(SQL, conn)
    conn.close()
    return df


def prepare_xy(df: pd.DataFrame):
    df_feat = build_features(df)
    X = df_feat[FEATURES].astype(np.float32).values
    y = df_feat["fraud_label"].astype(int).values
    return X, y