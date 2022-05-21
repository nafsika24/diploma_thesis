const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
var inquirer = require('inquirer');
const { extendWith } = require('lodash');
const inquirer2 = require('./topostman');
const yaml_to_postman = require('../yaml_to_postman/yaml_to_postman.js')
const exampleAsk = require('./example')
const inquirer3 = require('./toVisual')
const examples_edit = require('../postman_examples/convert_example')
const visual_1 = require('../json_to_yaml/convert')
const visual_2 = require('../json_to_yaml/convert2')



console.log(
  chalk.magenta(
    figlet.textSync('kalispera kai kali vradia', { horizontalLayout: 'full' })
  )
);

inquirer
  .prompt([
    {
      type: 'checkbox',
      message: 'Select Action',
      name: 'Option',
      choices: [
        new inquirer.Separator(''),
        {
          name: 'Postman to OpenApi',
        },
        {
          name: 'OpenApi to Postman',
        },
        {
            name: 'exit'
        },
        {
          name: "help"
        }

      ],
      validate(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one option.';
        }
        return true;
      },
    },
  ])
  .then(async (answers) => {

    ans = answers["Option"][0]
    // convert json to yaml
    if(ans == 'Postman to OpenApi'){

      // check if there are examples at the response body
        const res = await exampleAsk.exampleAsk();
        if(res["Option"] == "Yes"){
          // if yes we have one more task
          console.log("yes")
          const res = await inquirer3.toVisualConvert();
          const input_file = String(res["input"])
          const output_file = "./files/" +  String(res["output"])
          const descr = String(res["description"])

         // const final_convert = await examples_edit.examples_edit(input_file,"temp.json")
          console.log("Finished editig json")
          const tovisual1 = await visual_1.visual_1("./files/temp.json", output_file, descr)
          console.log("")
          console.log('\x1b[31mConvertion Completed Successfully!')
          console.log("")

        }
        // else we continue without the response examples
        else if (res["Option"] == "No"){

          const res = await inquirer3.toVisualConvert();
          const input_file = String(res["input"])
          const output_file = String(res["output"])
          const descr = String(res["description"])

          const tovisual1 = await visual_1.visual_1("./files/" + input_file, "./files/" + output_file, descr)
          console.log("")
          console.log('\x1b[31mConvertion Completed Successfully!')
          console.log("")
        }
       
        else{
          process.exit()
        }
    }
    // exit
    else if(ans == 'exit'){
        console.log("Exiting...")
        process.exit(0)
    }
    else if(ans == "help"){
      console.log(" ")
      console.log(
        chalk.green(
          figlet.textSync('Usage', { horizontalLayout: 'full' })
        )
      );
      console.log(" ")

      console.log(chalk.red.bold("Options:"));   
      console.log(" ")

      console.log(chalk.red.bold("1. Postman to OpenApi:"));  
      console.log(chalk.green("You give as input a Postman Collection(.json) file, the name of the output file(.yaml) and if needed an extra description.")) 
      console.log(chalk.green("The result can be imported to Visual Paradigm and visualized through a Class Diagram.")) 

      console.log(" ")
      console.log(chalk.red.bold("2. OpenApi to Postman:"));  
      console.log(chalk.green("You give as input the generated OpenApi (.yaml) file from the Visual Paradigm and the name of the output file(.yaml).")) 
      console.log(chalk.green("The result can be imported to Postman to create a new API and collection.")) 

      console.log(" ")
      console.log(chalk.red.bold("3. exit:"));  
      console.log(chalk.green("Exit the process.")) 
      console.log(" ")




     }

    // prepare yaml collection to import as API at POstman
    else{
        console.log("Openapi to Postman")
        const res = await inquirer2.toPostmanConvert();
        const input_file = String(res["input"])
        const output_file = String(res["output"])
        
        const final_convert = await yaml_to_postman.yaml_to_postman("./files/" + input_file,"./files/" + output_file)
        console.log("")
        console.log('\x1b[31mConvertion Completed Successfully!')
        console.log("")
      }
    
  });

  console.log(" ")