//This example code is in the Public Domain (or CC0 licensed, at your option.)
//By Evandro Copercini - 2018
//Edited by Kristina Mason - 2023 for the purposes of acting like a smart switch
//
//This code communicates via bluetooth in order to switch a relay on and off
//Using an ESP32
//Note: Relay needs power in order to be used

#include "BluetoothSerial.h"

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

#if !defined(CONFIG_BT_SPP_ENABLED)
#error Serial Bluetooth not available or not enabled. It is only available for the ESP32 chip.
#endif

BluetoothSerial SerialBT;
byte lightSwitchStatus = 1; //1=on 0=off
byte mask = 1;

void setup() {
  Serial.begin(115200);
  SerialBT.begin("ESP32 Relay Test"); //Bluetooth device name
  //Serial.println("The device started, now you can pair it with bluetooth!");
  pinMode(5, OUTPUT);
}

void loop() {
  //if (Serial.available()) { //Writes to BT device (the phone)
    //SerialBT.write(Serial.read());
  //}
  //lightSwitchStatus = mask^lightSwitchStatus;
  if (SerialBT.available()) { //Writes to Serial Monitor (the ESP)
    Serial.write(SerialBT.read());
    //Should it matter what comes into the input stream?
    //lightSwitchStatus = SerialBT.parseInt();
    //Serial.println(lightSwitchStatus);
    lightSwitchStatus = mask^lightSwitchStatus;
    digitalWrite(5, lightSwitchStatus);
    //SerialBT.print("Light Switch Status: ");
    //Serial.println(lightSwitchStatus);
  }
  delay(100);
}

