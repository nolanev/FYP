var hueDict={};
var hues= [0,180,300, 120, 240, 60];
var counter=0;

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
workspace.addChangeListener(function( event ) { //Blockly.Events.VAR_RENAME
	if (event.type==Blockly.Events.VAR_CREATE){
		//here i need to set the colour of each variable as I create them
		hueDict[event.varId]=hues[counter];
		console.log(hueDict[event.varId]);
		counter=counter+1;
		counter = counter %6;
		var newhuehudis= hueDict[event.varId];
		var newvar = workspace.getVariableById(event.varId);
		var block= workspace.getBlockById(event.blockId);
		
		console.log(block);
		}
	else if(event.type== Blockly.Events.BLOCK_CREATE){
		var block= workspace.getBlockById(event.blockId);
		//console.log(block.getFieldValue('VAR')); //this returns the variable id
		var varId = block.getFieldValue('VAR');
		block.setColour(hueDict[varId]);
		console.log(block);
	}
		
	else if (event.type==Blockly.Events.BLOCK_CHANGE){
		//when the block is chnaged from the drop down menu I need to change its colour
		//block['colour_']
		/*console.log(block['field']);// nope
		console.log(event.element); //try get the value of feild?
		console.log(event.newValue); //block id
		console.log(event.name); //VAR*/
		
		var block= workspace.getBlockById(event.blockId);
		var varId = block.getFieldValue('VAR');
		block.setColour(hueDict[varId]);
		//console.log(block);
		//console.log(block['args0']);
		/*if(block['hue_']==200){block.setColour(100);}
		else block.setColour(200);*/
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
  //console.log("haiii");
  return xmlList;
};
Blockly.Variables.flyoutCategoryBlocks = function(workspace) {
  var variableModelList = workspace.getVariablesOfType('');
  variableModelList.sort(Blockly.VariableModel.compareByName);

  var xmlList = [];
  if (variableModelList.length > 0) {
    var firstVariable = variableModelList[0];
    if (Blockly.Blocks['variables_set']) {
      var gap = Blockly.Blocks['math_change'] ? 8 : 24;
	  
      var blockText = '<xml>' +
            '<block type="variables_set" gap="' + gap + '">' +
            Blockly.Variables.generateVariableFieldXml_(firstVariable) +
            '</block>' +
            '</xml>';
		
      var block = Blockly.Xml.textToDom(blockText).firstChild;
	  console.log(block);
	  xmlList.push(block);
    }
    if (Blockly.Blocks['math_change']) {
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
			
            var existing =
                Blockly.Variables.nameUsedWithAnyType_(text, workspace);
            if (existing) {
              var lowerCase = text.toLowerCase();
              if (existing.type == type) {
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
			  
              var block= workspace.createVariable(text, type);
			  //console.log(block['args0']);
			 
			  //console.log(block);
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


