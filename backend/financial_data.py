import yfinance as yf
import pandas as pd
from datetime import datetime

def fetch_indian_company_data(symbol: str):
    """
    Fetches financial data for a given Indian company symbol (e.g., RELIANCE, TCS).
    Appends .NS if no suffix is provided.
    """
    if not symbol.endswith(".NS") and not symbol.endswith(".BO"):
        ticker_symbol = symbol + ".NS"
    else:
        ticker_symbol = symbol
        
    ticker = yf.Ticker(ticker_symbol)
    
    try:
        balance_sheet = ticker.balance_sheet
        income_stmt = ticker.income_stmt
        cashflow = ticker.cashflow
        info = ticker.get_info() if hasattr(ticker, "get_info") else ticker.info

    if not info:
        raise ValueError("Yahoo Finance returned empty company info")

except Exception as e:
    raise ValueError(f"Error fetching data for {ticker_symbol}: {str(e)}")

    if balance_sheet.empty or income_stmt.empty:
        raise ValueError(f"Could not find financial statements for {ticker_symbol}")

    # Use the most recent year's data (first column)
    bs = balance_sheet.iloc[:, 0]
    is_ = income_stmt.iloc[:, 0]
    cf = cashflow.iloc[:, 0] if not cashflow.empty else pd.Series(0)

    # Map yfinance fields to X1-X18
    # Note: Yahoo Finance column names can vary. Using .get() for safety.
    
    data = {
        "year": datetime.now().year, # Current year for prediction
        "X1": bs.get("Current Assets", 0),
        "X2": is_.get("Cost Of Revenue", 0),
        "X3": cf.get("Depreciation And Amortization", 0),
        "X4": is_.get("EBITDA", 0),
        "X5": bs.get("Inventory", 0),
        "X6": is_.get("Net Income", 0),
        "X7": bs.get("Receivables", 0),
        "X8": info.get("marketCap", 0),
        "X9": is_.get("Total Revenue", 0), # Net Sales approx
        "X10": bs.get("Total Assets", 0),
        "X11": bs.get("Long Term Debt", 0),
        "X12": is_.get("Operating Income", 0), # EBIT approx
        "X13": is_.get("Gross Profit", 0),
        "X14": bs.get("Total Current Liabilities", 0),
        "X15": bs.get("Retained Earnings", 0),
        "X16": is_.get("Total Revenue", 0),
        "X17": bs.get("Total Liabilities Net Minority Interest", bs.get("Total Liabilities", 0)),
        "X18": is_.get("Total Operating Expenses", 0),
    }
    
    # Convert all to numeric (float)
    data = {k: float(v) if v is not None else 0.0 for k, v in data.items()}
    
    return {
        "company_name": info.get("longName", symbol),
        "symbol": ticker_symbol,
        "features": data
    }
