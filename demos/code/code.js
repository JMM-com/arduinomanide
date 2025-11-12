/**
 * Blockly Demos: Code
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Code = {};
//ADEL
var rtl;

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  'ar': 'العربية',
  'en': 'English',
  // 'es':'Español'
  //'fr': 'Français'
};

/**
 * List of RTL languages.
 */
Code.LANGUAGE_RTL = ['ar', 'fa', 'he'];

/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
Code.workspace = null;

//

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if paramater not found.
 * @return {string} The parameter value or the default value if not found.
 */
Code.getStringParamFromUrl = function(name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
Code.getLang = function() {
  var lang = Code.getStringParamFromUrl('lang', '');
  if (Code.LANGUAGE_NAME[lang] === undefined) {
    // Default to English.
    lang = 'en';
  }
  return lang;
};

/**
 * Is the current language (Code.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
Code.isRtl = function() {
  return Code.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};

/**
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
Code.loadBlocks = function(defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch(e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if ('BlocklyStorage' in window && window.location.hash.length > 1) {
    // An href with #key trigers an AJAX call to retrieve saved blocks.
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(Code.workspace, xml);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(Code.workspace, xml);
  } else if ('BlocklyStorage' in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
};

/**
 * Save the blocks and reload with a different language.
 */
Code.changeLanguage = function() {
  // Store the blocks for the duration of the reload.
  // This should be skipped for the index page, which has no blocks and does
  // not load Blockly.
  // MSIE 11 does not support sessionStorage on file:// URLs.
  if (typeof Blockly != 'undefined' && window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(Code.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }

  var languageMenu = document.getElementById('languageMenu');
  var newLang = encodeURIComponent(
      languageMenu.options[languageMenu.selectedIndex].value);
  var search = window.location.search;
  if (search.length <= 1) {
    search = '?lang=' + newLang;
  } else if (search.match(/[?&]lang=[^&]*/)) {
    search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
  } else {
    search = search.replace(/\?/, '?lang=' + newLang + '&');
  }

  window.location = window.location.protocol + '//' +
      window.location.host + window.location.pathname + search;
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
Code.bindClick = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  if (el) {
    el.addEventListener('click', func, true);
    el.addEventListener('touchend', func, true);
  }
};

/**
 * Load the Prettify CSS and JavaScript.
 */
Code.importPrettify = function() {
  //<link rel="stylesheet" href="../prettify.css">
  //<script src="../prettify.js"></script>
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', '../prettify.css');
  document.head.appendChild(link);
  var script = document.createElement('script');
  script.setAttribute('src', '../prettify.js');
  document.head.appendChild(script);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Code.getBBox_ = function(element) {
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  return {
    height: height,
    width: width,
    x: x,
    y: y
  };
};

/**
 * User's language (e.g. "en").
 * @type {string}
 */
Code.LANG = Code.getLang();

/**
 * List of tab names.
 * @private
 */
Code.TABS_ = ['blocks', 'arduino', 'xml'];

Code.selected = 'blocks';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
Code.tabClick = function(clickedName) {
  // If the XML tab was open, save and render the content.
  if (document.getElementById('tab_xml').className == 'tabon') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlText = xmlTextarea.value;
    var xmlDom = null;
    try {
      xmlDom = Blockly.Xml.textToDom(xmlText);
    } catch (e) {
      var q =
          window.confirm(MSG['badXml'].replace('%1', e));
      if (!q) {
        // Leave the user on the XML tab.
        return;
      }
    }
    if (xmlDom) {
      Code.workspace.clear();
      Blockly.Xml.domToWorkspace(Code.workspace, xmlDom);
    }
  }

  if (document.getElementById('tab_blocks').className == 'tabon') {
    Code.workspace.setVisible(false);
  }
  // Deselect all tabs and hide all panes.
  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    var tabElement = document.getElementById('tab_' + name);
    var contentElement = document.getElementById('content_' + name);
    
    if (tabElement) {
      tabElement.className = 'taboff';
    }
    if (contentElement) {
      contentElement.style.visibility = 'hidden';
    }
  }
  
   Code.selected = clickedName;
   
   
//ADEL WARNING
var warningText;
 if (Code.selected == 'arduino') {
    // Check for bad block configurations that make it unlikely that
    // the resulting code is correct.
    var badBlock = Blockly.Arduino.getUnconnectedBlock ? Blockly.Arduino.getUnconnectedBlock() : null;
    //alert(badBlock);
    if (badBlock) {
      warningText = MSG['warningBadBlock'];
      
    } else {
      badBlock = Blockly.Arduino.getBlockWithWarning ? Blockly.Arduino.getBlockWithWarning() : null;
      if (badBlock) {
       warningText = MSG['warningPleaseFix'];
      }
   }
   

    if (badBlock) {
      // Go to blocks pane.
      //Code.displayTab('tab_blocks');
      
      Code.selected = 'blocks';
      clickedName = 'blocks';
      
      // Pop up warning dialog, making an offending block blink.
      // If they close the dialog with "OK", they remain in the blocks pane.
      // If they choose the other option ("generate Lua anyway"), the fake
      // tab "tab_lua!" is selected, and this validation will get skipped.
      var style = {
        left: '25%',
        top: '5em'
      };
      
      var badBlockMsg = document.getElementById('badBlockMsg');
      if (badBlockMsg) {
        badBlockMsg.innerHTML = warningText;
      }
      
      if (BlocklyApps && BlocklyApps.showDialog) {
        BlocklyApps.showDialog(document.getElementById('badBlockDiv'), null,
                               false, true, style, BlocklyApps.stopDialogKeyDown);
        BlocklyApps.startDialogKeyDown();
      }
     
      var blink = function() {
        if (badBlock && badBlock.select) {
          badBlock.select();
        }
        if (BlocklyApps && BlocklyApps.isDialogVisible_) {
          window.setTimeout(function() {
            if (badBlock && badBlock.unselect) {
              badBlock.unselect();
            }
          }, 150);
          window.setTimeout(blink, 300);
        }
      };
      blink();
    
    }
  }
//



  
    // Select the active tab.
  var activeTab = document.getElementById('tab_' + clickedName);
  var activeContent = document.getElementById('content_' + clickedName);
  
  if (activeTab) {
    activeTab.className = 'tabon';
  }
  
  // Show the selected pane.
  if (activeContent) {
    activeContent.style.visibility = 'visible';
  }
  
  Code.renderContent();
  if (clickedName == 'blocks') {
    Code.workspace.setVisible(true);
  }
  Blockly.fireUiEvent(window, 'resize');
};

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Code.renderContent = function() {
  var content = document.getElementById('content_' + Code.selected);
  if (!content) return;
  
  // Initialize the pane.
  if (content.id == 'content_xml') {
    var xmlTextarea = document.getElementById('content_xml');
    if (xmlTextarea) {
      var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
      var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
      xmlTextarea.value = xmlText;
      xmlTextarea.focus();
    }
  } else if (content.id == 'content_javascript') {
    var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
    content.textContent = code;
    if (typeof prettyPrintOne == 'function') {
      code = content.innerHTML;
      code = prettyPrintOne(code, 'js');
      content.innerHTML = code;
    }
  } else if (content.id == 'content_python') {
    var code = Blockly.Python.workspaceToCode(Code.workspace);
    content.textContent = code;
    if (typeof prettyPrintOne == 'function') {
      code = content.innerHTML;
      code = prettyPrintOne(code, 'py');
      content.innerHTML = code;
    }
  } else if (content.id == 'content_php') {
    var code = Blockly.PHP.workspaceToCode(Code.workspace);
    content.textContent = code;
    if (typeof prettyPrintOne == 'function') {
      code = content.innerHTML;
      code = prettyPrintOne(code, 'php');
      content.innerHTML = code;
    }
  } else if (content.id == 'content_arduino') {
    try {
      var code = Blockly.Arduino.workspaceToCode(Code.workspace);
      content.textContent = code;
      if (typeof prettyPrintOne == 'function') {
        code = content.innerHTML;
        code = prettyPrintOne(code, 'arduino');
        content.innerHTML = code;
      }
    } catch (e) {
      console.error("Error generating Arduino code:", e);
      content.textContent = "// Error generating code: " + e.message;
    }
  }
};

/**
 * Initialize Blockly.  Called on page load.
 */
Code.yes = function() {
    // Safely check if elements exist before setting innerHTML
    var capacityElement = document.getElementById('capacity');
    var testElement = document.getElementById('test');
    
    if (capacityElement) {
        var myb = Code.workspace.getAllBlocks();
        capacityElement.innerHTML = myb.length;
    }
    
    if (testElement) {
        var ko = Code.workspace.getAllBlocksADEL ? Code.workspace.getAllBlocksADEL() : [];
        testElement.innerHTML = ko.length - 1;
    }
    
/*   //
    var toolbox = '<xml id="toolbox" >';
      toolbox += '<category id="catInOut" colour="10">';
  toolbox += '   <block type="inout_digital_read"></block>';
  toolbox += '   <block type="inout_analog_read"></block>';
        toolbox += '</category>';
  toolbox += '</xml>';
   if (ko.length>2){
       //Code.workspace.updateToolbox(toolbox);
   }
    //*/
}

Code.init = function() {
  Code.initLanguage();
  var RTL=Code.isRtl();
  rtl = Code.isRtl();
  var container = document.getElementById('content_area');
  if (!container) return;
  
  var onresize = function(e) {
    var bBox = Code.getBBox_(container);
    for (var i = 0; i < Code.TABS_.length; i++) {
      var el = document.getElementById('content_' + Code.TABS_[i]);
      if (el) {
        el.style.top = bBox.y + 'px';
        el.style.left = bBox.x + 'px';
        // Height and width need to be set, read back, then set again to
        // compensate for scrollbars.
        el.style.height = bBox.height + 'px';
        el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
        el.style.width = bBox.width + 'px';
        el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
      }
    }
    // Make the 'Blocks' tab line up with the toolbox.
    if (Code.workspace && Code.workspace.toolbox_ && Code.workspace.toolbox_.width) {
      var tabBlocks = document.getElementById('tab_blocks');
      if (tabBlocks) {
        tabBlocks.style.minWidth = (Code.workspace.toolbox_.width - 38) + 'px';
      }
    }
  };
  onresize();
  window.addEventListener('resize', onresize, false);

  var toolbox = document.getElementById('toolbox');
  if (!toolbox) return;
  
  // ALWAYS use LTR layout regardless of language to maintain exact same layout
  Code.workspace = Blockly.inject('content_blocks',
      {grid:
          {spacing: 25,
           length: 3,
           colour: '#ccc',
           snap: true},
       media: '../../media/',
       rtl: false, // Force LTR for all languages
       toolbox: toolbox,
       zoom:
           {controls: true,
            wheel: true},
       // Additional options to help with text rendering
       move: {
         scrollbars: true,
         drag: true,
         wheel: true
       }
      });

//ADEL
if (Code.workspace) {
  Code.workspace.addChangeListener(Code.yes);
}

// Copier coller
function onchange(event) {
  try {
    var foolElement = document.getElementById('fool');
    if (foolElement) {
      var code;
      try {
        code = Blockly.Arduino.workspaceToCode(Code.workspace);
        foolElement.value = code;
      } catch (e) {
        console.error("Error generating Arduino code in onchange:", e);
        foolElement.value = "// Error generating code: " + e.message;
      }
    }
  } catch (error) {
    console.error("Error in onchange function:", error);
  }
}

if (Code.workspace) {
  Code.workspace.addChangeListener(onchange);
}

  // Add to reserved word list: Local variables in execution environment (runJS)
  // and the infinite loop detection function.
  Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');
  
  var mystartfile;
  mystartfile= '<xml xmlns="http://www.w3.org/1999/xhtml">';
  mystartfile +=  '<block type="arduino_setup" x="0" y="0"></block>';
  mystartfile += '</xml>';
  Code.loadBlocks(mystartfile);

  if ('BlocklyStorage' in window) {
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload(Code.workspace);
  }

  Code.tabClick(Code.selected);

  Code.bindClick('trashButton',
      function() {Code.discard(); Code.renderContent();});
  Code.bindClick('runButton', Code.runJS);
  // Disable the link button if page isn't backed by App Engine storage.
  var linkButton = document.getElementById('linkButton');
  if ('BlocklyStorage' in window) {
    BlocklyStorage['HTTPREQUEST_ERROR'] = MSG['httpRequestError'];
    BlocklyStorage['LINK_ALERT'] = MSG['linkAlert'];
    BlocklyStorage['HASH_ERROR'] = MSG['hashError'];
    BlocklyStorage['XML_ERROR'] = MSG['xmlError'];
    Code.bindClick(linkButton,
        function() {BlocklyStorage.link(Code.workspace);});
  } else if (linkButton) {
    linkButton.className = 'disabled';
  }

  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    Code.bindClick('tab_' + name,
        function(name_) {return function() {Code.tabClick(name_);};}(name));
  }

  // Lazy-load the syntax-highlighting.
  window.setTimeout(Code.importPrettify, 1);
};

/**
 * Initialize the page language.
 */
Code.initLanguage = function() {
  // ALWAYS use LTR direction for the entire document to maintain layout
  document.dir = 'ltr';
  document.head.parentElement.setAttribute('lang', Code.LANG);
  
  // Add language attribute to body for CSS targeting
  document.body.setAttribute('lang', Code.LANG);

  // Sort languages alphabetically.
  var languages = [];
  for (var lang in Code.LANGUAGE_NAME) {
    languages.push([Code.LANGUAGE_NAME[lang], lang]);
  }
  var comp = function(a, b) {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };
  languages.sort(comp);
  // Populate the language selection menu.
  var languageMenu = document.getElementById('languageMenu');
  if (languageMenu) {
    languageMenu.options.length = 0;
    for (var i = 0; i < languages.length; i++) {
      var tuple = languages[i];
      var lang = tuple[tuple.length - 1];
      var option = new Option(tuple[0], lang);
      if (lang == Code.LANG) {
        option.selected = true;
      }
      languageMenu.options.add(option);
    }
    languageMenu.addEventListener('change', Code.changeLanguage, true);
  }

  // Inject language strings.
  document.title += ' ' + MSG['title'];
  //document.getElementById('title').textContent = MSG['title'];
  
  var tabBlocks = document.getElementById('tab_blocks');
  if (tabBlocks) {
    tabBlocks.textContent = MSG['blocks'];
  }

  var linkButton = document.getElementById('linkButton');
  if (linkButton) {
    linkButton.title = MSG['linkTooltip'];
  }
  
  var runButton = document.getElementById('runButton');
  if (runButton) {
    runButton.title = MSG['runTooltip'];
  }
  
  var trashButton = document.getElementById('trashButton');
  if (trashButton) {
    trashButton.title = MSG['trashTooltip'];
  }
  
  var uploadButton = document.getElementById('uploadButton');
  if (uploadButton) {
    uploadButton.title = MSG['uploadTooltip'];
  }
  
  var myBtn = document.getElementById('myBtn');
  if (myBtn) {
    myBtn.title = MSG['myBtnTooltip'];
  }
  
  var buyBtn = document.getElementById('buyBtn');
  if (buyBtn) {
    buyBtn.title = MSG['BuyTooltip'];
  }
  
  var boardBtn = document.getElementById('boardBtn');
  if (boardBtn) {
    boardBtn.title = MSG['BoardTooltip'];
  }
  
  var savexmlButton = document.getElementById('savexmlButton');
  if (savexmlButton) {
    savexmlButton.title = MSG['saveXMLTooltip']; 
  }
  
  var fakeload = document.getElementById('fakeload');
  if (fakeload) {
    fakeload.title = MSG['loadXMLTooltip']; 
  }
  
  var copyButton = document.getElementById('copyButton');
  if (copyButton) {
    copyButton.title = MSG['copycodeTooltip'];
  }

  // Update button texts for Arabic
  if (Code.LANG === 'ar') {
    if (tabBlocks) {
      tabBlocks.textContent = MSG['blocks'];
    }
    
    var tabArduino = document.getElementById('tab_arduino');
    if (tabArduino) {
      tabArduino.textContent = 'أردوينو';
    }
    
    if (copyButton) {
      copyButton.innerHTML = '<img src="../../media/iconecopy.png" class="icon21"> نسخ الكود';
    }
    
    if (trashButton) {
      trashButton.innerHTML = '<img src="../../media/trash.png" class="icon21"> حذف الكل';
    }
    
    if (savexmlButton) {
      savexmlButton.innerHTML = '<img src="../../media/saveXML.png" class="icon21"> حفظ الكتل';
    }
    
    if (fakeload) {
      fakeload.innerHTML = '<img src="../../media/loadXML.png" class="icon21"> تحميل الكتل';
    }
    
    if (runButton) {
      runButton.innerHTML = '<img src="../../media/arduino.png" class="icon21"> حفظ كود الأردوينو';
    }
    
    if (myBtn) {
      myBtn.innerHTML = '<img src="../../media/loadXML.png" class="run icon21"> الأمثلة';
    }
    
    // Update modal content for Arabic
    Code.updateModalContent();
  }

  var categories = ['catInOut','catSerialAll','catSerial','catSerial1','catSoftSerial','catBTAll','catBTSerial1','catBTSoftSerial','catMotors','catMotorMRT','catServo','catSimpleSensorsALL','catSimpleSensors','catSimpleSensors2','catSimpleSensors3','catSimpleActuators','catSerialLCD_I2C','catDisplay','catVision','catADXL345','catHMC5883','catDigital','catAnalog','catCCS811', 
                    'catString','catDivers','catInterruptExt','catStorage','catMAX7219_7D','catMAX7219_LM','catEEprom','catStepper','catStepper28BYJ','catRTCDS3231','catRTCDS1302','catLedStrip','catTM1637','catTM1638','catLogic','catLoops','catTime','catGenericTime', 'catMath', 'catText','catRotaryEncoder','catGPS','catAllVar','catVariables', 'catFunctions','catRemoteIR','catKeypad',
                    'catOtherSensors','catRFID','catRadioTEA5767','catCommunication','catDFPlayerMP3','catYK5300MP3','catmicroSD','catAPDS9960','catWIFISerial1','catWIFISoftSerial','catOtherActuators','catWIFI','catIOT','catMQTTWifi','catRF24L01','catRF','catTCS3200','catTCS34725','catCamera','catds18b20','catST7735','catNEXTION','catServoRot','catPixy2','catMuVision','catOtto','catArray'];
  for (var i = 0, cat; cat = categories[i]; i++) {
    var element = document.getElementById(cat);
    if (element) {
      element.setAttribute('name', MSG[cat]);
    }
  }
  var textVars = document.getElementsByClassName('textVar');
  for (var i = 0, textVar; textVar = textVars[i]; i++) {
    textVar.textContent = MSG['textVariable'];
  }
  var listVars = document.getElementsByClassName('listVar');
  for (var i = 0, listVar; listVar = listVars[i]; i++) {
    listVar.textContent = MSG['listVariable'];
  }
};

/**
 * Update modal content for Arabic language
 */
Code.updateModalContent = function() {
  if (Code.LANG === 'ar') {
    // Update modal title
    var modalTitle = document.querySelector('.modal-header h2');
    if (modalTitle) {
      modalTitle.textContent = 'اختر مثالاً';
    }
    
    // Update close button text
    var closeButton = document.querySelector('.close');
    if (closeButton) {
      closeButton.textContent = '×';
    }
    
    // Update example descriptions
    var examples = {
      'model0': 'وميض LED',
      'model1': 'الجمباز', 
      'model2': 'القطار',
      'model3': 'البطة',
      'model4': 'الدولاب الدوار',
      'model5': 'سيارة الإطفاء',
      'model6': 'المتزلج أو الملاكم',
      'model7': 'الدب أو روبوت كرة القدم أو الهليكوبتر',
      'model8': 'الرماية',
      'model9': 'البيانو',
      'model10': 'السيارة بالمفتاح'
    };
    
    for (var key in examples) {
      var element = document.getElementById(key);
      if (element) {
        element.textContent = examples[key];
      }
    }
  }
};

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
Code.runJS = function() {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
  var timeouts = 0;
  var checkTimeout = function() {
    if (timeouts++ > 1000000) {
      throw MSG['timeout'];
    }
  };
  var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    eval(code);
  } catch (e) {
    alert(MSG['badCode'].replace('%1', e));
  }
};

/**
 * Discard all blocks from the workspace.
 */
Code.discard = function() {
  var count = Code.workspace.getAllBlocks().length;
  if (count < 2 ||
      window.confirm(MSG['discard'].replace('%1', count))) {
    Code.workspace.clear();
    window.location.hash = '';
  }
};

//ADEL FOR WARNING
Code.stopDialogKeyDown = function() {
  if (document.body && BlocklyApps && BlocklyApps.dialogKeyDown_) {
    document.body.removeEventListener('keydown',
        BlocklyApps.dialogKeyDown_, true);
  }
};

Code.showDialog = function(content, origin, animate, modal, style,
                                  disposeFunc) {
  if (BlocklyApps && BlocklyApps.isDialogVisible_) {
    BlocklyApps.hideDialog(false);
  }
  
  if (BlocklyApps) {
    BlocklyApps.isDialogVisible_ = true;
    BlocklyApps.dialogOrigin_ = origin;
    BlocklyApps.dialogDispose_ = disposeFunc;
  }
  
  var dialog = document.getElementById('dialog');
  var shadow = document.getElementById('dialogShadow');
  var border = document.getElementById('dialogBorder');
  
  if (!dialog) return;

  // Copy all the specified styles to the dialog.
  for (var name in style) {
    dialog.style[name] = style[name];
  }
  if (modal && shadow) {
    shadow.style.visibility = 'visible';
    shadow.style.opacity = 0.3;
    var header = document.createElement('div');
    header.id = 'dialogHeader';
    dialog.appendChild(header);
    if (BlocklyApps) {
      BlocklyApps.dialogMouseDownWrapper_ =
          Blockly.bindEvent_(header, 'mousedown', null,
                             BlocklyApps.dialogMouseDown_);
    }
  }
  dialog.appendChild(content);
  content.className = content.className.replace('dialogHiddenContent', '');

  function endResult() {
    // Check that the dialog wasn't closed during opening.
    if (BlocklyApps && BlocklyApps.isDialogVisible_ && dialog) {
      dialog.style.visibility = 'visible';
      dialog.style.zIndex = 1;
      if (border) {
        border.style.visibility = 'hidden';
      }
    }
  }
  if (animate && origin) {
    if (BlocklyApps && BlocklyApps.matchBorder_) {
      BlocklyApps.matchBorder_(origin, false, 0.2);
      BlocklyApps.matchBorder_(dialog, true, 0.8);
    }
    // In 175ms show the dialog and hide the animated border.
    window.setTimeout(endResult, 175);
  } else {
    // No animation.  Just set the final state.
    endResult();
  }
};

///

// Load the Code demo's language strings.
document.write('<script src="msg/' + Code.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="../../msg/js/' + Code.LANG + '.js"></script>\n');

window.addEventListener('load', Code.init);