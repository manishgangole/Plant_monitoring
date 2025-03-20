
# Plant Monitoring System
A system to monitor plant health using temperature, humidity, and moisture sensors.

## Features
- Real-time dashboard with live charts.
- Data storage in PostgreSQL.
- REST API with FastAPI.

## Setup
1. Install dependencies: `pip install fastapi uvicorn psycopg2-binary`
2. Set up PostgreSQL with `postgre.sql`.
3. Run the backend: `uvicorn main:app --reload`
4. Open `index.html` in a browser.

## Tech Stack
- Backend: FastAPI, PostgreSQL
- Frontend: HTML, CSS, Chart.js
