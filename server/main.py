# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from config import load_config
from connectdb import insertSensorData, lastSensorData

db_config = load_config()

class SensorData(BaseModel):
    temp: float  # Changed to float for precision
    humidity: float
    moisture: float

app = FastAPI(
    title="Plant Monitoring System",  # Fixed typo
    version="0.1",
    description="Hello, Welcome to our Plant Monitoring System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/readSensor/", tags=["For Sensor"])
async def readSensor(data: SensorData):
    result = insertSensorData(db_config, data.temp, data.humidity, data.moisture)
    return result  # Return success/error message

@app.get("/data", tags=["For User"])
async def get_data():
    return lastSensorData(db_config)
