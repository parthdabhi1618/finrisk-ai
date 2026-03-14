from datetime import datetime


DEMO_COMPANIES = {
    "RELIANCE": {
        "company_name": "Reliance Industries",
        "features": {
            "X1": 150000,
            "X2": 90000,
            "X3": 5000,
            "X4": 20000,
            "X5": 25000,
            "X6": 15000,
            "X7": 30000,
            "X8": 200000000000,
            "X9": 180000,
            "X10": 300000,
            "X11": 50000,
            "X12": 18000,
            "X13": 70000,
            "X14": 40000,
            "X15": 80000,
            "X16": 180000,
            "X17": 120000,
            "X18": 90000,
        },
    },
    "TCS": {
        "company_name": "Tata Consultancy Services",
        "features": {
            "X1": 60000,
            "X2": 20000,
            "X3": 2000,
            "X4": 25000,
            "X5": 1000,
            "X6": 22000,
            "X7": 25000,
            "X8": 150000000000,
            "X9": 100000,
            "X10": 120000,
            "X11": 10000,
            "X12": 23000,
            "X13": 60000,
            "X14": 15000,
            "X15": 50000,
            "X16": 100000,
            "X17": 40000,
            "X18": 30000,
        },
    },
    "ZOMATO": {
        "company_name": "Zomato Ltd",
        "features": {
            "X1": 8000,
            "X2": 3000,
            "X3": 500,
            "X4": 1000,
            "X5": 100,
            "X6": -200,
            "X7": 1200,
            "X8": 15000000000,
            "X9": 7000,
            "X10": 20000,
            "X11": 2000,
            "X12": 800,
            "X13": 3000,
            "X14": 2500,
            "X15": -1000,
            "X16": 7000,
            "X17": 6000,
            "X18": 5000,
        },
    },
    "ADANIENT": {
        "company_name": "Adani Enterprises",
        "features": {
            "X1": 30000,
            "X2": 15000,
            "X3": 2000,
            "X4": 5000,
            "X5": 3000,
            "X6": 2500,
            "X7": 8000,
            "X8": 80000000000,
            "X9": 40000,
            "X10": 90000,
            "X11": 25000,
            "X12": 4500,
            "X13": 12000,
            "X14": 10000,
            "X15": 20000,
            "X16": 40000,
            "X17": 45000,
            "X18": 20000,
        },
    },
}


def fetch_indian_company_data(symbol: str):

    ticker = symbol.upper()

    if ticker not in DEMO_COMPANIES:
        raise ValueError(
            f"Demo data not available for {ticker}. "
            f"Try: {', '.join(DEMO_COMPANIES.keys())}"
        )

    company = DEMO_COMPANIES[ticker]

    data = company["features"].copy()
    data["year"] = datetime.now().year

    return {
        "company_name": company["company_name"],
        "symbol": ticker,
        "features": data
    }
