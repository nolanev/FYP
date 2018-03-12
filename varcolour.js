myApplication.allUsedVariables = function(root) {
  var blocks;
  if (root instanceof Blockly.Block) {
    // Root is Block.
    blocks = root.getDescendants();
  } else if (root.getAllBlocks) {
    // Root is Workspace.
    blocks = root.getAllBlocks();
  } else {
    throw 'Not Block or Workspace: ' + root;
  }
  var variableHash = Object.create(null);
  // Iterate through every block and add each variable to the hash.
  for (var x = 0; x < blocks.length; x++) {
    var blockVariables = blocks[x].getVars();
    if (blockVariables) {
      for (var y = 0; y < blockVariables.length; y++) {
        var varName = blockVariables[y];
        // Variable name may be null if the block is only half-built.
        if (varName) {
          variableHash[varName.toLowerCase()] = varName;
        }
      }
    }
  }
  // Flatten the hash into a list.
  var variableList = [];
  for (var name in variableHash) {
    variableList.push(variableHash[name]);
  }
  return variableList;
};

/**
 * Find all variables that the user has created through the myWorkspace or
 * toolbox.  For use by generators.
 * @param {!Blockly.Workspace} root The myWorkspace to inspect.
 * @return {!Array.<Blockly.VariableModel>} Array of variable models.
 */
myApplication.allVariables = function(root) {
  if (root instanceof Blockly.Block) {
    // Root is Block.
    console.warn('Deprecated call to myApplication.allVariables ' +
                 'with a block instead of a myWorkspace.  You may want ' +
                 'myApplication.allUsedVariables');
    return {};
  }
  return root.getAllVariables();
};
/*
construct the blocks and button 
required by the flyout for the variable category
returns array of xml elements
*/
myApplication.coloursFlyoutCallback = function(myWorkspace) {
 
  var xmlList = [];
  var button = goog.dom.createDom('button');
  button.setAttribute('text', Blockly.Msg.NEW_VARIABLE);
  button.setAttribute('callbackKey', 'CREATE_VARIABLE');

  myWorkspace.registerButtonCallback('CREATE_VARIABLE', function(button) {
    myApplication.createVariable(button.getTargetWorkspace());
  });

  xmlList.push(button);

  var blockList = myApplication.flyoutCategoryBlocks(myWorkspace);
  xmlList = xmlList.concat(blockList);
  return xmlList;
};

/*These are the blocks that appear once a new variable has been created */
myApplication.flyoutCategoryBlocks = function(myWorkspace) {
  var variableModelList = myWorkspace.getVariablesOfType('');
  variableModelList.sort(Blockly.VariableModel.compareByName);

  var xmlList = [];
  if (variableModelList.length > 0) {
    var firstVariable = variableModelList[0];
    if (Blockly.Blocks['variables_set']) {
      var gap = Blockly.Blocks['math_change'] ? 8 : 24;
      var blockText = '<xml>' +
            '<block type="variables_set" gap="' + gap + '">' +
            myApplication.generateVariableFieldXml_(firstVariable) +
            '</block>' +
            '</xml>';
      var block = Blockly.Xml.textToDom(blockText).firstChild;
      xmlList.push(block);
    }
    if (Blockly.Blocks['math_change']) {
      var gap = Blockly.Blocks['variables_get'] ? 20 : 8;
      var blockText = '<xml>' +
          '<block type="math_change" gap="' + gap + '">' +
          myApplication.generateVariableFieldXml_(firstVariable) +
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
            myApplication.generateVariableFieldXml_(variable) +
            '</block>' +
            '</xml>';
        var block = Blockly.Xml.textToDom(blockText).firstChild;
        xmlList.push(block);
      }
    }
  }
  return xmlList;
};

myApplication.generateUniqueName = function(myWorkspace) {
  var variableList = myWorkspace.getAllVariables();
  var newName = '';
  if (variableList.length) {
    var nameSuffix = 1;
    var letters = 'ijkmnopqrstuvwxyzabcdefgh';  // No 'l'.
    var letterIndex = 0;
    var potName = letters.charAt(letterIndex);
    while (!newName) {
      var inUse = false;
      for (var i = 0; i < variableList.length; i++) {
        if (variableList[i].name.toLowerCase() == potName) {
          // This potential name is already used.
          inUse = true;
          break;
        }
      }
      if (inUse) {
        // Try the next potential name.
        letterIndex++;
        if (letterIndex == letters.length) {
          // Reached the end of the character sequence so back to 'i'.
          // a new suffix.
          letterIndex = 0;
          nameSuffix++;
        }
        potName = letters.charAt(letterIndex);
        if (nameSuffix > 1) {
          potName += nameSuffix;
        }
      } else {
        // We can use the current potential name.
        newName = potName;
      }
    }
  } else {
    newName = 'i';
  }
  return newName;
};

/**
 * Create a new variable on the given myWorkspace.
 * @param {!Blockly.Workspace} myWorkspace The myWorkspace on which to create the
 *     variable.
 * @param {function(?string=)=} opt_callback A callback. It will
 *     be passed an acceptable new variable name, or null if change is to be
 *     aborted (cancel button), or undefined if an existing variable was chosen.
 * @param {string=} opt_type The type of the variable like 'int', 'string', or
 *     ''. This will default to '', which is a specific type.
 */
myApplication.createVariable = function(myWorkspace, opt_callback, opt_type) {
  // This function needs to be named so it can be called recursively.
  var promptAndCheckWithAlert = function(defaultName) {
    myApplication.promptName(Blockly.Msg.NEW_VARIABLE_TITLE, defaultName,
      function(text) {
        if (text) {
          if (myWorkspace.getVariable(text)) {
            Blockly.alert(Blockly.Msg.VARIABLE_ALREADY_EXISTS.replace('%1',
                text.toLowerCase()),
                function() {
                  promptAndCheckWithAlert(text);  // Recurse
                });
          } else {
            myWorkspace.createVariable(text, opt_type);
            if (opt_callback) {
              opt_callback(text);
            }
          }
        } else {
          // User canceled prompt without a value.
          if (opt_callback) {
            opt_callback(null);
          }
        }
      });
  };
  promptAndCheckWithAlert('');
};

/**
 * Rename a variable with the given myWorkspace, variableType, and oldName.
 * @param {!Blockly.Workspace} myWorkspace The myWorkspace on which to rename the
 *     variable.
 * @param {?Blockly.VariableModel} variable Variable to rename.
 * @param {function(?string=)=} opt_callback A callback. It will
 *     be passed an acceptable new variable name, or null if change is to be
 *     aborted (cancel button), or undefined if an existing variable was chosen.
 */
myApplication.renameVariable = function(myWorkspace, variable,
  opt_callback) {
  // This function needs to be named so it can be called recursively.
  var promptAndCheckWithAlert = function(defaultName) {
    myApplication.promptName(
      Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', variable.name), defaultName,
      function(newName) {
        if (newName) {
          var newVariable = myWorkspace.getVariable(newName);
          if (newVariable && newVariable.type != variable.type) {
            Blockly.alert(Blockly.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE.replace('%1',
                newName.toLowerCase()).replace('%2', newVariable.type),
                function() {
                  promptAndCheckWithAlert(newName);  // Recurse
                });
          } else {
            myWorkspace.renameVariable(variable.name, newName);
            if (opt_callback) {
              opt_callback(newName);
            }
          }
        } else {
          // User canceled prompt without a value.
          if (opt_callback) {
            opt_callback(null);
          }
        }
      });
  };
  promptAndCheckWithAlert('');
};

/**
 * Prompt the user for a new variable name.
 * @param {string} promptText The string of the prompt.
 * @param {string} defaultText The default value to show in the prompt's field.
 * @param {function(?string)} callback A callback. It will return the new
 *     variable name, or null if the user picked something illegal.
 */
myApplication.promptName = function(promptText, defaultText, callback) {
  Blockly.prompt(promptText, defaultText, function(newVar) {
    // Merge runs of whitespace.  Strip leading and trailing whitespace.
    // Beyond this, all names are legal.
    if (newVar) {
      newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
      if (newVar == Blockly.Msg.RENAME_VARIABLE ||
          newVar == Blockly.Msg.NEW_VARIABLE) {
        // Ok, not ALL names are legal...
        newVar = null;
      }
    }
    callback(newVar);
  });
};

/**
 * Generate XML string for variable field.
 * @param {!Blockly.VariableModel} variableModel The variable model to generate
 *     an XML string from.
 * @return {string} The generated XML.
 * @private
 */
myApplication.generateVariableFieldXml_ = function(variableModel) {
  // The variable name may be user input, so it may contain characters that need
  // to be escaped to create valid XML.
  var element = goog.dom.createDom('field');
  element.setAttribute('name', 'VAR');
  element.setAttribute('variabletype', variableModel.type);
  element.setAttribute('id', variableModel.getId());
  element.textContent = variableModel.name;

  var xmlString = Blockly.Xml.domToText(element);
  return xmlString;
};


myWorkspace.registerToolboxCategoryCallback('COLOUR_PALETTE', myApplication.coloursFlyoutCallback);
 
 