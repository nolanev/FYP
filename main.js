var hueDict={};
var hues= [10,180,300, 320, 240, 60];
var counter=0;
var tab1=true;
var tab2=false;
var tab1Json=[];
var tab2Json=[];


//WORKSPACE(S!)
var workspace1 = Blockly.inject('blocklyDiv',
      {media: 'blockly/media/', 
	  toolbox: document.getElementById('toolbox'),
     zoom:
         {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
     trashcan: true});
workspace=workspace1;
var workspace2 = Blockly.inject('blocklyDiv2',
      {media: 'blockly/media/', 
	  toolbox: document.getElementById('toolbox'),
     zoom:
         {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
     trashcan: true});
var divArray=document.getElementsByClassName("injectionDiv");
var div1= divArray[0];
var div2=divArray[1];
	showTab(1);
function showTab(tabNo){
	if(tabNo==1){
		div2.style.display = 'none';
		div1.style.display = 'block';
		workspace= workspace1;
	}
	else if (tabNo==2){
		div1.style.display = 'none';
		div2.style.display = 'block';
		workspace= workspace2;
	}

}	 


//JAVASCRIPT	 
function showCodeJavaScript() {
      // Generate JavaScript code and display it.
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      var code1 = Blockly.JavaScript.workspaceToCode(workspace1); 
	  var code2 = Blockly.JavaScript.workspaceToCode(workspace2); 
	  var code= code1.concat(code2);
	  alert(code);
    };
function runCodeJavaScript() {
      // Generate JavaScript code and run it.
      window.LoopTrap = 1000;
      Blockly.JavaScript.INFINITE_LOOP_TRAP =
          'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
	  Blockly.JavaScript.addReservedWords('code');
      var code1 = Blockly.JavaScript.workspaceToCode(workspace1); 
	  var code2 = Blockly.JavaScript.workspaceToCode(workspace2); 
	  var code= code1.concat(code2);
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      try {
        eval(code);
      } catch (e) {
        alert(e);
      }
    }	;

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
			case 1:
				choice="pinkOverlay";
				break;
				
			case 2:
				choice="yellowOverlay";
				break;
			case 3:
				choice="blueOverlay";
				break;
		}
		if (document.getElementById(choice).style.display == "block"){
			document.getElementById(choice).style.display = "none";
		}
		else{
		document.getElementById(choice).style.display = "block";
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
 
  var variableModelList1 = workspace1.getVariablesOfType('');
  var variableModelList2 = workspace2.getVariablesOfType('');
  var variableModelList= variableModelList1.concat(variableModelList2);
 
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
		//console.log(block);
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
            var existing1 = Blockly.Variables.nameUsedWithAnyType_(text, workspace1);
			var existing2 = Blockly.Variables.nameUsedWithAnyType_(text, workspace2);
            if ((existing1)||(existing2)) {
              var lowerCase = text.toLowerCase();
              if ((existing1.type == type)||(existing2.type == type)) {
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
Blockly.Extensions.registerMutator('colour_change_mutator',VARIABLE_COLOUR_MIXIN, null,);
