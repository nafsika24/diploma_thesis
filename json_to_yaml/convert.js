// Require Package
const postmanToOpenApi = require('postman-to-openapi')
var fs = require('fs');
const { Stream } = require('stream');
const { wrap } = require('module');
const { exit } = require('process');
var GenerateSchema = require('generate-schema')

var output;


module.exports =  {

        visual_1: (inputFile,outputFile,description_to_add) => {
            
        const tempFile = "./files/output.yaml"
  
         function demoPromise2() {
               fs.readFile("./files/" + inputFile, (err, data) => {
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
                 fs.writeFile("temp.json", JSON.stringify(json, null, " "), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                }); 
                
              
            })

        } 
        demoPromise2()

      
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

        var req_examples = false;
        let res_ex = []
        let res_ex_one = []

     
        lineReader.on('line', function (line) {
            const rest = "rest_service" + x + "request"

            if(line.includes("summary:") && variables == true){
                const sum1 = line.split("summary:")[1]
                //console.log(line)
                output.write(line + '\n')
                output.write("      operationId: " + String(sum1) + '\n') 
                output.write("      description: " + String(description_to_add) + '\n') 
            } 

            else if(line.includes("requestBody")){
                state = true
                output.write("      x-codegen-request-body-name: " + rest+ '\n')
                components_arr.push("rest_service" + x + "request")
                output.write(line + '\n')
            }

            else if(line.includes("example") && state == true){
                req_examples = true
                output.write(line + '\n')

            }
            else if(req_examples == true && line.includes("parameters:") == false && line.includes("responses:") == false){
                //console.log(line)
                output.write(line + '\n')
                const attr = line.split(":")
                const attr1 = attr[0]
                const attr2 = attr[1]
                var type_of_attr = typeof(attr[1])

                if(attr2 === ''){
                        type_of_attr = 'object'
                }
                res_ex_one.push(attr1.trim() + ": " + type_of_attr + ',') 
            }
            else if(req_examples == true && (line.includes("parameters:") == true || line.includes("responses:") == true)){
                req_examples = false
                state = false
                output.write(line + '\n')
                res_ex.push(res_ex_one)
                res_ex_one = []
            }
            else if(line.includes("type") && state == true){

                output.write(line + '\n')
                const res = '"#' + '/components/schemas/' + components_arr[components_arr.length - 1] + '"'
                output.write('              $ref: ' + res + '\n')
                //state = false
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
            fs.appendFileSync(outputFile, 'components:' + '\n');
            fs.appendFileSync(outputFile, '  schemas:' + '\n');
            var counter = 0;
            for(let i = 0; i < components_arr.length; i++){
                if(components_arr[i].includes("request")){
                    fs.appendFileSync(outputFile, '     ' + components_arr[i] +':' + '\n' + '       type: object' + '\n' + "       properties: \n"  );
                    //console.log(res_ex[i])

                    for (let j = 0; j < res_ex[counter].length; j++){
                        var towrite = res_ex[counter][j].split(":")
                        var re1 = towrite[0]
                        var re2 = String(towrite[1]).replace(",","")
                        //console.log(re2, typeof(re2))
                        if(String(re2).includes('object')){
                            fs.appendFileSync(outputFile, '         ' + re1 +": " + '\n' )
                            fs.appendFileSync(outputFile, '           ' + '$ref:' + ' "#' + '/components/schemas/' + components_arr[i] + "_" + re1 + '"'+  '\n')

                            fs.appendFileSync(outputFile, '     ' + components_arr[i] + "_" + re1 +':' + '\n' + '       type: object' + '\n' + "       properties: \n");
                        }
                        else{
                            fs.appendFileSync(outputFile, '         ' + re1 +": " + '\n' )
                            fs.appendFileSync(outputFile, '           ' + "type: " + re2 +  '\n')
                        }
            
                    }
                    counter = counter + 1
                }
                else{
                    fs.appendFileSync(outputFile, '     ' + components_arr[i] +':' + '\n' + '       type: object' + '\n');

                }
            }
            
            
        });              
    })
            .catch(err => {
                console.log(err)
            })
        return "Finished!!!"
    
} 
}



