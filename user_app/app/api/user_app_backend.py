from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import time
# from flask_mqtt import Mqtt
import paho.mqtt.client as mqtt
import bluetooth
# import requests

from . import backend_api, mqtt_client, running_devices, all_devices
# from app.utils.configs import Smart_Hub_API


@backend_api.route('/')
@cross_origin()
def home():
    return "Home Page"

def scan_nearby_bluetooth():
    return {name : addr for addr, name in bluetooth.discover_devices(lookup_names=True)}

def send_bluetooth_signal(dev_addr, port, msg):
    sock = bluetooth.BluetoothSocket()
    print("connecting to", dev_addr)
    sock.connect((dev_addr, port))
    sock.send("CONNECT")
    sock.close()

@backend_api.route("/device/bluetooth", methods = ["POST"])
def device_command_bluetooth():
    comm = request.get_json()
    device, command = list(comm.items())[0]
    avail_bluetooth_devs = scan_nearby_bluetooth()
    print("Available Bluetooh:", avail_bluetooth_devs)

    if device not in avail_bluetooth_devs:
        return "Device Not Found"

    if device in running_devices:
        if command == "ON":
            return "Device is already On"
        send_bluetooth_signal(avail_bluetooth_devs[device], 1, command)
        running_devices.remove(device)
    else:
        if command == "OFF":
            return "Device is already Off"
        send_bluetooth_signal(avail_bluetooth_devs[device], 1, command)
        running_devices.add(device)
    return f"Device Turn {command.title()} Success"

@backend_api.route("/device/command", methods = ["POST"])
@cross_origin()
def device_command_mqtt():
    comm = request.get_json()
    device, command = list(comm.items())[0]
    msg = f"{device} {command}"
    if command == "DEL":
        if device in all_devices:
            all_devices.remove(device)
        if device in running_devices:
            running_devices.remove(device)
    print("Recevied Command", comm)
    mqtt_client.publish("device/mqtt_sub", msg)
    print("Command Published (MQTT): ", msg)
    return "True"

@backend_api.route("/device/info", methods = ["GET"])
@cross_origin()
def device_info():
    dev_info =  {
                "all_dev" : list(all_devices),
                "running_dev" : list(running_devices)
                }
    print("Sending", dev_info)
    return dev_info
