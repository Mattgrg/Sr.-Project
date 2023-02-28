#include "PubSubClient.h"

#include "WiFi.h"

const char* ssid = "Pixel3";
const char* password = "mattmadi";

// Replace your MQTT Broker IP address here:
const char* mqtt_server = "192.168.1.45";

WiFiClient espClient;
PubSubClient client(espClient);

#define ledPin 2 //built-in LED of ESP32

long lastMsg = 0;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(115200);

    // Connect to the WiFi
  WiFi.begin(ssid, password);

  // Wait until the connection is confirmed
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  client.setServer(mqtt_server,1883);//1883 is the default port for MQTT server
  client.setCallback(callback);

}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();

  // Check if a message is received on the topic "rpi/broadcast"
  if (String(topic) == "rpi/broadcast") {
      if(messageTemp == "10"){
        Serial.println("Action: blink LED");
        digitalWrite (ledPin, HIGH); // turn off the LED

        delay(1250); // wait for half a second or 500 milliseconds

        digitalWrite (ledPin, LOW); // turn off the LED //blink LED once (for 1250ms ON time)
      }
  }

  //Similarly add more if statements to check for other subscribed topics 
}
void connect_mqttServer() {
  // Loop until we're reconnected
  while (!client.connected()) {

        //now attemt to connect to MQTT server
        Serial.print("Attempting MQTT connection...");
        // Attempt to connect
        if (client.connect("ESP32_client1")) { // Change the name of client here if multiple ESP32 are connected. This should be a unique name.
          //attempt successful
          Serial.println("connected");
          // Subscribe to topics here
          client.subscribe("rpi/broadcast");
          //client.subscribe("rpi/xyz"); //subscribe more topics here
          
        } 
        else {
          //attempt not successful
          Serial.print("failed, rc=");
          Serial.print(client.state());
          Serial.println(" trying again in 2 seconds");
    
          digitalWrite (ledPin, HIGH);  // turn on the LED

          delay(200); // wait for half a second or 500 milliseconds

          digitalWrite (ledPin, LOW); // turn off the LED

          delay(200); // wait for half a second or 500 milliseconds

          digitalWrite (ledPin, HIGH); // turn off the LED

          delay(200); // wait for half a second or 500 milliseconds

          digitalWrite (ledPin, LOW); // turn off the LED
          
          // Wait 2 seconds before retrying
          delay(2000);
        }
  }
  
}

void loop() {
  
  if (!client.connected()) {
    connect_mqttServer();
  }

  client.loop();
  
  long now = millis();
  if (now - lastMsg > 4000) {
    lastMsg = now;

    client.publish("esp32/sensor1", "88"); //topic name (to which this ESP32 publishes its data). 88 is the dummy value.
    
  }
  
}
