## Features

**Core**
- Transaction ingestion with real-time risk scoring (0–100) and label (SAFE / MEDIUM / HIGH / FRAUD)
- XGBoost model with SHAP + LIME explainability per transaction
- Live dashboard with SSE-powered real-time feed
- Analyst actions: mark fraud/safe, flag user, flag merchant
- JWT authentication with role-based access control (Admin / Analyst)
- Audit logs for all analyst actions

**Advanced**
- Dynamic merchant risk scoring updated on FRAUD verdicts
- Feedback loop — analyst labels feed retraining pipeline
- Device trust scoring and geo-impossibility detection
- Behavioral feature engineering (velocity, spend patterns, device anomalies)
- Model versioning, comparison reports, and one-command model switch
- Queue monitoring dashboard (waiting / active / completed / failed jobs)
- Model metrics dashboard

---


## Architecture
Browser
   │  HTTP + SSE
   ▼
Frontend (React + Vite)
   │  REST API
   ▼
Backend API (Node.js + Express)
   ├──► PostgreSQL  (store raw transaction)
   └──► Redis/BullMQ  (enqueue job)
              │
              ▼
         Worker (Node.js)
              │  POST /infer
              ▼
         ML Service (FastAPI)
         XGBoost → risk score + label
         SHAP + LIME → explanation
              │
              ▼
         Worker stores prediction → PostgreSQL
         Worker publishes update → Redis pub/sub → SSE → Frontend
```

# FraudEye — AI-Powered Fraud Detection System

An end-to-end fraud detection platform with Explainable AI (XAI), real-time streaming, and human-in-the-loop analyst feedback.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Queue | Redis + BullMQ |
| Worker | Node.js BullMQ Worker |
| ML Service | Python FastAPI |
| Model | XGBoost |
| Explainability | SHAP + LIME |
| Deployment | Docker + Docker Compose |

---

## Prerequisites

- Docker Desktop (running)
- Node.js 20+
- Python 3.11+
- Git

---

## Quick Start (Local Dev)

### 1. Clone the repository
```bash
git clone https://github.com/Debabrata-45/FraudEye.git
cd FraudEye
```

### 2. Start infrastructure (PostgreSQL + Redis)
```bash
cd infra
docker compose up -d postgres redis
```

### 3. Start Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```

### 4. Start ML Service (Terminal 2)
```bash
cd ml-service
python -m venv .venv
.venv\Scripts\Activate.ps1       # Windows
source .venv/bin/activate         # Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --port 8000
```

### 5. Start Worker (Terminal 3)
```bash
cd backend/worker
npm install
node src/index.js
```

### 6. Start Frontend (Terminal 4)
```bash
cd frontend
npm install
npm run dev
```

### 7. Open Dashboard
```
http://localhost:5173
```

---

## One-Command Docker Run
```bash
cd infra
docker compose up --build
```

Then open: `http://localhost:5173`

---

## Default Login Credentials (Demo Only)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fraudeye.com | Admin@12345 |
| Analyst | analyst@fraudeye.com | Analyst@12345 |

---

## Seed Demo Transactions

After starting all services, run:
```powershell
# Windows
.\infra\seed_transactions.ps1
```

This sends 10 sample transactions (5 safe + 5 fraud) to the live feed.

---

## API Quick Test

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"analyst@fraudeye.com","password":"Analyst@12345"}'
```

### Submit Transaction
```bash
curl -X POST http://localhost:4000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "transactionId": "txn_demo_001",
    "userId": "user_01",
    "merchantId": "merch_001",
    "amount": 95000,
    "currency": "INR",
    "deviceId": "device_new_001",
    "ipAddress": "185.220.101.5",
    "geoLat": 55.7558,
    "geoLng": 37.6173,
    "occurredAt": "2026-03-09T02:00:00Z"
  }'
```

### Health Checks
```bash
curl http://localhost:4000/health    # Backend
curl http://localhost:8000/health    # ML Service
```

---

## Verify Predictions in DB
```bash
docker exec -it fraudeye-postgres psql -U fraudeye -d fraudeye_db \
  -c "SELECT id, risk_score, risk_label, model_version, created_at FROM transaction_predictions ORDER BY created_at DESC LIMIT 5"
```

---

## View Dashboard

1. Open `http://localhost:5173`
2. Login as analyst
3. Watch **Live Feed** for real-time scored transactions
4. Click any row to open **Transaction Detail** drawer
5. View Risk Score, SHAP explanation, Top Risk Factors
6. Use **Analyst Actions**: Mark Fraud / Mark Safe / Flag User / Flag Merchant

---

## Run Tests

### Backend Tests
```bash
cd backend
npm test
```

### ML Service Tests
```bash
cd ml-service
.venv\Scripts\Activate.ps1
pytest tests/ -v
```

---

## Retraining Pipeline (Phase 8)
```bash
cd ml-service
.venv\Scripts\Activate.ps1

# Export analyst-labeled data
python scripts/export_dataset.py --out data/retrain_dataset.csv

# Retrain model
python scripts/train_model.py --version xgb_v2 \
  --data data/retrain_dataset.csv \
  --synthetic fraudeye_synthetic_transactions.csv \
  --models-dir models

# Compare models
python scripts/compare_models.py

# Switch to new model
python scripts/switch_model.py --version xgb_v2

# Rollback to original
python scripts/rollback_model.py --version xgb_v1
```

---

## Service Ports

| Service | Port |
|---------|------|
| Frontend | 5173 |
| Backend | 4000 |
| ML Service | 8000 |
| PostgreSQL | 5433 |
| Redis | 6379 |

---

## Troubleshooting

**SSE connection lost**
- Make sure you are logged in — SSE requires a valid JWT token
- Check backend is running on port 4000

**Transactions not appearing in feed**
- Make sure worker is running: `cd backend/worker && node src/index.js`
- Make sure ML service is running on port 8000
- Check worker terminal for errors

**PostgreSQL connection refused**
- Make sure Docker is running: `docker ps`
- Start postgres: `cd infra && docker compose up -d postgres redis`

**Worker scoring old transactions**
- Worker skips already-scored transactions (idempotency check)
- Only new transactions will be processed

**Model not loading in ML service**
- Check `ml-service/models/current_model.json` exists
- Verify model file path is correct
- Restart ML service after switching models

---

## Project Structure
```
FraudEye/
├── backend/              # Node.js Express API
│   ├── src/
│   │   ├── modules/      # auth, transactions, stream, queue, feedback, actions
│   │   ├── middlewares/  # auth, rateLimit, errorHandler
│   │   └── db/           # PostgreSQL pool + migrations
│   └── worker/           # BullMQ worker
├── frontend/             # React + Vite + Tailwind
│   └── src/
│       ├── pages/        # Login, TransactionsFeed, Analytics, Queue
│       └── components/   # Layout, Sidebar, RiskBadge
├── ml-service/           # FastAPI + XGBoost
│   ├── app/
│   │   ├── api/          # routes, schemas
│   │   ├── ml/           # predict, explain_shap, explain_lime
│   │   ├── features/     # engineer.py, schema.py
│   │   └── models/       # artifacts.py
│   ├── scripts/          # export_dataset, train_model, switch_model, rollback_model
│   └── models/           # versioned model artifacts
└── infra/                # Docker Compose, seed scripts
```

---

## License

MIT — Built as a Minor Project for academic research purposes.