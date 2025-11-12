/**
 * LM35 ― no library, just analog read
 */
Blockly.Arduino['LM35_temperature_sensor'] = function(block) {
  var pin = block.getFieldValue('PIN_LM35');   // the field name in toolbox XML
  // °C = ( analogRead(pin) * 500.0 ) / 1024.0
  var code = '( analogRead(' + pin + ') * 0.488 )'; // 500/1024 ≈ 0.488
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};