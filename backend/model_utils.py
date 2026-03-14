import joblib
import pandas as pd
import numpy as np
from pathlib import Path

FEATURE_MAPPING = {
    "X1": "Current Assets",
    "X2": "Cost of Goods Sold",
    "X3": "Depreciation and Amortization",
    "X4": "EBITDA",
    "X5": "Inventory",
    "X6": "Net Income",
    "X7": "Total Receivables",
    "X8": "Market Value",
    "X9": "Net Sales",
    "X10": "Total Assets",
    "X11": "Total Long-term Debt",
    "X12": "EBIT",
    "X13": "Gross Profit",
    "X14": "Total Current Liabilities",
    "X15": "Retained Earnings",
    "X16": "Total Revenue",
    "X17": "Total Liabilities",
    "X18": "Total Operating Expenses",
}

TOP_FEATURES = ["X6", "X10", "X17", "X1", "X4", "X11"] 

BASE_DIR = Path(__file__).resolve().parent
ARTIFACT_PATH = BASE_DIR / "bankruptcy_prediction_artifact.joblib"

def load_model():
    if not ARTIFACT_PATH.exists():
        raise FileNotFoundError(f"Model artifact not found at {ARTIFACT_PATH}")
    return joblib.load(ARTIFACT_PATH)

def generate_insights(df, risk_prob):
    """Generate traditional financial ratios and actionable insights."""
    insights = []
    ratios = {}
    
    # Safely get values, defaulting to a small number to avoid division by zero
    val = lambda col: float(df[col].iloc[0]) if col in df.columns else 0.001
    
    # 1. Liquidity: Current Ratio (Current Assets / Current Liabilities)
    ca = val("X1")
    cl = val("X14")
    current_ratio = ca / cl if cl != 0 else 0
    ratios['current_ratio'] = round(current_ratio, 2)
    
    if current_ratio < 1.0:
        insights.append({"type": "warning", "title": "Severe Liquidity Crunch", "desc": f"Current ratio is {current_ratio:.2f}. The company lacks sufficient short-term assets to cover its immediate liabilities. Immediate cash-flow management is required."})
    elif current_ratio > 2.5:
        insights.append({"type": "info", "title": "Inefficient Asset Use", "desc": "High current ratio indicates excess idle cash or inventory that could be reinvested for growth."})
    else:
        insights.append({"type": "success", "title": "Healthy Liquidity", "desc": "Short-term obligations are well covered by current assets."})

    # 2. Solvency: Debt to Asset Ratio (Total Liabilities / Total Assets)
    ta = val("X10")
    tl = val("X17")
    debt_asset = tl / ta if ta != 0 else 0
    ratios['debt_to_asset'] = round(debt_asset, 2)
    
    if debt_asset > 0.6:
        insights.append({"type": "warning", "title": "High Leverage Risk", "desc": f"Debt-to-Asset is {debt_asset:.2f}. The company is highly leveraged, making it vulnerable to interest rate hikes and credit tightening."})
    else:
        insights.append({"type": "success", "title": "Manageable Debt Levels", "desc": "The company maintains a sustainable balance between debt and assets."})

    # 3. Profitability: Net Profit Margin (Net Income / Revenue)
    ni = val("X6")
    rev = val("X16")
    margin = (ni / rev * 100) if rev != 0 else 0
    ratios['net_margin_pct'] = round(margin, 2)
    
    if margin < 0:
        insights.append({"type": "warning", "title": "Negative Profitability", "desc": "The company is operating at a net loss. Cost structures need immediate rationalization to stop capital burn."})
    elif margin > 15:
        insights.append({"type": "success", "title": "Strong Profit Margins", "desc": f"A robust net margin of {margin:.2f}% provides a strong buffer against market downturns."})

    # Add AI holistic summary based on ML probability
    if risk_prob > 0.6:
        insights.insert(0, {"type": "critical", "title": "AI Restructuring Alert", "desc": "Our machine learning model detects patterns historically associated with corporate insolvency. A strategic review of operational expenses and debt restructuring is highly recommended."})
    elif risk_prob < 0.2:
        insights.insert(0, {"type": "success", "title": "AI Validation: Strong Fundamentals", "desc": "The ML model classifies the financial structure as highly resilient, showing patterns consistent with industry leaders."})

    return ratios, insights

def predict_bankruptcy(input_data: dict):
    artifact = load_model()
    pipeline = artifact["pipeline"]
    threshold = artifact["threshold"]
    feature_columns = artifact["feature_columns"]
    
    df = pd.DataFrame([input_data])
    df_model = df[feature_columns]
    
    prob = pipeline.predict_proba(df_model)[:, 1][0]
    prediction = int(prob >= threshold)
    
    contributions = []
    model = pipeline.named_steps['model']
    importances = model.feature_importances_ if hasattr(model, 'feature_importances_') else None
    
    if importances is not None:
        for idx, feat in enumerate(feature_columns):
            if feat.startswith('X'):
                val = float(df_model[feat].iloc[0])
                importance = float(importances[idx])
                contributions.append({
                    "id": feat,
                    "name": FEATURE_MAPPING.get(feat, feat),
                    "value": val,
                    "importance": float(round(importance * 100, 2)) # as percentage
                })
        
        contributions = sorted(contributions, key=lambda x: x['importance'], reverse=True)[:5]

    ratios, insights = generate_insights(df, prob)

    return {
        "probability": float(prob),
        "prediction": prediction,
        "threshold": float(threshold),
        "status": "Insolvent / High Risk" if prediction == 1 else "Financially Stable",
        "risk_level": "Critical" if prob > 0.8 else "High" if prob > 0.5 else "Moderate" if prob > 0.2 else "Low",
        "analysis": contributions,
        "ratios": ratios,
        "insights": insights
    }

def get_model_info():
    artifact = load_model()
    return {
        "model_name": artifact["model_name"],
        "threshold": artifact["threshold"],
        "features": FEATURE_MAPPING,
        "top_features": TOP_FEATURES
    }
