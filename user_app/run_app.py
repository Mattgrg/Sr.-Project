from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import paho.mqtt.client as mqtt
import time
import datetime

from app.api import backend_api, mqttBroker, running_devices, all_devices

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.register_blueprint(backend_api)


def on_message(client, userdata, message):
    msg = str(message.payload.decode("utf-8"))
    dev, stat, comm, fault = msg.split()
    if (comm == "1"):
        running_devices.add(dev)
        all_devices.add(dev)
    else:
        all_devices.add(dev)
        if dev in running_devices:
            running_devices.remove(dev)
    print(datetime.datetime.now(), "received message: " , msg)

def on_connect(client, userdata, flags, rc):
    client.subscribe("device/mqtt_pub")

if  __name__ == "__main__":
    mqtt_client = mqtt.Client("Routine_Check")
    mqtt_client.on_connect=on_connect
    mqtt_client.on_message=on_message 
    mqtt_client.connect(mqttBroker)
    mqtt_client.loop_start()
    app.run(host="0.0.0.0", port=5000, debug=True)
