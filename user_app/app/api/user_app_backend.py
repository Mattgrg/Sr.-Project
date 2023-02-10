from flask import Flask
from flask import request
import bluetooth
# import requests

from . import backend_api
# from app.utils.configs import Smart_Hub_API

running_devices = set()

@backend_api.route('/')
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

@backend_api.route("/device/command", methods = ["POST"])
def device_command():
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

@backend_api.route("/device/info", methods = ["GET"])
def device_info():
    return {
            "running_dev" : list(running_devices),
            }
