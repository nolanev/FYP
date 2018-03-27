var hueDict={};
var hues= [10,180,300, 320, 240, 60];
var counter=0;
var firstVar=true;

//WORKSPACE
var workspace = Blockly.inject('blocklyDiv',
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
Blockly.Constants.Loops.HUE = 220;
//JAVASCRIPT	 
function showCodeJavaScript() {
      // Generate JavaScript code and display it.
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      var code = Blockly.JavaScript.workspaceToCode(workspace);
      alert(code);
    };
function runCodeJavaScript() {
      // Generate JavaScript code and run it.
      window.LoopTrap = 1000;
      Blockly.JavaScript.INFINITE_LOOP_TRAP =
          'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
	  Blockly.JavaScript.addReservedWords('code');
      var code = Blockly.JavaScript.workspaceToCode(workspace);
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
function recolor(block, hue) { 
	
    var oldInit = block.init; 
    block.init = function() { 
      oldInit.call(this); 
      this.setColour(hue); 
    } 
  } 

workspace.addChangeListener(function( event ) { 
	if ((event.type==Blockly.Events.VAR_CREATE)){
	
		var newvar = workspace.getVariableById(event.varId);
		
				}
	else if(event.type== Blockly.Events.BLOCK_CREATE){
		var block= workspace.getBlockById(event.blockId);
		
		var varId = block.getFieldValue('VAR');
			
		block.setColour(hueDict[varId]);
	}
		
	else if (event.type==Blockly.Events.BLOCK_CHANGE){

		var block= workspace.getBlockById(event.blockId);
		var varId = block.getFieldValue('VAR');
		block.setColour(hueDict[varId]);
	
		;}	
	} )
Blockly.Variables.flyoutCategory = function(workspace) {
	
  var xmlList = [];
 
  var button = goog.dom.createDom('button');
  button.setAttribute('text', Blockly.Msg.NEW_VARIABLE);
  button.setAttribute('callbackKey', 'CREATE_VARIABLE');

  workspace.registerButtonCallback('CREATE_VARIABLE', function(button) {
    Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace());
  });

  xmlList.push(button);

  var blockList = Blockly.Variables.flyoutCategoryBlocks(workspace);
  xmlList = xmlList.concat(blockList);
 
  return xmlList;
};
Blockly.Variables.flyoutCategoryBlocks = function(workspace) {
  var variableModelList = workspace.getVariablesOfType('');
  variableModelList.sort(Blockly.VariableModel.compareByName);

  var xmlList = [];
  if (variableModelList.length > 0) {
    var firstVariable = variableModelList[0];
	
	//only going here if this is the first variable to be logged
	if(firstVar){
		hueDict[firstVariable.getId()]=hues[counter];
		counter=counter+1;
		counter = counter %6;
		firstVar=false;
	}
	
    if (Blockly.Blocks['variables_set']) {
      var gap = Blockly.Blocks['math_change'] ? 8 : 24;
	  
	  if( !hueDict[firstVariable.getId()]){
			hueDict[firstVariable.getId()]=hues[counter];
			counter=counter+1;
			counter = counter %6;
			}
	  
	  var myhue=hueDict[firstVariable.getId()];
	  
	  recolor(Blockly.Blocks['variables_set'],myhue);
	  
      var blockText = '<xml>' +
            '<block type="variables_set" gap="' + gap + '">' +
            Blockly.Variables.generateVariableFieldXml_(firstVariable) +
            '</block>' +
            '</xml>';
		
		
      var block = Blockly.Xml.textToDom(blockText).firstChild;
	
	  xmlList.push(block);
    }
    if (Blockly.Blocks['math_change']) {
	  var myhue=hueDict[firstVariable.getId()];
	  recolor(Blockly.Blocks['math_change'],myhue);
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
			
		var myhue=hueDict[variable.getId()];
		
		
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
		var idVal= this.getFieldValue('VAR');
		var newHue=hueDict[idVal]; //test val		
		this.setColour(newHue);
		container.setAttribute('colour', newHue);
		return container;
	},	
	domToMutation: function(xmlElement) {}	
};

Blockly.Extensions.registerMutator('colour_change_mutator',
  VARIABLE_COLOUR_MIXIN, null,);
