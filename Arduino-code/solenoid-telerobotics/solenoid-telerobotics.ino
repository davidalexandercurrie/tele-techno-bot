int DTMFdata = -1;
int relayPin[2] = {8, 9};
unsigned long millisRelay[2] = {0, 0};
int noteLength[2][10][4];
int patternIndex[2] = {0, 0};
int relayState[2] = {LOW, LOW};

void setup() {
  Serial.begin(9600);
  pinMode(3, INPUT);
  pinMode(4, INPUT);
  pinMode(5, INPUT);
  pinMode(6, INPUT);
  pinMode(7, INPUT);
  Serial.begin(9600);
  pinMode(relayPin[0], OUTPUT);
  pinMode(relayPin[1], OUTPUT);
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 10; j++) {
      int mult = random(2,6);
      for (int k = 0; k < 4; k++) {
        noteLength[i][j][k] = random(200, 600) + 800 * mult;
      }
    }
  }
}

void loop() {
  runRelays();
  dtmf();
}

void runRelays() {
  for (int i = 0; i < 2; i++) {
    if (relayState[i] == HIGH && millis() > millisRelay[i] + 50 && DTMFdata != -1 || relayState[i] == LOW && millis() > millisRelay[i] + noteLength[i][DTMFdata][patternIndex[i] % 4] && DTMFdata != -1) {
      int state = relayState[i] == HIGH ? LOW : HIGH;
      digitalWrite(relayPin[i], state);
      relayState[i] = state;
      millisRelay[i] = millis();
      if (state == HIGH) {
        patternIndex[i]++;
      }

    }
  }
}

void dtmf() {
  // put your main code here, to run repeatedly:
  if (digitalRead(7) == HIGH) {
    DTMFdata = 0;
    if (digitalRead(6) == HIGH) {
      DTMFdata += 8;
    }
    if (digitalRead(5) == HIGH) {
      DTMFdata += 4;
    }
    if (digitalRead(4) == HIGH) {
      DTMFdata += 2;
    }
    if (digitalRead(3) == HIGH) {
      DTMFdata += 1;
    }
    if (DTMFdata == 10) {
      DTMFdata = 0;
    }
    Serial.println(DTMFdata);
  }
}
