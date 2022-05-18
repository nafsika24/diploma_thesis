var fs = require('fs');
var GenerateSchema = require('generate-schema')

const myArgs = process.argv.slice(2);

// get input and output files
const inputFile = String(myArgs[0])
const outputFile = String(myArgs[1])

var lineReader = require('readline').createInterface({
    input: fs.createReadStream(inputFile)
});

var output = fs.createWriteStream(outputFile);

var found_cockie = false;

lineReader.on('line', function(line){
    if(line.includes("cookie")){
        found_cockie = true
        output.write(JSON.stringify(line) + '\n')

    }
    else if(found_cockie == true){
        var schema = GenerateSchema.json(JSON.parse(line))
        output.write(JSON.stringify(schema) + '\n')
        found_cockie = false
    }
    else{
        output.write(line + '\n')
    }

})
