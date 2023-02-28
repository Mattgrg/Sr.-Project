from flask import Flask, request, jsonify
import paho.mqtt.client as mqtt
import time
import datetime

from app.api import backend_api, mqttBroker

app = Flask(__name__)
app.register_blueprint(backend_api)

def on_message(client, userdata, message):
    print(datetime.datetime.now(), "received message: " ,str(message.payload.decode("utf-8")))

def on_connect(client, userdata, flags, rc):
    client.subscribe("device/mqtt_pub")

if  __name__ == "__main__":
    mqtt_client = mqtt.Client("Routine_Check")
    mqtt_client.on_connect=on_connect
    mqtt_client.on_message=on_message 
    mqtt_client.connect(mqttBroker)
    mqtt_client.loop_start()
    app.run(host="0.0.0.0", port=5000, debug=True)
