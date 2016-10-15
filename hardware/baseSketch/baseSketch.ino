#include <stdlib.h>
#include <IRremote.h>
#include <RCSwitch.h>
#include <idDHT11.h>

// setup for DHT11
#define DHT_PIN 2
#define DHT_ISR_NUM 0
void dht11_wrapper();
idDHT11 DHT11(DHT_PIN, DHT_ISR_NUM,dht11_wrapper);

// PIR setup
#define PIR_PIN 3
#define PIR_CAL_TIME 30
volatile int PIRposs;
int PIRstatus = HIGH;
volatile boolean  PIRchanged = false;
volatile long unsigned int PIRchangeStamp = 0;
const long unsigned int delayNoise = 1000;

//setup photoresistor
#define PHOTO_PIN0 0
#define PHOTO_PIN1 1
#define AVERAGE(x,y) (((float)x + (float)y) / 2.0)

IRsend irsend;
RCSwitch mySwitch = RCSwitch();

void setup()
{
  Serial.begin(9600);

  //setup photoresistor pins
  pinMode(PHOTO_PIN1, INPUT);
  pinMode(PHOTO_PIN0, INPUT);
  
  //Calibrate PIR sensor
  pinMode(PIR_PIN, INPUT);
  digitalWrite(PIR_PIN, HIGH);
  Serial.print("Calibrating Motion Sensor");
  for(int i = 0; i < PIR_CAL_TIME; i++)
  {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("done.");
  attachInterrupt(digitalPinToInterrupt(PIR_PIN), PIR_ISR, CHANGE);
  
  //Setup RC transmitter
  mySwitch.enableTransmit(10);
  mySwitch.setPulseLength(140);
  mySwitch.setRepeatTransmit(5);
  Serial.println("ready");
}

void loop()
{
  int loopstate, wait_time = 4; //In seconds
  if(loopstate >= wait_time)
  {
    String resp = "";
    resp = resp + "PIR:" + isMovementPIR();
    resp = resp + checkTemp();
    resp = resp + "photo:" + String(AVERAGE(analogRead(PHOTO_PIN0), analogRead(PHOTO_PIN1))) + ";";
    resp = resp + '\n';
    if(resp != "")
    {
      Serial.println(resp);
    }
    loopstate = 0;
  }
  loopstate ++;
  delay(1000);
}

void dht11_wrapper()
{
  DHT11.isrCallback();
}

void PIR_ISR()
{
  int readPIR = digitalRead(PIR_PIN);
  if (PIRstatus != readPIR)
  {                       
    PIRchanged = true;
    PIRposs = readPIR;
    PIRchangeStamp = millis();
  }
  else
  { 
    PIRchanged = false;
  }
}

String isMovementPIR()
{
  if (PIRchanged == true)
  {
    if ((millis() - PIRchangeStamp) > delayNoise)
    {
      PIRstatus = PIRposs ;
      PIRchanged = false;
    }
  }
  return String(PIRstatus == LOW);                                    
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
