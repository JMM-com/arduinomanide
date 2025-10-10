/***************************************************************
 *
 *  This module was created by Oscar Ferruz. oferruz@logix5.com
 *
 ****************************************************************/

goog.provide('Blockly.Arduino.simpleSensors');

goog.require('Blockly.Arduino');

Blockly.Arduino['button_sensor'] = function(block) {
  var dropdown_pin = this.getFieldValue('PIN_BUTTON');
  var logic = this.getFieldValue('LOGIC');
  Blockly.Arduino.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  
  if(logic=='TRUE')
    var code = '(!digitalRead('+dropdown_pin+'))';
  else
   var code = 'digitalRead('+dropdown_pin+')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['internal_button_sensor'] = function(block) {
  Blockly.Arduino.definitions_['include_mrtremote'] = '#include <MrtDuino.h>\n';
  Blockly.Arduino.definitions_['mrtremote_ir_id_set'] = 'MrtIdSetting ir_id_set;\n';
  var code= 'ir_id_set.isStartPressed()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['button_touch_sensor'] = function(block) {
  var dropdown_pin = this.getFieldValue('PIN_BUTTON');
  var logic = this.getFieldValue('LOGIC');
  Blockly.Arduino.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  
  if(logic=='TRUE')
    var code = '(!digitalRead('+dropdown_pin+'))';
  else
   var code = 'digitalRead('+dropdown_pin+')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['tilt_sensor'] = function(block) {
  var dropdown_pin = this.getFieldValue('PIN_BUTTON');
  Blockly.Arduino.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  var code = 'digitalRead('+dropdown_pin+')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['photointerrupter_sensor'] = function(block) {
  var dropdown_pin = this.getFieldValue('PIN_BUTTON');
  Blockly.Arduino.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  var code = 'digitalRead('+dropdown_pin+')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['knock_sensor'] = function(block) {
  var dropdown_pin = this.getFieldValue('PIN_BUTTON');
  Blockly.Arduino.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  var code = 'digitalRead('+dropdown_pin+')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['ultrasonic_ranger_sensor'] = function(block) {
  var PIN_TRIG = this.getFieldValue('PIN_TRIG'); 
  var PIN_ECHO = this.getFieldValue('PIN_ECHO');
  Blockly.Arduino.setups_['setup_output_'+PIN_TRIG] = 'pinMode('+PIN_TRIG+', OUTPUT);';
  Blockly.Arduino.setups_['setup_input_'+PIN_ECHO] = 'pinMode('+PIN_ECHO+', INPUT);';
  Blockly.Arduino.definitions_['var_ultrasonic'+PIN_TRIG] = 'long ultrason_'+PIN_TRIG+ '() {\n'+
      '   long duration, distance;\n'+
      '   digitalWrite('+PIN_TRIG+',LOW);\n'+
      '   delayMicroseconds(2);\n'+
      '   digitalWrite('+PIN_TRIG+', HIGH);\n'+
      '   delayMicroseconds(10);\n'+
      '   digitalWrite('+PIN_TRIG+', LOW);\n'+
      '   duration = pulseIn('+ PIN_ECHO +', HIGH);\n'+
      '   distance = duration/58;\n'+
      '   return distance;\n'+
      '}\n';
  var code = 'ultrason_'+PIN_TRIG+'()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

// ... (rest of the sensor functions remain the same with direct pin usage)