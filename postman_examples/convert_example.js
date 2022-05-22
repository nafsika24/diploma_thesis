var fs = require('fs');
const { exit } = require('process');
const { Stream } = require('stream');
var GenerateSchema = require('generate-schema')
util = require('util');


module.exports =  {

  examples_edit:  (inputFile,outputFile) => {
    
  
    
 var output = fs.createWriteStream("./files/" + outputFile);
    

  fs.readFileSync(postmanCollection, (err, data) => {
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

      //output.write(JSON.stringify(json, null, " "))
  })
  const y =  fs.appendFileSync( "temp.json", JSON.stringify(json, null, " "))

  return ("res2")


    
} 
}

