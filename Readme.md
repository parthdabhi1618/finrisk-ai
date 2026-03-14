# FinRisk AI

FinRisk AI is a full-stack Machine Learning platform that predicts the financial bankruptcy risk of companies using financial indicators and historical financial data.

The platform combines a trained ML model with a modern web interface, allowing users to input company financial metrics and instantly receive a bankruptcy risk prediction.

---

## Overview

FinRisk AI demonstrates how Machine Learning models can be integrated into a real-world web application.

The system analyzes financial indicators from companies and predicts whether a company is at risk of financial failure based on historical financial patterns.

The project includes:

• A trained Machine Learning model
• A Python backend API for prediction
• A React + TypeScript frontend interface
• A financial dataset used for training and evaluation

---

## System Architecture

React Frontend (Vite + TypeScript)

↓

Python Backend API

↓

Trained ML Model

↓

Risk Prediction Output

---

## Features

• Predict bankruptcy risk from financial indicators
• Public prediction interface for quick testing
• Custom financial data prediction inputs
• Risk visualization using a dynamic Risk Meter
• Full Machine Learning pipeline for model training
• Full stack architecture (React + Python backend)

---

## Tech Stack

### Frontend

React
TypeScript
Vite

### Backend

Python
Flask / FastAPI

### Machine Learning

Scikit-Learn
Pandas
NumPy
Joblib

### Deployment

Vercel — Frontend
Railway — Backend

---

## Project Structure

```
finrisk-ai
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── CustomPrediction.tsx
│   │   │   ├── PublicPrediction.tsx
│   │   │   ├── RiskMeter.tsx
│   │   │   └── ModelInfo.tsx
│   │   └── App.tsx
│
├── backend
│   ├── main.py
│   ├── financial_data.py
│   └── model_utils.py
│
├── american_bankruptcy.csv
├── bankruptcy_ml_pipeline.ipynb
└── requirements.txt
```

---

## Running Locally

### Clone the repository

```
git clone https://github.com/YOUR_USERNAME/finrisk-ai
cd finrisk-ai
```

---

### Start Backend

```
cd backend
pip install -r requirements.txt
python main.py
```

---

### Start Frontend

```
cd frontend
npm install
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## Machine Learning Pipeline

The model was trained using historical financial company data.

Pipeline steps include:

• Data preprocessing
• Feature engineering
• Model training using Scikit-Learn
• Model evaluation
• Exporting trained model using Joblib

---

## Future Improvements

• Add advanced financial visualizations
• Improve UI analytics dashboard
• Add more financial indicators
• Support multiple ML models
• Deploy scalable inference API

---

## Live Demo

Frontend: https://finrisk-ai-sigma.vercel.app/
Backend API: https://finrisk-ai-ydr5.onrender.com

---

## Author

FinRisk AI was developed as a Machine Learning and Full Stack project demonstrating how predictive models can be deployed as interactive web applications.
