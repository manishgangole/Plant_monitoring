#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#define DHT11_PIN  21
#define AOUT_PIN 36

const int relayMotar = 22;

const char* ssid = "[WIFI SSID]";
const char* password = "[WIFI PASSWORD]";
const char* serverName = "http://140.238.163.29:8000/readSensor/";


unsigned long lastTime = 0;
unsigned long timerDelay = 5000;

DHT dht11(DHT11_PIN, DHT11);

void setup() {
  Serial.begin(115200);

  pinMode(relayMotar, OUTPUT);
  digitalWrite(relayMotar, LOW);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  dht11.begin();
 
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    if(WiFi.status()== WL_CONNECTED){


      int humi  = dht11.readHumidity();
      int tempC = dht11.readTemperature();
      int moist = (map(analogRead(AOUT_PIN),4095,2120,0,100));

      if(moist < 20){
        digitalWrite(relayMotar, HIGH);
      }
      if(moist > 60){
        digitalWrite(relayMotar, LOW);
      }

      // humi = 56;
      // tempC = 29;
      // moist = 69;

      // Create a JSON object with the readings
      String json = "{\"temp\":";
      json += tempC;
      json += ",\"humidity\":";
      json += humi;
      json += ",\"moisture\":";
      json += moist;
      json += "}";

      Serial.println(json);

      WiFiClient client;
      HTTPClient http;
      http.begin(client, serverName);
      http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.POST(json);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
