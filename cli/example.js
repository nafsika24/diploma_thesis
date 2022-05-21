const inquirer_example = require('inquirer');
const fs = require('fs')

module.exports = {

  exampleAsk:  () => {
    const argv = require('minimist')(process.argv.slice(2));

    const questions = [
        {
          type: 'checkbox',
          message: 'Does the Collection have Response Examples?',
          name: 'Option',
          choices: [
            new inquirer_example.Separator(''),
            {
              name: 'Yes',
            },
            {
              name: 'No',
            },
            {
                name: 'exit'
            }
    
          ],
          validate(answer) {
            if (answer.length < 1) {
              return 'You must choose at least one option.';
            }
            console.log(answer)
            console.log("ddd")
            return true;
          },
        },
      ]
    return inquirer_example.prompt(questions)
  }
}