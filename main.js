var hueDict={};
var hues= [10,180,300, 320, 240, 60];
var counter=0;
var tab1=true;
var tab2=false;
var tab1Json=[];
var tab2Json=[];

function fontSelect(font){
	if (font==1){
		var fontChoice="Arial";
	}
	else if (font==2){
		var fontChoice="Verdana";
	}
	else if (font==3){
		var fontChoice="Courier New";
	}
	var TextElements = document.getElementsByClassName("blocklyText");

	for (var i = 0, max = TextElements.length; i < max; i++) {
		TextElements[i].style.fontFamily = fontChoice;
	}	
	var TextElements = document.getElementsByClassName("blocklyHtmlInput");

	for (var i = 0, max = TextElements.length; i < max; i++) {
		TextElements.style.fontFamily = fontChoice;
	}	
	var TextElements = document.getElementsByClassName("blocklyTreeLabel");

	for (var i = 0, max = TextElements.length; i < max; i++) {
		TextElements[i].style.fontFamily = fontChoice;
	}
	var TextElements = document.getElementsByClassName("options");
	for (var i = 0, max = TextElements.length; i < max; i++) {
		TextElements[i].style.fontFamily = fontChoice;
	}
};
    
//WORKSPACE(S!)
var workspace1 = Blockly.inject('blocklyDiv',
      {media: 'blockly/media/', sounds: false,
	  toolbox: document.getElementById('toolbox'),
     zoom:
         {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
     trashcan: true});
var workspace=workspace1;
var workspace2 = Blockly.inject('blocklyDiv2',
      {media: 'blockly/media/', sounds: false,
	  toolbox: document.getElementById('toolbox'),
     zoom:
         {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
     trashcan: true});
var workspace3 = Blockly.inject('blocklyDiv3',
      {media: 'blockly/media/', sounds: false,
	  toolbox: document.getElementById('toolbox'),
     zoom:
         {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
     trashcan: true});
var workspace4 = Blockly.inject('blocklyDiv4',
      {media: 'blockly/media/', sounds: false,
	  toolbox: document.getElementById('toolbox'),
     zoom:
         {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
     trashcan: true});
divInit();
function showTab(tabNo){
	for(var i=0; i< 4; i++){
		if (i+1==tabNo){
			blocklyDivArray[i].style.zIndex= '-1';
			workspace= workspaceArray[i];
		}
		else {
			blocklyDivArray[i].style.zIndex= '-3';
		}
	}
	
}	 
function divInit(){
	document.getElementById('codeBox').style.zIndex='-7';
	
	workspaceArray=[workspace1, workspace2, workspace3, workspace4];
	blocklyDivArray= [blocklyDiv, blocklyDiv2, blocklyDiv3,blocklyDiv4];
	showTab(1);
}

//JAVASCRIPT	 
function showCodeJavaScript() {
    // Generate JavaScript code and display it.
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
	var code =Blockly.JavaScript.workspaceToCode(workspaceArray[0]);
    for (var i=1;i<4; i++){
		var codei=Blockly.JavaScript.workspaceToCode(workspaceArray[i]);
		code= code.concat(codei);
	}
    var codeBox = document.getElementById('codeBox');
	codeBox.value = code;

    };
function initApi(interpreter, scope) {
    var codeBox = document.getElementById('outputBox');
// Add an API function for the alert() block, generated for "text_print" blocks.
    interpreter.setProperty(scope, 'alert',
    interpreter.createNativeFunction(function(text) {
        text = text ? text.toString() : '';
        codeBox.value +=   text +  '\n'   ;
      }));	
    var wrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(prompt(text));
    };
    interpreter.setProperty(scope, 'prompt',
    interpreter.createNativeFunction(wrapper));

      // Add an API function for highlighting blocks.
    var wrapper = function(id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(highlightBlock(id));
    };
    interpreter.setProperty(scope, 'highlightBlock',
	interpreter.createNativeFunction(wrapper));
}
function runCodeJavaScript() {
	
    // Generate JavaScript code and run it.
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
	Blockly.JavaScript.addReservedWords('code');
    var code =Blockly.JavaScript.workspaceToCode(workspaceArray[0]);
    for (var i=1;i<4; i++){
		var codei=Blockly.JavaScript.workspaceToCode(workspaceArray[i]);
		code= code.concat(codei);
	}
	Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
	myInterpreter = new Interpreter(code, initApi);
	myInterpreter.run();
	
};

//OVERLAY
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
function overlayMenu() {
    document.getElementById("myDropdown").classList.toggle("show");
}
function overlayOn(colour){
		var choice;
		switch(colour){
			case 0:
				document.getElementById("overlay").style.backgroundColor=" rgba(0,0,0, 0)";
				break;
			case 1:
				 document.getElementById("overlay").style.backgroundColor=" rgba(197,168,0, 0.2)";
				break;
			case 2:
				 document.getElementById("overlay").style.backgroundColor="rgba(217,117,44, 0.2)";
				break;
			case 3:
				 document.getElementById("overlay").style.backgroundColor="rgba(212,108,123, 0.2)" ;
				break;
			case 4:
				 document.getElementById("overlay").style.backgroundColor="rgba(184,111,168, 0.2)" ;
				break;
			case 5:
				 document.getElementById("overlay").style.backgroundColor= "rgba(128,118,191, 0.2)";
				break;
			case 6:
				 document.getElementById("overlay").style.backgroundColor="rgba(64,138,191, 0.2)";
				break;			
			case 7:
				 document.getElementById("overlay").style.backgroundColor="rgba(35,156,174, 0.2)";
				break;
			case 8:
				 document.getElementById("overlay").style.backgroundColor= "rgba(112,150,6, 0.2)" ;
				break;
			case 9:
				 document.getElementById("overlay").style.backgroundColor="rgba(26,168,105, 0.2)";
				break;
			case 10:
				 document.getElementById("overlay").style.backgroundColor="rgba(131,128,123, 0.2)";
				break;
			
		}
		
		
	}

//COLOUR CHANGE
function recolour(block, hue) { 
	
    var oldInit = block.init; 
    block.init = function() { 
      oldInit.call(this); 
      this.setColour(hue); 
    } 
  } 
workspace.addChangeListener(function( event ) { 
	 if (event.type==Blockly.Events.BLOCK_CHANGE){
		var block= workspace.getBlockById(event.blockId);
		var varId = block.getFieldValue('VAR');
		block.setColour(hueDict[varId]);	
		}
 	} ) 
Blockly.Variables.flyoutCategoryBlocks = function(workspace) {

var variableModelList=[];
for( var i=0;i<4;i++){
	 var vars= workspaceArray[i].getVariablesOfType('');
	 variableModelList= variableModelList.concat(vars);
	 
 }
  variableModelList.sort(Blockly.VariableModel.compareByName);

  var xmlList = [];
  if (variableModelList.length > 0) {
    var firstVariable = variableModelList[0];

    if (Blockly.Blocks['variables_set']) {
      var gap = Blockly.Blocks['math_change'] ? 8 : 24;
	  
	  if( !hueDict[firstVariable.getId()]){
			hueDict[firstVariable.getId()]=hues[counter];
			counter=counter+1;
			counter = counter %6;
			}
	  
	  var myhue=hueDict[firstVariable.getId()];
	  
	  recolour(Blockly.Blocks['variables_set'],myhue);
	  
      var blockText = '<xml>' +
            '<block type="variables_set" gap="' + gap + '">' +
            Blockly.Variables.generateVariableFieldXml_(firstVariable) +
            '</block>' +
            '</xml>';
		
		
      var block = Blockly.Xml.textToDom(blockText).firstChild;
	
	  xmlList.push(block);
    }
    if (Blockly.Blocks['math_change']) {
	  recolour(Blockly.Blocks['math_change'],myhue);
      var gap = Blockly.Blocks['variables_get'] ? 20 : 8;
      var blockText = '<xml>' +
          '<block type="math_change" gap="' + gap + '">' +
          Blockly.Variables.generateVariableFieldXml_(firstVariable) +
          '<value name="DELTA">' +
          '<shadow type="math_number">' +
          '<field name="NUM">1</field>' +
          '</shadow>' +
          '</value>' +
          '</block>' +
          '</xml>';
      var block = Blockly.Xml.textToDom(blockText).firstChild;
	 
      xmlList.push(block);
    }
	
    for (var i = 0, variable; variable = variableModelList[i]; i++) {
      if (Blockly.Blocks['variables_get']) {
		  
		if( !hueDict[variable.getId()]){
			hueDict[variable.getId()]=hues[counter];
			counter=counter+1;
			counter = counter %6;}
		
        var blockText = '<xml>' +
            '<block type="variables_get" gap="8">' +
            Blockly.Variables.generateVariableFieldXml_(variable) +
            '</block>' +
            '</xml>';
        var block = Blockly.Xml.textToDom(blockText).firstChild;
		xmlList.push(block);
      }
    }
  }
  return xmlList;
};
Blockly.Variables.createVariableButtonHandler = function(workspace, opt_callback, opt_type) {
  var type = opt_type || '';
  // This function needs to be named so it can be called recursively.
  var promptAndCheckWithAlert = function(defaultName) {
    Blockly.Variables.promptName(Blockly.Msg.NEW_VARIABLE_TITLE, defaultName,
        function(text) {
          if (text) {
            
			var existing; //if this variable exists in any other workspace
			for (var i=0; i<4; i++){
				existing+= Blockly.Variables.nameUsedWithAnyType_(text, workspaceArray[i]);
			}
            if ((existing)) {
              var lowerCase = text.toLowerCase();
			  
              if ((existing.type == type)) {
                var msg = Blockly.Msg.VARIABLE_ALREADY_EXISTS.replace(
                    '%1', lowerCase);
              } else {
                var msg = Blockly.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE;
                msg = msg.replace('%1', lowerCase).replace('%2', existing.type);
              }
              Blockly.alert(msg,
                  function() {
                    promptAndCheckWithAlert(text);  // Recurse
                  });
            } else {
              // No conflict
              workspace.createVariable(text, type);
              if (opt_callback) {
                opt_callback(text);
              }
            }
          } else {
            // User canceled prompt.
            if (opt_callback) {
              opt_callback(null);
            }
          }
        });
  };
  promptAndCheckWithAlert('');
};
Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  // Block for variable getter.
  {
    "type": "variables_get",
    "message0": "%1",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}"
      }
    ],
    "output": null,
	
    "colour": "10",
    "helpUrl": "%{BKY_VARIABLES_GET_HELPURL}",
    "tooltip": "%{BKY_VARIABLES_GET_TOOLTIP}",
	"mutator": "colour_change_mutator",
    "extensions": ["contextMenu_variableSetterGetter"]
  },
  // Block for variable setter.
  {
    "type": "variables_set",
    "message0": "%{BKY_VARIABLES_SET}",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}"
      },
      {
        "type": "input_value",
        "name": "VALUE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VARIABLES_HUE}",
    "tooltip": "%{BKY_VARIABLES_SET_TOOLTIP}",
    "helpUrl": "%{BKY_VARIABLES_SET_HELPURL}",
    "extensions": ["contextMenu_variableSetterGetter"]
  }
]);  // END JSON EXTRACT (Do not delete this comment.)
VARIABLE_COLOUR_MIXIN={	
	
	
	mutationToDom: function() {		
	
		var container =document.createElement('mutation');
		
		//PROBLEM IS HAPPENING HERE
		
		var idVal= this.getFieldValue('VAR');
	
		if((idVal=='xa`q:YSNX:x3hzs3.|NX')||(idVal=='|v7Hx*!FG7FP0g(`e1H`')){
			return null;
		}
		if(!hueDict[idVal]){
			hueDict[idVal]=hues[counter];
			counter = counter +1;
			counter= counter %6;
		}
		
		var newHue=hueDict[idVal];		
		this.setColour(newHue);
		

		
		return null;
	},	
	domToMutation: function(xmlElement) {
		}	
};
Blockly.Extensions.registerMutator('colour_change_mutator',VARIABLE_COLOUR_MIXIN, null);
