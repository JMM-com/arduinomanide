/**
 * PIN MAPPING FIX - FORCED DIRECT 1:1 MAPPING
 * Block number = Code number ALWAYS
 */

console.log("Pin fix loaded - FORCING DIRECT 1:1 MAPPING");

// Override ALL pin mapping functions with direct 1:1 mapping
Blockly.Arduino.pinMapping = function(pin) {
  console.log("Pin mapping called:", pin, "->", pin);
  return pin; // DIRECT 1:1 MAPPING
};

// Override the entire Blockly.Arduino object if it exists
if (typeof Blockly.Arduino !== 'undefined') {
  
  // COMPLETE OVERRIDE - digitalWrite
  Blockly.Arduino['inout_digital_write'] = function(block) {
    var dropdown_pin = this.getFieldValue('PIN');
    console.log("Digital Write - Block pin:", dropdown_pin, "-> Code pin:", dropdown_pin);
    var dropdown_stat = this.getFieldValue('STAT');
    Blockly.Arduino.setups_['setup_output_'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
    var code = 'digitalWrite('+dropdown_pin+','+dropdown_stat+');\n';
    return code;
  };

  // COMPLETE OVERRIDE - digitalRead
  Blockly.Arduino['inout_digital_read'] = function(block) {
    var dropdown_pin = this.getFieldValue('PIN');
    console.log("Digital Read - Block pin:", dropdown_pin, "-> Code pin:", dropdown_pin);
    Blockly.Arduino.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
    var code = 'digitalRead('+dropdown_pin+')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  };

  // COMPLETE OVERRIDE - analogWrite
  Blockly.Arduino['inout_analog_write'] = function(block) {
    var dropdown_pin = block.getFieldValue('PIN');
    console.log("Analog Write - Block pin:", dropdown_pin, "-> Code pin:", dropdown_pin);
    var value = Blockly.Arduino.valueToCode(this, 'Value', Blockly.Arduino.ORDER_ATOMIC);
    Blockly.Arduino.setups_['setup_output_'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
    var code = 'analogWrite('+dropdown_pin+','+value+');\n';
    return code;
  };

  // COMPLETE OVERRIDE - analogRead
  Blockly.Arduino['inout_analog_read'] = function(block) {
    var dropdown_pin = this.getFieldValue('PIN');
    console.log("Analog Read - Block pin:", dropdown_pin, "-> Code pin:", dropdown_pin);
    var code = 'analogRead('+dropdown_pin+')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  };

  // COMPLETE OVERRIDE - buildin LED (force pin 13)
  Blockly.Arduino['inout_buildin_led'] = function(block) {
    var dropdown_stat = this.getFieldValue('STAT');
    console.log("Built-in LED - Using pin 13");
    Blockly.Arduino.setups_['setup_output_13'] = 'pinMode(13, OUTPUT);';
    var code = 'digitalWrite(13,'+dropdown_stat+');\n';
    return code;
  };

  // COMPLETE OVERRIDE - pulseIn
  Blockly.Arduino['advanced_pulsein'] = function(block) {
    var dropdown_pin = this.getFieldValue('PIN');
    console.log("PulseIn - Block pin:", dropdown_pin, "-> Code pin:", dropdown_pin);
    var dropdown_stat = this.getFieldValue('STAT');
    Blockly.Arduino.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
    var code = 'pulseIn('+dropdown_pin+','+dropdown_stat+');';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  };
}

console.log("Pin mapping fix COMPLETELY applied - DIRECT 1:1 MAPPING ACTIVE");