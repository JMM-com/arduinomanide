'use strict';

goog.provide('Blockly.Blocks.seriallcdi2c');
goog.require('Blockly.Blocks');

Blockly.Blocks['lcdi2c_setup'] = {
  init: function() {
    this.setColour(140);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("images/LCD_I2C.png", 53, 38))
        .appendField("Init LCD I2C (SDA  A4, SCL  A5)")
        .appendField("Address:")
        .appendField(new Blockly.FieldTextInput("0x27"), "NAME");
    this.appendValueInput("COLUMNS")
        .setCheck("Number")
        .appendField("Columns");
    this.appendValueInput("ROWS")
        .setCheck("Number")
        .appendField("Rows");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['lcdi2c_bq_setup'] = {
  init: function() {
    this.setColour(140);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("images/LCD_I2C.png", 53, 38))
        .appendField("Init LCD I2C (BQ)")
        .appendField("SDA Pin A4, SCL Pin A5");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['lcdi2c_clear'] = {
  init: function() {
    this.setColour(140);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("images/LCD_I2C.png", 53, 38))
        .appendField("LCD clear");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['lcdi2c_setcursor'] = {
  init: function() {
    this.setColour(140);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("images/LCD_I2C.png", 53, 38))
        .appendField("LCD set cursor");
    this.appendValueInput("column")
        .setCheck("Number")
        .appendField("column");
    this.appendValueInput("row")
        .setCheck("Number")
        .appendField("row");
    this.appendValueInput("texttoprint")
        .setCheck(null)
        .appendField("print");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['lcdi2c_setcursoralone'] = {
  init: function() {
    this.setColour(140);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("images/LCD_I2C.png", 53, 38))
        .appendField("LCD set cursor");
    this.appendValueInput("column")
        .setCheck("Number")
        .appendField("column");
    this.appendValueInput("row")
        .setCheck("Number")
        .appendField("row");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['lcdi2c_display'] = {
  init: function() {
    this.setColour(140);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("images/LCD_I2C.png", 53, 38))
        .appendField("LCD display")
        .appendField(new Blockly.FieldDropdown([["ON", "1"], ["OFF", "0"]]), "OUTPUT_DISPLAY");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['lcdi2c_scrollDisplay'] = {
  init: function() {
    this.setColour(140);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("images/LCD_I2C.png", 53, 38))
        .appendField("LCD scroll")
        .appendField(new Blockly.FieldDropdown([["Left", "1"], ["Right", "0"]]), "OUTPUT_DISPLAY");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['lcdi2c_setBacklight'] = {
  init: function() {
    this.setColour(140);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("images/LCD_I2C.png", 53, 38))
        .appendField("LCD backlight")
        .appendField(new Blockly.FieldDropdown([["ON", "1"], ["OFF", "0"]]), "OUTPUT_DISPLAY");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['lcdi2c_showCursor'] = {
  init: function() {
    this.setColour(140);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("images/LCD_I2C.png", 53, 38))
        .appendField("LCD cursor")
        .appendField(new Blockly.FieldDropdown([["ON", "1"], ["OFF", "0"]]), "OUTPUT_DISPLAY");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['lcdi2c_blinkCursor'] = {
  init: function() {
    this.setColour(140);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("images/LCD_I2C.png", 53, 38))
        .appendField("LCD blink cursor")
        .appendField(new Blockly.FieldDropdown([["ON", "1"], ["OFF", "0"]]), "OUTPUT_DISPLAY");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};