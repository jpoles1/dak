#include <stdlib.h>
#include <IRremote.h>
#include <RCSwitch.h>
#include <idDHT11.h>

// setup for DHT11
#define DHT_PIN 2
#define DHT_ISR_NUM 0
void dht11_wrapper(); // must be declared before the lib initialization
idDHT11 DHT11(DHT_PIN, DHT_ISR_NUM,dht11_wrapper);

// PIR setup
#define PIR_PIN 5

IRsend irsend;
RCSwitch mySwitch = RCSwitch();

char pirState = -1;
String serdat = "";

void setup() {
  Serial.begin(9600);
  pinMode(PIR_PIN, INPUT);
  mySwitch.enableTransmit(10);
  mySwitch.setPulseLength(140);
  mySwitch.setRepeatTransmit(5);
  Serial.println("ready");
}

void loop() {
  int loopstate, wait_time = 4; //In seconds
  if(loopstate >= wait_time){
    String resp = "";
    resp = resp + "PIR:" + checkPIR();
    resp = resp + checkTemp();
    if(resp!=""){
      Serial.println(resp);
    }
    loopstate = 0;
  }
  loopstate ++;
  delay(1000);
}

void dht11_wrapper() {
  DHT11.isrCallback();
}

String checkPIR(){
  int pir_val = digitalRead(PIR_PIN);
  String resp = "";
  if(pir_val != pirState)
  {
    resp = "PIR:" + String(pir_val) + ";";
  }
  pirState = pir_val;
  return resp;
}

String checkTemp()
{
  int chk = DHT11.acquireAndWait();
  String resp = "";
  if(chk == IDDHTLIB_OK)
  {
     resp = resp + "temp:" + String(int(DHT11.getFahrenheit())) + ";humid:" + String(int(DHT11.getHumidity()))+ ";";
  }

  return resp;
}
