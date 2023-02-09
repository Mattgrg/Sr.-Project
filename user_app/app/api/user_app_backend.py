from flask import Flask
from flask import request
import requests

from . import backend_api
from app.utils.configs import Smart_Hub_API

valid_devices = set()
running_devices = set()

@backend_api.route('/')
def home():
    return "Home Page"

@backend_api.route("/device/command", methods = ["POST"])
def device_command():
    comm = request.get_json()
    device, command = list(comm.items())[0]

    if device not in valid_devices:
        ret = requests.post(Smart_Hub_API.PING, data={device:1})
        if ret == "FAIL":
            return "Device Not Valid"
        valid_devices.add(device)

    if device in running_devices:
        if command == "ON":
            return "Device is already On"
        ret = requests.post(Smart_Hub_API.COMMAND, data=comm)
        if ret == "FAIL":
            return "Device Turn Off Failed"
        running_devices.remove(device)
    else:
        if command == "OFF":
            return "Device is already Off"
        ret = requests.post(Smart_Hub_API.COMMAND, data=comm)
        if ret == "FAIL":
            return "Device Turn On Failed"
        running_devices.add(device)
    return f"Device Turn {command.title()} Success"

@backend_api.route("/device/info", methods = ["GET"])
def device_info():
    return {
            "running_dev" : list(running_devices),
            "valid_dev" : list(valid_devices)
            }
