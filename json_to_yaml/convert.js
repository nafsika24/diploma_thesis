// Require Package
const postmanToOpenApi = require('postman-to-openapi')
var fs = require('fs');
const { Stream } = require('stream');
const { wrap } = require('module');
const { exit } = require('process');
var output;

// help message
const myArgs = process.argv.slice(2);
if(myArgs[0] == "--help"){
    console.log(" \n ========================= HELP SECTION =========================")
    const msg = "USAGE: node convert.js file1 file2 description \n"
    console.log("")
    console.log(msg)
    console.log("Positional Arguments: \n")
    console.log("file1         Postman Collection json File")
    console.log("file2         Output name of File [output.yaml] saved in directory: json_tp_yaml")
    console.log("description   extra info (ex. variables) to be added at the description section in Visual Paradigm \n")

    const msg2 = "USAGE: node convert.js --help \n"
    console.log(msg2)
    console.log("Show help message. \n")
    process.exit()
}
// get user input and output file and possible description
else if(myArgs.length < 3){
    console.log("Please provide 3 parameters. Input file, output file and possible extra description.")
    console.log("Type node convert.js --help for more information.")
    process.exit()
}

// Postman Collection Path
const postmanCollection = String(myArgs[0])

// Output OpenAPI Path
const outputFile = "./" + String(myArgs[1])
const tempFile = "./output.yaml"


// Promise callback style
postmanToOpenApi(postmanCollection, tempFile, { defaultTag: 'General' })
    .then(result => {
        //console.log(`OpenAPI specs: ${result}`)
    })
    .catch(err => {
        console.log(err)
    })

// ============================ add addition description here ex. variables from Postman Collection ============================
var variables = true
var description_to_add = String(myArgs[2])

// =============================================================================

// insert x-codegen-request-body-name parameter if there is requestBody
// needed for the graphical requestService 
var lineReader = require('readline').createInterface({
    input: fs.createReadStream(tempFile)
});

var output = fs.createWriteStream(outputFile);

var x = 1;
const components_arr = []
var state = false;

lineReader.on('line', function (line) {
    const rest = "rest_service" + x + "request"

  if(line.includes("summary:") && variables == true){
        output.write(line + '\n')
        output.write("      description: " + String(description_to_add) + '\n') 
    } 

    if(line.includes("requestBody")){
        state = true
        output.write("      x-codegen-request-body-name: " + rest+ '\n')
        components_arr.push("rest_service" + x + "request")
        output.write(line + '\n')
    }
    else if(line.includes("type") && state == true){

        output.write(line + '\n')
        const res = '"#' + '/components/schemas/' + components_arr[components_arr.length - 1] + '"'
        output.write('              $ref: ' + res + '\n')
        state = false
    }

    else{
        output.write(line + '\n')
    }
    x = x + 1
});

lineReader.on('close', () => {
    console.log("Finishig..."); //Print this when you finish reading test.json
    fs.appendFileSync(outputFile, 'components:' + '\n');
    fs.appendFileSync(outputFile, '  schemas:' + '\n');
    for(let i = 0; i < components_arr.length; i++){
        fs.appendFileSync(outputFile, '     ' + components_arr[i] +':' + '\n' + '       type: object' + '\n');

    }
});




