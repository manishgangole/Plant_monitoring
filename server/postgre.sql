-- postgre.sql
-- Table: public.plant_data

-- DROP TABLE IF EXISTS public.plant_data;

CREATE TABLE IF NOT EXISTS public.plant_data
(
    date_time timestamp without time zone NOT NULL DEFAULT now(),
    temp real,
    humidity real,
    moisture real,
    CONSTRAINT plant_data_pkey PRIMARY KEY (date_time),
    CONSTRAINT plant_data_temp_check CHECK (temp >= -20 AND temp <= 50),  -- Wider range for temp
    CONSTRAINT plant_data_humidity_check CHECK (humidity >= 0 AND humidity <= 100),
    CONSTRAINT plant_data_moisture_check CHECK (moisture >= 0 AND moisture <= 100)
);

ALTER TABLE IF EXISTS public.plant_data
    OWNER to manish;
