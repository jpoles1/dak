#include <stdlib.h>
#include <IRremote.h>
#include <RCSwitch.h>
#include <dht11.h>

#define WAIT_TIME 1
int loopstate = 0;

// setup for DHT11
#define DHT_PIN 2
#define FAHR(x) ((x*18+5)/10 +32)
dht11 DHT11;

// PIR setup
#define PIR_PIN 4
#define PIR_CAL_TIME 15
#define MAXCHECKS 100
unsigned char state[MAXCHECKS]={0};    // Array that maintains bounce status
char Index = 0;   

//setup photoresistor
#define PHOTO_PIN0 0
#define PHOTO_PIN1 1
#define AVERAGE(x,y) int(((float)x + (float)y) / 2.0)

IRsend irsend;
RCSwitch mySwitch = RCSwitch();
String serData;

void setup()
{
  Serial.begin(19200);

  //setup photoresistor pins
  pinMode(PHOTO_PIN1, INPUT);
  pinMode(PHOTO_PIN0, INPUT);
  
  //Calibrate PIR sensor
  pinMode(PIR_PIN, INPUT);
  Serial.print("Calibrating Motion Sensor");
  for(int i = 0; i < PIR_CAL_TIME; i += 1)
  {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("done.");
  
  //Setup RC transmitter
  mySwitch.enableTransmit(10);
  mySwitch.setPulseLength(140);
  mySwitch.setRepeatTransmit(5);
  Serial.println("ready");
}

void loop()
{
  if(loopstate == WAIT_TIME*100)
  {
    String resp = "begin;";
    resp = resp + "motion:" + debouncePIR() + ";";
    resp = resp + checkTemp();
    resp = resp + "photo:" + AVERAGE(analogRead(PHOTO_PIN0),analogRead(PHOTO_PIN1)) + ";";
    Serial.println(resp);
    loopstate = 0;
  }
  else
  {
    debouncePIR();
  }
  loopstate +=1;
  delay(10);
}

void serialEvent() 
{
  while(Serial.available()) 
  {
    serData = Serial.readStringUntil('\n');
    sendIR(serData);
    delay(50);
  }
}

String checkTemp()
{
  int chk = DHT11.read(DHT_PIN);
  String resp = "";
  if(chk == DHTLIB_OK)
  {
     resp = resp + "temp:" + String(FAHR(DHT11.temperature)) + ";humid:" + String(DHT11.humidity)+ ";";
  }
  return resp;
}

void sendIR(String data)
{
    while(data.indexOf(';') != -1)
    {
      String command = data.substring(0, data.indexOf(';'));
      int firstColon = command.indexOf(':');
      String type = command.substring(0, firstColon);
      String rest = command.substring(firstColon+1);
      if(type == "IR")
      {
        int retries = rest.substring(0, rest.indexOf(':')).toInt();
        String serData = rest.substring(rest.indexOf(':')+1);
        unsigned long color = strtol(serData.c_str(), NULL, 16);
        Serial.println("IR Blasting: "+serData+"; "+color);
        int i;
        for(i = 0;i<retries;i+=1)
        {
          irsend.sendNEC(color, 32);
          delay(100);
        }
      }
      else if (type == "433")
      {
        char com[25];
        rest.toCharArray(com, 25);
        mySwitch.send(com);
        delay(100);
        mySwitch.send(com);
        delay(100);
        mySwitch.send(com);
        Serial.println("RC Blasting: "+rest);

      }
      data = data.substring(data.indexOf(';')+1);
    }
}

int debouncePIR(void)
{
  if(Index == MAXCHECKS) Serial.println("Debouncing");
  state[Index] = (digitalRead(PIR_PIN) == HIGH) ? 1 : 0;
  Index = (Index+1) % MAXCHECKS;
  int i;
  for (i = 0; i < MAXCHECKS; i++)
  {
    if(!state[i]) {return 0;}
  }
  return 1;
}
