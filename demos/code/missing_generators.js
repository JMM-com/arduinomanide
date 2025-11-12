/**
 * MISSING BLOCK GENERATORS FIX
 * Add generators for blocks that are missing them
 */

console.log("Loading missing block generators...");

// Fix for potentiometer_ranger_sensor block
Blockly.Arduino['potentiometer_ranger_sensor'] = function(block) {
    console.log("potentiometer_ranger_sensor generator called");
    var dropdown_pin = block.getFieldValue('PIN');
    var code = 'analogRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

// Fix for variables_declare block
Blockly.Arduino['variables_declare'] = function(block) {
    console.log("variables_declare generator called");
    var variable_name = Blockly.Arduino.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE',
        Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
    
    var code = variable_name + ' = ' + argument0 + ';\n';
    return code;
};

// Fix for arduino_setup block
Blockly.Arduino['arduino_setup'] = function(block) {
    console.log("arduino_setup generator called");
    var branch = Blockly.Arduino.statementToCode(block, 'DO');
    // Clean up any trailing whitespace
    branch = branch.replace(/^\s+|\s+$/g, '');
    if (branch) {
        // If there's actual code, include setup function
        Blockly.Arduino.setups_['setup_'] = branch;
    }
    return '';
};

// Fix for inout_highlow block
Blockly.Arduino['inout_highlow'] = function(block) {
    console.log("inout_highlow generator called");
    var dropdown_stat = block.getFieldValue('STAT');
    return [dropdown_stat, Blockly.Arduino.ORDER_ATOMIC];
};

// Fix for base_delayms block
Blockly.Arduino['base_delayms'] = function(block) {
    console.log("base_delayms generator called");
    var value_delay_time = Blockly.Arduino.valueToCode(block, 'DELAY_TIME', 
        Blockly.Arduino.ORDER_ATOMIC) || '1000';
    return 'delay(' + value_delay_time + ');\n';
};

// Fix for math_number block
Blockly.Arduino['math_number'] = function(block) {
    console.log("math_number generator called");
    var code = parseFloat(block.getFieldValue('NUM'));
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

// Add more missing generators as needed...
console.log("Missing block generators loaded");