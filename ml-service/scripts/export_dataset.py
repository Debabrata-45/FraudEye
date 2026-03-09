"""
Phase 8 — Export labeled dataset from PostgreSQL for retraining.
Usage: python scripts/export_dataset.py --out data/retrain_dataset.csv
"""
import os
import argparse
import pandas as pd
import psycopg2
from dotenv import load_dotenv

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
    SELECT
        user_id,
        AVG(amount)::float AS avg_amount,
        STDDEV(amount)::float AS std_amount
    FROM transactions
    GROUP BY user_id
) ua ON ua.user_id = t.user_id
WHERE f.verdict IN ('FRAUD', 'SAFE')
ORDER BY t.occurred_at ASC
"""

def export(out_path: str):
    db_url = os.environ["DATABASE_URL"]
    conn = psycopg2.connect(db_url)
    df = pd.read_sql(SQL, conn)
    conn.close()

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    df.to_csv(out_path, index=False)
    print(f"✅ Exported {len(df)} labeled rows to {out_path}")
    print(f"   FRAUD: {(df['fraud_label']==1).sum()} | SAFE: {(df['fraud_label']==0).sum()}")
    print(f"   Columns: {df.columns.tolist()}")
    return df

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="data/retrain_dataset.csv")
    args = parser.parse_args()
    export(args.out)