from flask import Blueprint
import paho.mqtt.client as mqtt

backend_api = Blueprint("backend_api", __name__)

mqttBroker ="mqtt.eclipseprojects.io" 
mqtt_client = mqtt.Client("API")
mqtt_client.connect(mqttBroker)

def init():
    global running_devices
    running_devices = set()
    global all_devices
    all_devices = set()

init()

from . import user_app_backend
