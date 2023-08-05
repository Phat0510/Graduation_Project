// Khai bao su dung cac thu vien
#include <PZEM004Tv30.h>      // https://github.com/mandulaj/PZEM-004T-v30
#include <SoftwareSerial.h>   
#include <LoRa.h>             // https://github.com/sandeepmistry/arduino-LoRa
#include <SPI.h>              // https://github.com/arduino/ArduinoCore-avr/tree/master/libraries/SPI

// So do noi day voi module SPI SX1278 LoRa
//* LoRa         Arduino Uno R3     ATmega328P
//* VCC              3.3V
//* GND              GND
//* RST               9              PB1 - 15
//* DIO0              2              PD2 - 4
//* EN/NSS            10             PB2 - 16 
//* MOSI              11             PB3 - 17 
//* MISO              12             PB4 - 18 
//* SCK               13             PB5 - 19 

// Khai bao ten cho cac chan
#define DC_Vol_Pin A0  // Chan noi doc dien ap DC
#define DC_Cur_Pin A1  // Chan noi doc dong dien DC
#define Photores_Pin A2 // Chan noi doc gia tri quang tro
#define LED_System 7   // LED he thong, ON = sang, OFF = tat, PD7 - 13
#define LED_Work 8     // LED bao da gui du lieu xong, PB0 - 14

// Khai bao bien va du lieu
String LoRaMessage = "";  // Chuoi du lieu gui di qua mang LoRa
char device_id[6] = "VNVP2";  // Thiet lap ma ID xac nhan Node2 = Solar Node

int Vol_Value = 0;  // Gia tri analog tai chan A0
float Vol_DC = 0;   // Gia tri dien ap tai chan A0
float R1 = 10000.0; 
float R2 = 2000.0;  // Gia tri dien tro cau phan ap

const float R_Shunt = 0.12; // Gia tri dien tro Shunt
const float R1_OA = 1000.0; // Gia tri dien tro R1 Op-amp
const float R2_OA = 49000.0;  // Gia tri dien tro R2 op-amp
int Cur_Value = 0;  // Gia tri analog tai chan A1
float Vol_Cur = 0; // Gia tri dien ap tai chan A1
float Vol_Shunt;  // Gia tri dien ap tai dien tro Shunt
float Cur_Shunt;  // Gia tri dong dien tai dien tro Shunt

float Cur_DC = 0; // Gia tri dong dien DC
float Power_DC = 0; // Gia tri cong suat DC

float Vol_AC, Cur_AC, Power_AC, Energy, Frequency, PowerFactor; // Cac gia tri thong so AC

float Photores_Val;
float Weather;

unsigned long last_time = 0;  // Gia tri time

SoftwareSerial pzemSWSerial(5, 6);
/* Use software serial for the PZEM
 * Pin 5 Rx (Connects to the Tx pin on the PZEM)
 * Pin 6 Tx (Connects to the Rx pin on the PZEM)
*/
PZEM004Tv30 pzem;

void DC_Vol()
{
  Vol_Value = analogRead(DC_Vol_Pin);

  Vol_DC = Vol_Value*(5/1023.); // chuyển từ analog sang Volt
  Vol_DC = float(Vol_DC*(R1+R2)/R2);  // Cau phan ap
  
//  Serial.print("DC_Voltage = ");
//  Serial.print(Vol_DC, 2);
//  Serial.println("V");
}

void DC_Cur()
{
  for(int i = 0; i < 100; i++)
  {
    Cur_Value += analogRead(DC_Cur_Pin);
    delay(1);
  }

  Cur_Value /= 100.0;
  Vol_Cur = Cur_Value*(5.0/1023.0);
  
  Vol_Shunt = Vol_Cur/(1 + (R2_OA/R1_OA));  // Khuech dai Op-amp
  Cur_Shunt = Vol_Shunt / R_Shunt;

//  Serial.print("Vol_pin_A1 = ");
//  Serial.print(Vol_Cur,2);
//  Serial.println("V");
//  Serial.print("Vol_Shunt = ");
//  Serial.print(Vol_Shunt,2);
//  Serial.println("V");
//  Serial.print("Cur_Shunt = ");
//  Serial.print(Cur_Shunt,2);
//  Serial.println("A");
}

void DC_Pow()
{
  Cur_DC = Cur_Shunt;  // I = I_Shunt
  Power_DC = Vol_DC * Cur_DC; // P = U * I 

//  Serial.print("DC_Current = ");
//  Serial.print(Cur_DC, 2);
//  Serial.println("A");
//  Serial.print("DC_Power = ");
//  Serial.print(Power_DC, 2);
//  Serial.println("W");
}

void AC_Pow()
{
//  Serial.print("Custom Address:");
//  Serial.println(pzem.readAddress(), HEX);

  // Read the data from the sensor
  Vol_AC = pzem.voltage();
  Cur_AC = pzem.current();
  Power_AC = pzem.power();
  Energy = pzem.energy();
  Frequency = pzem.frequency();
  PowerFactor = pzem.pf();

  // Check if the data is valid
  if(isnan(Vol_AC))
  {
//    Serial.println("Error reading voltage");
    Vol_AC = Cur_AC = Power_AC = Energy = Frequency = PowerFactor = 0.00;
  } 
  else 
  {
    // Print the values to the Serial console
    Serial.print("Voltage: ");      Serial.print(Vol_AC);         Serial.println("V");
    Serial.print("Current: ");      Serial.print(Cur_AC);         Serial.println("A");
    Serial.print("Power: ");        Serial.print(Power_AC);       Serial.println("W");
    Serial.print("Energy: ");       Serial.print(Energy,3);       Serial.println("kWh");
    Serial.print("Frequency: ");    Serial.print(Frequency, 1);   Serial.println("Hz");
    Serial.print("PF: ");           Serial.println(PowerFactor);
  }

//  Serial.println();
}

void Photoresistor_Read()
{
  Photores_Val = analogRead(Photores_Pin);

//  Serial.print("Light_Value = ");
//  Serial.println(Photores_Val);

  if(Photores_Val <= 200)
  {
    Weather = 0.00;  // Khong co nang
  }
  else
  {
    Weather = 1.00;  // Co nang
  }
//  Serial.print("Weather_Logic = ");
//  Serial.println(Weather);
}

void setup() 
{
  Serial.begin(115200); // Cau hinh Serial Port
  pzem = PZEM004Tv30(pzemSWSerial); // Cau hinh module PZEM

  pinMode(LED_System, OUTPUT); // Khoi tao cau hinh LED ON/OFF he thong
  pinMode(LED_Work, OUTPUT); // Khoi tao cau hinh LED bao trang thai gui du lieu
  digitalWrite(LED_System, HIGH); // Node ON
   
  while (!Serial);  
//  Serial.println("LoRa Sender 2");
  
  if (!LoRa.begin(433E6)) 
  { // or 915E6, the MHz speed of your module
//    Serial.println("Starting LoRa failed!");
    while (1);
  }
}

void loop() 
{
  if((unsigned long)(millis()-last_time) > 10000)
  {
    // Thuc hien sau moi 10s
    DC_Vol();
    DC_Cur();
    DC_Pow();
    AC_Pow();
    Photoresistor_Read();
  
    // Dong goi ID Node2, cac ket qua du lieu, cac ky tu dac biet thanh 1 chuoi
    LoRaMessage = String(device_id) + "/" + String(Vol_DC) + "~" + String(Cur_DC) + "!" + String(Power_DC)
                + "@" + String(Vol_AC) + "#" + String(Cur_AC) + "$" + String(Power_AC)
                + "%" + String(Energy) + "^" + String(Frequency) + "&" + String(PowerFactor) + "*" + String(Weather);
  
//    Serial.println(LoRaMessage);
  
    // send packet
    LoRa.beginPacket();
    LoRa.print(LoRaMessage);
    LoRa.endPacket();
    
    digitalWrite(LED_Work, HIGH); // sent data
    delay(100);
    digitalWrite(LED_Work, LOW);
  
    // Clear
    Vol_DC = Cur_DC = 0.00; 

    last_time = millis();
  }
}
