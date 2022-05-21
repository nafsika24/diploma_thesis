var fs = require('fs');
var beautify = require("json-beautify");
var GenerateSchema = require('generate-schema')

var output;

// get user input and output file
// const myArgs = process.argv.slice(2);
// if(myArgs.length < 2){
//     console.log("Please provide two parameters. Input and output file.")
//     process.exit()
// }

// get input and output files
// const inputFile = String(myArgs[0])
// const outputFile = String(myArgs[1])


module.exports =  {

    yaml_to_postman: (inputFile,outputFile) => {
    
     inputFile = "../yaml_to_postman/" + inputFile   
    var lineReader = require('readline').createInterface({
        input: fs.createReadStream(inputFile)
    });
    
    var output = fs.createWriteStream(outputFile);
    
    
    // ================== convert many lines of example into one and rest changes ==================
    
    var found_request_body = false;
    var total_example = ""
    var not_finished = false;
    var example_variable = false;
    var parameters_found = false;
    var responses_found = false;
    var res_example = ""
    var not_f_response = false;
    
    lineReader.on('line', function(line){
    
        // ================== responses ==================
        if(line.includes("responses:")){
           responses_found = true;
            output.write(line + '\n')
            //console.log(line)
        }
        else if(line.includes("example:") && responses_found == true){
            responses_found = false;
            var toWrite = '              example: '
            output.write(toWrite + eval(line) + '\n')    
        }
    
    
        else if (line.includes("x-codegen-request-body-name")){
            responses_found = false;
            found_request_body = true;
            output.write(line + '\n')
    
        }
        // example is in one line, write it in the new file
        else if(found_request_body && line.includes("example:") && line.includes("}")){
            var toWrite = '            example: '
            output.write(toWrite + eval(line) + '\n')
            found_request_body = false;
        }
          // example is not finished in one line, keep it in total_example
        else if(found_request_body && line.includes("example:") && line.includes("}") == false ){
            found_request_body = true;
            not_finished = true;
            total_example = total_example + line
            //console.log("KEEP TOTAL EXAMPLE")
        }
       
        // found the end line of the example
        else if(found_request_body && not_finished && line.includes("}")){
            //console.log("END OF EXAMPLE")
            total_example = total_example + line.trim()
            //console.log(total_example)
    
            var toWrite = '            example: '
            output.write(toWrite + eval(total_example) + '\n')
            found_request_body = false;
            not_finished = false;
            total_example = ""
        }
      
        else if(found_request_body && not_finished){
            total_example = total_example + line
        }
        // remove en extra / from initial url
        else if(line.includes("url")){
            output.write(line.slice(0,-1) + '\n') 
        }
        
        // change format of example parameter
        else if(line.includes("parameter")){
            responses_found = false;
            parameters_found = true;
            output.write(line + '\n')
        }
        // change format of example parameter
        else if(line.includes("example:") && parameters_found && line.includes("csv") == false){
            var toWrite = '        example: ';
            output.write(toWrite+eval(line) + '\n')
            parameters_found = false
        }
      
        else{
            output.write(line + '\n')
        }
    })

    return "Finished!!!"
    
} 
}

