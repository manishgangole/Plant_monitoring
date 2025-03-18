# connectdb.py
import psycopg2

def insertSensorData(config, t, h, m):
    try:
        with psycopg2.connect(**config) as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO plant_data (temp, humidity, moisture) VALUES (%s, %s, %s)", (t, h, m))
            conn.commit()
            return {"status": "success", "message": "Data inserted successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def lastSensorData(config):
    try:
        with psycopg2.connect(**config) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT temp, humidity, moisture, date_time FROM public.plant_data ORDER BY date_time DESC LIMIT 1")
            result = cursor.fetchone()
            if result:
                t, h, m, dt = result
                return {
                    "temp": float(t),
                    "humidity": float(h),
                    "moisture": float(m),
                    "date_time": str(dt)
                }
            return {"temp": 0, "humidity": 0, "moisture": 0, "date_time": "No data"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Remove redundant individual functions (lastTemp, lastHumidity, lastMoisture) since lastSensorData covers it
