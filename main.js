
/*
Blockly.Blocks['controls_if'] = {
 init: function() {
   
	this.setColour(300);

}};*/
//////I HAVE LOST THE STRUCTURE BUT I HAVE CHANGED THE COLOUR
//////https://github.com/awmorp/math-blockly/blob/gh-pages/js/math-blocks-vectors.js#L79
//////http://jsbin.com/poreni/1/edit?js,output


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
	
    "colour": "240",
    "helpUrl": "%{BKY_VARIABLES_GET_HELPURL}",
    "tooltip": "%{BKY_VARIABLES_GET_TOOLTIP}",
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
    "colour": "240",
    "tooltip": "%{BKY_VARIABLES_SET_TOOLTIP}",
    "helpUrl": "%{BKY_VARIABLES_SET_HELPURL}",
    "extensions": ["contextMenu_variableSetterGetter"]
  }
]);  // END JSON EXTRACT (Do not delete this comment.)
/*Blockly.Blocks['variables_set']={
	function(){
	this.setColour(300);
}};
this one works to chnage the colour but it also overrides the shape of the block so idk what to do
*/


var myWorkspace = Blockly.inject('blocklyDiv',
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
 
	 
	 function showCodeJavaScript() {
      // Generate JavaScript code and display it.
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      var code = Blockly.JavaScript.workspaceToCode(myWorkspace);
      alert(code);
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
	myApplication={};
	


function overlayMenu() {
    document.getElementById("myDropdown").classList.toggle("show");
}
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

    function runCodeJavaScript() {
      // Generate JavaScript code and run it.
      window.LoopTrap = 1000;
      Blockly.JavaScript.INFINITE_LOOP_TRAP =
          'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
	  Blockly.JavaScript.addReservedWords('code');
      var code = Blockly.JavaScript.workspaceToCode(myWorkspace);
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      try {
        eval(code);
      } catch (e) {
        alert(e);
      }
    }
	  