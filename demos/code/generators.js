// LCD I2C Generators
Blockly.Arduino['lcdi2c_bq_setup'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var code = `
// LCD I2C Setup
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(${text_name}, 16, 2); // Change 16,2 to your LCD size

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.clear();
}\n`;
  return code;
};

Blockly.Arduino['lcdi2c_clear'] = function(block) {
  return 'lcd.clear();\n';
};

Blockly.Arduino['lcdi2c_setcursor'] = function(block) {
  var column = Blockly.Arduino.valueToCode(block, 'column', Blockly.Arduino.ORDER_ATOMIC);
  var row = Blockly.Arduino.valueToCode(block, 'row', Blockly.Arduino.ORDER_ATOMIC);
  var text = Blockly.Arduino.valueToCode(block, 'texttoprint', Blockly.Arduino.ORDER_ATOMIC);
  return `lcd.setCursor(${column}, ${row});\nlcd.print(${text});\n`;
};