var newman = require('newman'); // require Newman in your project
const fs = require('fs')

const input_json = process.argv[2];
const output_file = process.argv[3];
const myArgs = process.argv.slice(1);

console.log(myArgs.length)
if(myArgs.length != 3){
    console.log("Please provide json file and a txt parameter. Command: node saveResponse.js [json input file] [txt output file]")
    process.exit()
}

// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require('./'+String(input_json)),
    reporters: 'cli',
    insecure: true
}).on('request', (error,data) => {
    if(error){
        console.log(error)
        return;
}


const fileNale = String(output_file);
const content = data.response.stream.toString();

fs.appendFile(fileNale, content, function(error) {
    if(error){
        console.log(error);
    }
})
});