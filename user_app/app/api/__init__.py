from flask import Blueprint
import paho.mqtt.client as mqtt

backend_api = Blueprint("backend_api", __name__)

mqttBroker ="mqtt.eclipseprojects.io" 
mqtt_client = mqtt.Client("API")
mqtt_client.connect(mqttBroker)

from . import user_app_backend
