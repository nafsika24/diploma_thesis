const inquirer2 = require('inquirer');
const fs = require('fs')

module.exports = {

  toPostmanConvert:  () => {
    const argv = require('minimist')(process.argv.slice(2));

    const questions = [
      {
        type: 'input',
        name: 'input',
        message: 'Enter the name of the file(.yaml) to convert:',
        validate: function( value ) {
          if (fs.existsSync("./files/" + value)) {
            return true;
          } else {
            return 'Please enter an existing file.';
          }
        }
      },
      {
        type: 'input',
        name: 'output',
        message: 'Enter the name of the created file:',
        validate: function( value ) {
          if (value.includes(".yaml")) {
            return true;
          } else {
            return 'Please enter a valid filename (.yaml).';
          }
        }
      },
    
    ];
    return inquirer2.prompt(questions)
  }
}