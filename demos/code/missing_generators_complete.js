/**
 * COMPREHENSIVE MISSING BLOCK GENERATORS FIX
 * This file adds generators for ALL blocks that might be missing them
 */

console.log("Loading COMPREHENSIVE block generator fixes...");

// Wait for Blockly to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // Comprehensive list of all potential missing generators
        const missingGenerators = {
            // Basic blocks
            'math_number': function(block) {
                var code = parseFloat(block.getFieldValue('NUM'));
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'math_arithmetic': function(block) {
                var operator = block.getFieldValue('OP');
                var argument0 = Blockly.Arduino.valueToCode(block, 'A', Blockly.Arduino.ORDER_ATOMIC) || '0';
                var argument1 = Blockly.Arduino.valueToCode(block, 'B', Blockly.Arduino.ORDER_ATOMIC) || '0';
                var code;
                switch (operator) {
                    case 'ADD':
                        code = argument0 + ' + ' + argument1;
                        break;
                    case 'MINUS':
                        code = argument0 + ' - ' + argument1;
                        break;
                    case 'MULTIPLY':
                        code = argument0 + ' * ' + argument1;
                        break;
                    case 'DIVIDE':
                        code = argument0 + ' / ' + argument1;
                        break;
                    case 'POWER':
                        code = 'pow(' + argument0 + ', ' + argument1 + ')';
                        break;
                    default:
                        code = '0';
                }
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'logic_compare': function(block) {
                var operator = block.getFieldValue('OP');
                var argument0 = Blockly.Arduino.valueToCode(block, 'A', Blockly.Arduino.ORDER_RELATIONAL) || '0';
                var argument1 = Blockly.Arduino.valueToCode(block, 'B', Blockly.Arduino.ORDER_RELATIONAL) || '0';
                var code = argument0 + ' ' + operator + ' ' + argument1;
                return [code, Blockly.Arduino.ORDER_RELATIONAL];
            },
            
            'logic_operation': function(block) {
                var operator = block.getFieldValue('OP');
                var argument0 = Blockly.Arduino.valueToCode(block, 'A', Blockly.Arduino.ORDER_LOGICAL_AND) || 'false';
                var argument1 = Blockly.Arduino.valueToCode(block, 'B', Blockly.Arduino.ORDER_LOGICAL_AND) || 'false';
                var code;
                switch (operator) {
                    case 'AND':
                        code = argument0 + ' && ' + argument1;
                        break;
                    case 'OR':
                        code = argument0 + ' || ' + argument1;
                        break;
                    default:
                        code = 'false';
                }
                return [code, Blockly.Arduino.ORDER_LOGICAL_AND];
            },
            
            'logic_boolean': function(block) {
                var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'logic_negate': function(block) {
                var argument0 = Blockly.Arduino.valueToCode(block, 'BOOL', Blockly.Arduino.ORDER_LOGICAL_NOT) || 'false';
                var code = '!' + argument0;
                return [code, Blockly.Arduino.ORDER_LOGICAL_NOT];
            },
            
            'logic_null': function(block) {
                return ['NULL', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            // Control blocks
            'controls_if': function(block) {
                var n = 0;
                var code = '';
                do {
                    var condition = Blockly.Arduino.valueToCode(block, 'IF' + n, Blockly.Arduino.ORDER_NONE) || 'false';
                    var branch = Blockly.Arduino.statementToCode(block, 'DO' + n);
                    code += (n > 0 ? ' else ' : '') + 'if (' + condition + ') {\n' + branch + '}';
                    n++;
                } while (block.getInput('IF' + n));
                
                if (block.getInput('ELSE')) {
                    var branch = Blockly.Arduino.statementToCode(block, 'ELSE');
                    code += ' else {\n' + branch + '}';
                }
                return code + '\n';
            },
            
            'controls_switch': function(block) {
                // Simple if-else chain for switch
                var n = 0;
                var code = '';
                var condition = Blockly.Arduino.valueToCode(block, 'SWITCH', Blockly.Arduino.ORDER_NONE) || '0';
                
                do {
                    var caseCondition = Blockly.Arduino.valueToCode(block, 'CASE' + n, Blockly.Arduino.ORDER_NONE) || '0';
                    var branch = Blockly.Arduino.statementToCode(block, 'DO' + n);
                    code += (n > 0 ? ' else ' : '') + 'if (' + condition + ' == ' + caseCondition + ') {\n' + branch + '}';
                    n++;
                } while (block.getInput('CASE' + n));
                
                if (block.getInput('DEFAULT')) {
                    var branch = Blockly.Arduino.statementToCode(block, 'DEFAULT');
                    code += ' else {\n' + branch + '}';
                }
                return code + '\n';
            },
            
            'controls_repeat_x': function(block) {
                var repeats = Blockly.Arduino.valueToCode(block, 'TIMES', Blockly.Arduino.ORDER_ASSIGNMENT) || '10';
                var branch = Blockly.Arduino.statementToCode(block, 'DO');
                var code = 'for (int i = 0; i < ' + repeats + '; i++) {\n' + branch + '}\n';
                return code;
            },
            
            'controls_for': function(block) {
                var variable0 = Blockly.Arduino.variableDB_.getName(
                    block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
                var argument0 = Blockly.Arduino.valueToCode(block, 'FROM', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
                var argument1 = Blockly.Arduino.valueToCode(block, 'TO', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
                var argument2 = Blockly.Arduino.valueToCode(block, 'BY', Blockly.Arduino.ORDER_ASSIGNMENT) || '1';
                var branch = Blockly.Arduino.statementToCode(block, 'DO');
                
                var code = 'for (int ' + variable0 + ' = ' + argument0 + '; ' + variable0 + ' <= ' + argument1 + '; ' + variable0 + ' += ' + argument2 + ') {\n' + branch + '}\n';
                return code;
            },
            
            'while_do': function(block) {
                var condition = Blockly.Arduino.valueToCode(block, 'BOOL', Blockly.Arduino.ORDER_NONE) || 'false';
                var branch = Blockly.Arduino.statementToCode(block, 'DO');
                return 'while (' + condition + ') {\n' + branch + '}\n';
            },
            
            'do_while': function(block) {
                var condition = Blockly.Arduino.valueToCode(block, 'BOOL', Blockly.Arduino.ORDER_NONE) || 'false';
                var branch = Blockly.Arduino.statementToCode(block, 'DO');
                return 'do {\n' + branch + '\n} while (' + condition + ');\n';
            },
            
            'cont_break': function(block) {
                return 'break;\n';
            },
            
            'cont_continue': function(block) {
                return 'continue;\n';
            },
            
            // Time blocks
            'base_delays': function(block) {
                var value_delay_time = Blockly.Arduino.valueToCode(block, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1';
                return 'delay(' + value_delay_time + ' * 1000);\n';
            },
            
            'base_delayms': function(block) {
                var value_delay_time = Blockly.Arduino.valueToCode(block, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
                return 'delay(' + value_delay_time + ');\n';
            },
            
            'base_delaymicros': function(block) {
                var value_delay_time = Blockly.Arduino.valueToCode(block, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000000';
                return 'delayMicroseconds(' + value_delay_time + ');\n';
            },
            
            'seconds': function(block) {
                return ['millis() / 1000', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'millis': function(block) {
                return ['millis()', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'micros': function(block) {
                return ['micros()', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'tempo_no_delay': function(block) {
                // This is a complex block that would need proper implementation
                return '// tempo_no_delay block - needs proper implementation\n';
            },
            
            // Input/Output blocks
            'inout_highlow': function(block) {
                var dropdown_stat = block.getFieldValue('STAT');
                return [dropdown_stat, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'inout_buildin_led': function(block) {
                var dropdown_stat = block.getFieldValue('STAT');
                Blockly.Arduino.setups_['setup_output_13'] = 'pinMode(13, OUTPUT);';
                return 'digitalWrite(13, ' + dropdown_stat + ');\n';
            },
            
            'inout_digital_write': function(block) {
                var dropdown_pin = block.getFieldValue('PIN');
                var dropdown_stat = block.getFieldValue('STAT');
                Blockly.Arduino.setups_['setup_output_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
                return 'digitalWrite(' + dropdown_pin + ', ' + dropdown_stat + ');\n';
            },
            
            'inout_digital_read': function(block) {
                var dropdown_pin = block.getFieldValue('PIN');
                Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
                return ['digitalRead(' + dropdown_pin + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'inout_analog_read': function(block) {
                var dropdown_pin = block.getFieldValue('PIN');
                return ['analogRead(' + dropdown_pin + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'inout_analog_write': function(block) {
                var dropdown_pin = block.getFieldValue('PIN');
                var value = Blockly.Arduino.valueToCode(block, 'Value', Blockly.Arduino.ORDER_ATOMIC) || '0';
                Blockly.Arduino.setups_['setup_output_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
                return 'analogWrite(' + dropdown_pin + ', ' + value + ');\n';
            },
            
            'inout_angle_maths': function(block) {
                var code = parseFloat(block.getFieldValue('NUM'));
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'advanced_pulsein': function(block) {
                var dropdown_pin = block.getFieldValue('PIN');
                var dropdown_stat = block.getFieldValue('STAT');
                Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
                return ['pulseIn(' + dropdown_pin + ', ' + dropdown_stat + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            // Sensor blocks
            'potentiometer_ranger_sensor': function(block) {
                var dropdown_pin = block.getFieldValue('PIN');
                return ['analogRead(' + dropdown_pin + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'button_sensor': function(block) {
                var dropdown_pin = block.getFieldValue('PIN_BUTTON');
                Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
                return ['digitalRead(' + dropdown_pin + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'internal_button_sensor': function(block) {
                return ['digitalRead(2)', Blockly.Arduino.ORDER_ATOMIC]; // Assuming internal button on pin 2
            },
            
            'IR_sensor': function(block) {
                var dropdown_pin = block.getFieldValue('PIN_IR');
                Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
                return ['digitalRead(' + dropdown_pin + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'IR_status_sensor': function(block) {
                var dropdown_pin = block.getFieldValue('PIN_IR');
                Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
                return ['digitalRead(' + dropdown_pin + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'LDR_sensor': function(block) {
                var dropdown_pin = block.getFieldValue('PIN_LDR');
                return ['analogRead(' + dropdown_pin + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'LDR_status_sensor': function(block) {
                var dropdown_pin = block.getFieldValue('PIN_LDR');
                return ['analogRead(' + dropdown_pin + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'Sound_sensor': function(block) {
                var dropdown_pin = block.getFieldValue('PIN_SOUND');
                return ['analogRead(' + dropdown_pin + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'Sound_status_sensor': function(block) {
                var dropdown_pin = block.getFieldValue('PIN_SOUND');
                return ['analogRead(' + dropdown_pin + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'ultrasonic_ranger_sensor': function(block) {
                var dropdown_echo = block.getFieldValue('PIN_ECHO');
                var dropdown_trig = block.getFieldValue('PIN_TRIG');
                
                Blockly.Arduino.setups_['setup_ultrasonic_' + dropdown_trig + '_' + dropdown_echo] = 
                    'pinMode(' + dropdown_trig + ', OUTPUT);\n' +
                    'pinMode(' + dropdown_echo + ', INPUT);';
                
                var functionName = 'readUltrasonic';
                var code = functionName + '(' + dropdown_trig + ', ' + dropdown_echo + ')';
                
                // Add the helper function if not already added
                if (!Blockly.Arduino.definitions_[functionName]) {
                    Blockly.Arduino.definitions_[functionName] = 
                        'long ' + functionName + '(int trigPin, int echoPin) {\n' +
                        '  digitalWrite(trigPin, LOW);\n' +
                        '  delayMicroseconds(2);\n' +
                        '  digitalWrite(trigPin, HIGH);\n' +
                        '  delayMicroseconds(10);\n' +
                        '  digitalWrite(trigPin, LOW);\n' +
                        '  long duration = pulseIn(echoPin, HIGH);\n' +
                        '  return duration * 0.034 / 2;\n' +
                        '}';
                }
                
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            // Arduino structure blocks
            'arduino_setup': function(block) {
                var branch = Blockly.Arduino.statementToCode(block, 'DO');
                branch = branch.replace(/^\s+|\s+$/g, '');
                if (branch) {
                    Blockly.Arduino.setups_['setup_'] = branch;
                }
                return '';
            },
            
            'arduino_codeall': function(block) {
                // This block typically contains both setup and loop
                var setupBranch = Blockly.Arduino.statementToCode(block, 'SETUP');
                var loopBranch = Blockly.Arduino.statementToCode(block, 'LOOP');
                
                setupBranch = setupBranch.replace(/^\s+|\s+$/g, '');
                loopBranch = loopBranch.replace(/^\s+|\s+$/g, '');
                
                if (setupBranch) {
                    Blockly.Arduino.setups_['setup_'] = setupBranch;
                }
                if (loopBranch) {
                    // For arduino_codeall, we need to handle loop differently
                    // This is complex and might need special handling
                }
                
                return '';
            },
            
            'arduino_waitforever': function(block) {
                return 'while(1) {}\n';
            },
            
            // Variable blocks
            'variables_declare': function(block) {
                var variable_name = Blockly.Arduino.variableDB_.getName(
                    block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
                var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE',
                    Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
                
                var code = variable_name + ' = ' + argument0 + ';\n';
                return code;
            },
            
            'variables_set': function(block) {
                var variable_name = Blockly.Arduino.variableDB_.getName(
                    block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
                var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE',
                    Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
                
                var code = variable_name + ' = ' + argument0 + ';\n';
                return code;
            },
            
            'variables_get': function(block) {
                var variable_name = Blockly.Arduino.variableDB_.getName(
                    block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
                return [variable_name, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            // Text blocks
            'text': function(block) {
                var code = Blockly.Arduino.quote_(block.getFieldValue('TEXT'));
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'text_char': function(block) {
                var code = "'" + block.getFieldValue('TEXT') + "'";
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'text_join': function(block) {
                var code = '';
                for (var i = 0; i < block.itemCount_; i++) {
                    if (i > 0) {
                        code += ' + ';
                    }
                    var argument = Blockly.Arduino.valueToCode(block, 'ADD' + i, Blockly.Arduino.ORDER_ADDITIVE) || '""';
                    code += argument;
                }
                return [code, Blockly.Arduino.ORDER_ADDITIVE];
            },
            
            // Conversion blocks
            'conversion_tochar': function(block) {
                var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '0';
                return ['char(' + argument0 + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'conversion_toString': function(block) {
                var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '0';
                return ['String(' + argument0 + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'conversion_toString2': function(block) {
                var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '0';
                var decimals = Blockly.Arduino.valueToCode(block, 'Decimals', Blockly.Arduino.ORDER_ATOMIC) || '2';
                return ['String(' + argument0 + ', ' + decimals + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'conversion_tobyte': function(block) {
                var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '0';
                return ['byte(' + argument0 + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'conversion_toint': function(block) {
                var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '0';
                return ['int(' + argument0 + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'conversion_tounsignedint': function(block) {
                var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '0';
                return ['unsigned int(' + argument0 + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'conversion_tofloat': function(block) {
                var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '0';
                return ['float(' + argument0 + ')', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            // Math blocks
            'base_map': function(block) {
                var value_value = Blockly.Arduino.valueToCode(block, 'value', Blockly.Arduino.ORDER_ATOMIC) || '0';
                var value_fromLow = Blockly.Arduino.valueToCode(block, 'fromLow', Blockly.Arduino.ORDER_ATOMIC) || '0';
                var value_fromHigh = Blockly.Arduino.valueToCode(block, 'fromHigh', Blockly.Arduino.ORDER_ATOMIC) || '1023';
                var value_toLow = Blockly.Arduino.valueToCode(block, 'toLow', Blockly.Arduino.ORDER_ATOMIC) || '0';
                var value_toHigh = Blockly.Arduino.valueToCode(block, 'toHigh', Blockly.Arduino.ORDER_ATOMIC) || '255';
                
                var code = 'map(' + value_value + ', ' + value_fromLow + ', ' + value_fromHigh + ', ' + value_toLow + ', ' + value_toHigh + ')';
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'var_random': function(block) {
                var value_rand_min = Blockly.Arduino.valueToCode(block, 'rand_min', Blockly.Arduino.ORDER_ATOMIC) || '0';
                var value_rand_max = Blockly.Arduino.valueToCode(block, 'rand_max', Blockly.Arduino.ORDER_ATOMIC) || '100';
                
                // Add randomSeed setup if not already added
                if (!Blockly.Arduino.setups_['randomSeed']) {
                    Blockly.Arduino.setups_['randomSeed'] = 'randomSeed(analogRead(0));';
                }
                
                var code = 'random(' + value_rand_min + ', ' + value_rand_max + ')';
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'var_randomseed': function(block) {
                var value_randomseed = Blockly.Arduino.valueToCode(block, 'randomseed', Blockly.Arduino.ORDER_ATOMIC) || '1000';
                return 'randomSeed(' + value_randomseed + ');\n';
            },
            
            'math_number_property': function(block) {
                // This is complex - return placeholder
                return ['0', Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'math_modulo': function(block) {
                var argument0 = Blockly.Arduino.valueToCode(block, 'DIVIDEND', Blockly.Arduino.ORDER_MULTIPLICATIVE) || '0';
                var argument1 = Blockly.Arduino.valueToCode(block, 'DIVISOR', Blockly.Arduino.ORDER_MULTIPLICATIVE) || '1';
                var code = argument0 + ' % ' + argument1;
                return [code, Blockly.Arduino.ORDER_MULTIPLICATIVE];
            },
            
            'various_constrain': function(block) {
                var value_value = Blockly.Arduino.valueToCode(block, 'value', Blockly.Arduino.ORDER_ATOMIC) || '0';
                var value_min = Blockly.Arduino.valueToCode(block, 'min', Blockly.Arduino.ORDER_ATOMIC) || '0';
                var value_max = Blockly.Arduino.valueToCode(block, 'max', Blockly.Arduino.ORDER_ATOMIC) || '255';
                
                var code = 'constrain(' + value_value + ', ' + value_min + ', ' + value_max + ')';
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'math_constant': function(block) {
                var constant = block.getFieldValue('CONSTANT');
                var code;
                switch (constant) {
                    case 'PI':
                        code = 'PI';
                        break;
                    case 'E':
                        code = 'M_E';
                        break;
                    case 'GOLDEN_RATIO':
                        code = '1.61803398875';
                        break;
                    case 'SQRT2':
                        code = 'M_SQRT2';
                        break;
                    case 'SQRT1_2':
                        code = 'M_SQRT1_2';
                        break;
                    case 'INFINITY':
                        code = 'INFINITY';
                        break;
                    default:
                        code = '0';
                }
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'math_binary_number': function(block) {
                var binary = block.getFieldValue('NUM');
                var code = '0b' + binary;
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'math_hex_number': function(block) {
                var hex = block.getFieldValue('NUM');
                var code = '0x' + hex;
                return [code, Blockly.Arduino.ORDER_ATOMIC];
            },
            
            'math_single': function(block) {
                var operator = block.getFieldValue('OP');
                var argument0 = Blockly.Arduino.valueToCode(block, 'NUM', Blockly.Arduino.ORDER_UNARY_SIGN) || '0';
                var code;
                switch (operator) {
                    case 'ROOT':
                        code = 'sqrt(' + argument0 + ')';
                        break;
                    case 'ABS':
                        code = 'abs(' + argument0 + ')';
                        break;
                    case 'NEG':
                        code = '-' + argument0;
                        break;
                    case 'LN':
                        code = 'log(' + argument0 + ')';
                        break;
                    case 'LOG10':
                        code = 'log10(' + argument0 + ')';
                        break;
                    case 'EXP':
                        code = 'exp(' + argument0 + ')';
                        break;
                    case 'POW10':
                        code = 'pow(10, ' + argument0 + ')';
                        break;
                    case 'SIN':
                        code = 'sin(' + argument0 + ' * PI / 180)';
                        break;
                    case 'COS':
                        code = 'cos(' + argument0 + ' * PI / 180)';
                        break;
                    case 'TAN':
                        code = 'tan(' + argument0 + ' * PI / 180)';
                        break;
                    case 'ASIN':
                        code = 'asin(' + argument0 + ') * 180 / PI';
                        break;
                    case 'ACOS':
                        code = 'acos(' + argument0 + ') * 180 / PI';
                        break;
                    case 'ATAN':
                        code = 'atan(' + argument0 + ') * 180 / PI';
                        break;
                    default:
                        code = '0';
                }
                return [code, Blockly.Arduino.ORDER_UNARY_SIGN];
            }
        };

        // Apply all missing generators
        let appliedCount = 0;
        for (const [blockType, generator] of Object.entries(missingGenerators)) {
            if (typeof Blockly.Arduino[blockType] === 'undefined') {
                Blockly.Arduino[blockType] = generator;
                appliedCount++;
                console.log("✓ Added generator for: " + blockType);
            }
        }

        console.log("COMPREHENSIVE block generator fixes applied! Added " + appliedCount + " generators.");

        // Test that basic generators are working
        setTimeout(function() {
            console.log("=== BLOCK GENERATOR TEST ===");
            const testBlocks = ['math_number', 'variables_declare', 'arduino_setup', 'inout_digital_write', 'potentiometer_ranger_sensor'];
            testBlocks.forEach(blockType => {
                if (typeof Blockly.Arduino[blockType] !== 'undefined') {
                    console.log("✓ " + blockType + " generator is available");
                } else {
                    console.log("✗ " + blockType + " generator is MISSING");
                }
            });
            console.log("=== TEST COMPLETE ===");
        }, 500);

    }, 1000);
});

/**
 * Universal generator for simple sensors
 * Block type must equal the XML <block type="...">
 * Field name must start with "PIN"
 */
(function() {
  const simpleSensors = [
    'LM35_temperature_sensor',
    'Analog_temperature_sensor',
    'Flame_sensor',
    'Flame_status_sensor',
    'Gas_sensor',
    'Gas_status_sensor',
    'Alcohol_sensor',
    'Alcohol_status_sensor',
    'Water_sensor',
    'Moisture_sensor',
    'Vapor_sensor',
    'button_sensor',
    'IR_sensor',
    'IR_status_sensor',
    'LDR_sensor',
    'LDR_status_sensor',
    'Sound_sensor',
    'Sound_status_sensor',
    'tilt_sensor',
    'hall_sensor',
    'pir_sensor',
    'AmbientLight_sensor',
    'knock_sensor',
    'Vibration_sensor',
    'Vibration_status_sensor',
    'photointerrupter_sensor'
  ];

  simpleSensors.forEach(type => {
    Blockly.Arduino[type] = function(block) {
      // find the first field that starts with "PIN"
      let pinField = null;
      block.inputList.forEach(input => {
        input.fieldRow.forEach(field => {
          if (field.name && field.name.indexOf('PIN') === 0) pinField = field.name;
        });
      });
      if (!pinField) return ['0', Blockly.Arduino.ORDER_ATOMIC];

      const pin = block.getFieldValue(pinField);
      const isAnalog = type.indexOf('sensor') > -1 && pin.indexOf('A') === 0;

      if (type.endsWith('_status_sensor') || type.endsWith('_sensor')) {
        // digital or analog read
        const read = isAnalog ? 'analogRead' : 'digitalRead';
        if (!isAnalog) {
          Blockly.Arduino.setups_['setup_input_' + pin] = 'pinMode(' + pin + ', INPUT);';
        }
        return [read + '(' + pin + ')', Blockly.Arduino.ORDER_ATOMIC];
      }
      // add more rules here if needed
      return ['0', Blockly.Arduino.ORDER_ATOMIC];
    };
  });
})();

// -------------------------------------------------
// LM35 temperature sensor
// -------------------------------------------------
Blockly.Arduino['LM35_temperature_sensor'] = function(block) {
  var pin = block.getFieldValue('PIN_LM35');

  // one-time helper
  var funcName = 'readLM35';
  if (!Blockly.Arduino.definitions_[funcName]) {
    Blockly.Arduino.definitions_[funcName] =
        'float ' + funcName + '(uint8_t pin) {\n' +
        '  return analogRead(pin) * 0.488;\n' +
        '}\n';
  }

  var code = funcName + '(' + pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/*  DHT  –  DHT11 / DHT22 temperature & humidity
    field PIN_DHT   : digital pin number
    field DHT_TYPE  : 11 or 22                                       */
Blockly.Arduino['dht_sensor'] = function(block) {
  const pin   = block.getFieldValue('PIN_DHT');
  const type  = block.getFieldValue('DHT_TYPE') || '11';   // 11 or 22
  const func  = 'readDHT_' + pin;                           // unique per pin

  // one-time #include and global object
  if (!Blockly.Arduino.definitions_['dht_' + pin]) {
    Blockly.Arduino.definitions_['dht_' + pin] =
        '#include <DHT.h>\n' +
        'DHT dht_' + pin + '(' + pin + ', ' + type + ');\n';
  }
  // one-time begin() in setup()
  if (!Blockly.Arduino.setups_['dht_begin_' + pin]) {
    Blockly.Arduino.setups_['dht_begin_' + pin] =
        'dht_' + pin + '.begin();';
  }

  // which quantity does the user want?
  const quantity = block.getFieldValue('TYPE') || 'T'; // T = temperature
  const code = (quantity === 'T')
        ? 'dht_' + pin + '.readTemperature()'
        : 'dht_' + pin + '.readHumidity()';

  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

// ==========================================
// LCD I2C BLOCKS FIX - Handle variables correctly
// ==========================================

// Override the lcdi2c_setcursor generator
Blockly.Arduino['lcdi2c_setcursor'] = function(block) {
  // Get values from the block's inputs
  var column = Blockly.Arduino.valueToCode(block, 'column', Blockly.Arduino.ORDER_ATOMIC);
  var row = Blockly.Arduino.valueToCode(block, 'row', Blockly.Arduino.ORDER_ATOMIC);
  var text = Blockly.Arduino.valueToCode(block, 'texttoprint', Blockly.Arduino.ORDER_ATOMIC);
  
  // DEBUG: Log raw values
  console.log("LCD SetCursor - Raw column:", column, "Raw row:", row, "Raw text:", text);
  
  // Apply defaults only if values are truly empty
  if (!column || column.trim() === '') {
    column = '0';
  }
  if (!row || row.trim() === '') {
    row = '0';
  }
  if (!text || text.trim() === '') {
    text = '"Hi arduinoman"';
  }
  
  // DO NOT modify the text valueToCode already returns the correct format:
  // - Text blocks return: "quoted text"
  // - Variables return: variableName (unquoted)
  
  // DEBUG: Log final values
  console.log("LCD SetCursor - Final column:", column, "Final row:", row, "Final text:", text);
  
  // Generate the Arduino code
  var code = `lcd.setCursor(${column}, ${row});\nlcd.print(${text});\n`;
  return code;
};

// Also fix related LCD blocks for consistency
Blockly.Arduino['lcdi2c_setcursoralone'] = function(block) {
  var column = Blockly.Arduino.valueToCode(block, 'column', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var row = Blockly.Arduino.valueToCode(block, 'row', Blockly.Arduino.ORDER_ATOMIC) || '0';
  return `lcd.setCursor(${column}, ${row});\n`;
};

console.log("LCD I2C block generators FIXED with proper variable handling");