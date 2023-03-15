#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Pixel3";
const char* password = "mattmadi";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long int uid;

long last_msg_time = 0;

// status codes for publish
int connection = 0;
int command = 0;
int fault = 0;

// LED Pin
const int ledPin = 4;

void setup() {
  Serial.begin(115200); 

  setup_wifi();
  client.setServer("mqtt.eclipseprojects.io", 1883);
  client.setCallback(callback);
  randomSeed(analogRead(0));
  pinMode(ledPin, OUTPUT);
  uid = random(10000);
  Serial.print("Device UID: ");
  Serial.println(uid);
}

void setup_wifi() {
  delay(10);

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Received message on topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  String UID = "";
  String messageTemp = "";
  int split = 0;
  for (unsigned int i = 0; i < length; ++i) {
    if ((char) message[i] == ' ') {split = 1;++i;}
    if (!split) UID += (char) message[i];
    else messageTemp += (char) message[i];
  }
  Serial.print("Dev ID: ");
  Serial.println(UID);
  Serial.print("Message: ");
  Serial.print(messageTemp);
  Serial.println();

  if (String(topic) == "device/mqtt_sub") {
    Serial.print("Turning plug ");
    if(messageTemp == "ON"){
      Serial.println("on");
      command = 1;
      digitalWrite(ledPin, HIGH);
    }
    else if(messageTemp == "OFF"){
      Serial.println("off");
      command = 0;
      digitalWrite(ledPin, LOW);
    }
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection... ");
    // Attempt to connect
    if (client.connect("SmartPlugClient")) {
      Serial.println("connected");
      connection = 1;
      client.subscribe("device/mqtt_sub");

    } else {
      connection = 0;
      fault = 1;
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - last_msg_time > 100) {
    last_msg_time = now;
    
    char ret_msg[20];
    sprintf(ret_msg, "%d %d %d %d", uid, connection, command, fault);
    /*
    Serial.println("------------------------------------------------");
    Serial.print("Connection Status (0 not connected, 1 connected): ");
    Serial.println(connection);
    Serial.print("Current Command (0 Off, 1 On): ");
    Serial.println(command);
    Serial.print("Fault Status (0 no fault, 1 fault): ");
    Serial.println(fault);
    Serial.println("------------------------------------------------");
    */
    client.publish("device/mqtt_pub", ret_msg);
  }
}
