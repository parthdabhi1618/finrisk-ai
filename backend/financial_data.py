import requests
import os
from datetime import datetime

API_KEY = os.getenv("FMP_API_KEY")

BASE_URL = "https://financialmodelingprep.com/api/v3"


def fetch_indian_company_data(symbol: str):
    """
    Fetch financial data using Financial Modeling Prep API.
    """

    ticker = symbol.upper()

    try:
        # Balance Sheet
        bs_url = f"{BASE_URL}/balance-sheet-statement/{ticker}?limit=1&apikey={API_KEY}"
        bs_res = requests.get(bs_url)
        bs_data = bs_res.json()

        # Income Statement
        is_url = f"{BASE_URL}/income-statement/{ticker}?limit=1&apikey={API_KEY}"
        is_res = requests.get(is_url)
        is_data = is_res.json()

        # Cashflow
        cf_url = f"{BASE_URL}/cash-flow-statement/{ticker}?limit=1&apikey={API_KEY}"
        cf_res = requests.get(cf_url)
        cf_data = cf_res.json()

        # Company profile
        profile_url = f"{BASE_URL}/profile/{ticker}?apikey={API_KEY}"
        profile_res = requests.get(profile_url)
        profile_data = profile_res.json()

        if not bs_data or not is_data:
            raise ValueError(f"No financial data found for {ticker}")

        bs = bs_data[0]
        is_ = is_data[0]
        cf = cf_data[0] if cf_data else {}

        company_name = profile_data[0]["companyName"] if profile_data else ticker
        market_cap = profile_data[0]["mktCap"] if profile_data else 0

    except Exception as e:
        raise ValueError(f"FMP API error for {ticker}: {str(e)}")

    data = {
        "year": datetime.now().year,

        "X1": bs.get("totalCurrentAssets", 0),
        "X2": is_.get("costOfRevenue", 0),
        "X3": cf.get("depreciationAndAmortization", 0),
        "X4": is_.get("ebitda", 0),
        "X5": bs.get("inventory", 0),
        "X6": is_.get("netIncome", 0),
        "X7": bs.get("netReceivables", 0),
        "X8": market_cap,
        "X9": is_.get("revenue", 0),
        "X10": bs.get("totalAssets", 0),
        "X11": bs.get("longTermDebt", 0),
        "X12": is_.get("operatingIncome", 0),
        "X13": is_.get("grossProfit", 0),
        "X14": bs.get("totalCurrentLiabilities", 0),
        "X15": bs.get("retainedEarnings", 0),
        "X16": is_.get("revenue", 0),
        "X17": bs.get("totalLiabilities", 0),
        "X18": is_.get("operatingExpenses", 0),
    }

    # Convert all values to float
    data = {k: float(v) if v is not None else 0.0 for k, v in data.items()}

    return {
        "company_name": company_name,
        "symbol": ticker,
        "features": data
    }
