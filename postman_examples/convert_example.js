var fs = require('fs');
const { exit } = require('process');
const { Stream } = require('stream');
var GenerateSchema = require('generate-schema')


// const myArgs = process.argv.slice(2);

// // Postman Collection Path
// const postmanCollection = String(myArgs[0])

// // Output OpenAPI Path
// const outputFile = "./" + String(myArgs[1])

module.exports =  {

  examples_edit: (inputFile,outputFile) => {
    
    postmanCollection = "../postman_examples/" + inputFile   
    var lineReader = require('readline').createInterface({
        input: fs.createReadStream(postmanCollection)
    });
    
  var output = fs.createWriteStream("./files/" + outputFile);
    

  var lineReader = require('readline').createInterface({
      input: fs.createReadStream(postmanCollection)
  });


  var response_found = false;
  var _postman_previewlanguage_found = false;

  fs.readFile(postmanCollection, (err, data) => {
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
        output.write(JSON.stringify(json, null, " "))
      }
  })

  return "Finished!!!"
    
} 
}

