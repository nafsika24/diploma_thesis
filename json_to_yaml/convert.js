// Require Package
const postmanToOpenApi = require('postman-to-openapi')
var fs = require('fs');
const { Stream } = require('stream');
const { wrap } = require('module');
const { exit } = require('process');
var output;



// // Postman Collection Path
// const postmanCollection = String(myArgs[0])

// // Output OpenAPI Path
// const outputFile = "./" + String(myArgs[1])

module.exports =  {

        visual_1: (inputFile,outputFile,description_to_add) => {
            
        const tempFile = "./files/output.yaml"
        fs.readFileSync("./files/" + inputFile, (err, data) => {
            if (err)
              console.log(err);
            else {
              var json = JSON.parse(data);
              var items = json["item"]
              for(i = 0; i < items.length; i ++) {
                  res = items[i]["response"]
                  var schema = res;
                  if(typeof(schema[0]) !== 'undefined'){
                    var sc = GenerateSchema.json(JSON.parse(schema[0]["body"]))
      
                    schema[0]["body"] = JSON.stringify(sc)
      
                  }
              }
              
            }
      
            const y =  fs.appendFileSync( "temp.json", JSON.stringify(json, null, " "))
        })
        // Promise callback style
        postmanToOpenApi("temp.json", tempFile, { defaultTag: 'General' })
            .then(result => {
            

        // ============================ add addition description here ex. variables from Postman Collection ============================
        var variables = true
        //var description_to_add = String(myArgs[2])

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
        var state1 = false;
        var state2 = false;


        lineReader.on('line', function (line) {
            const rest = "rest_service" + x + "request"

            if(line.includes("summary:") && variables == true){
                //output.write(line + '\n')
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

           else if(line.includes("responses")){
                state1 = true
                //output.write("      x-codegen-request-body-name: " + rest+ '\n')
                output.write(line + '\n')
            }
            else if(line.includes("content") && state1 ==  true){
                state2 = true
                output.write(line + '\n')
            }
            else if(line.includes("requestBody")){
                state1 = false
                output.write(line + '\n')
            }
            else if(line.includes("application/json: {}")){
                state1 = state2 = false
            }
            else if(line.includes("type") && state1 == true && state2 ==  true){
                components_arr.push("REST_ServiceResponse" + x )

                output.write(line + '\n')
                const res = '"#' + '/components/schemas/' + components_arr[components_arr.length - 1] + '"'
                output.write('                $ref: ' + res + '\n')
                state1 = false
                state2 = false
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
    })
            .catch(err => {
                console.log(err)
            })


        


        return "Finished!!!"
    
} 
}



