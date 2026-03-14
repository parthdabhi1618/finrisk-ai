from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List
from backend import model_utils
from backend import financial_data

app = FastAPI(title="Bankruptcy Prediction API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CustomInput(BaseModel):
    year: int
    X1: float
    X2: float
    X3: float
    X4: float
    X5: float
    X6: float
    X7: float
    X8: float
    X9: float
    X10: float
    X11: float
    X12: float
    X13: float
    X14: float
    X15: float
    X16: float
    X17: float
    X18: float

@app.get("/info")
def get_info():
    try:
        return model_utils.get_model_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predict/public/{symbol}")
def predict_public(symbol: str):
    try:
        company_data = financial_data.fetch_indian_company_data(symbol)
        prediction = model_utils.predict_bankruptcy(company_data["features"])
        return {
            "company_name": company_data["company_name"],
            "symbol": company_data["symbol"],
            "features": company_data["features"],
            "prediction": prediction
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/custom")
def predict_custom(data: CustomInput):
    try:
        prediction = model_utils.predict_bankruptcy(data.dict())
        return {
            "prediction": prediction
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
