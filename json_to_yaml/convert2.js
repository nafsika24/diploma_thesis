var fs = require('fs');


const myArgs = process.argv.slice(2);
const inputfile = String(myArgs[0])
const outputFile = String(myArgs[1])

var lineReader = require('readline').createInterface({
    input: fs.createReadStream(inputfile)
});

var output = fs.createWriteStream(outputFile);
var x = 1;
var state = false;
var state2 = false
const components_arr = []

lineReader.on('line', function (line) {
    const rest = "REST_ServiceResponse" + x 

    if(line.includes("responses")){
        state = true
        //output.write("      x-codegen-request-body-name: " + rest+ '\n')
        output.write(line + '\n')
    }
    else if(line.includes("content") && state ==  true){
        state2 = true
        output.write(line + '\n')
    }
    else if(line.includes("requestBody")){
        state = false
        output.write(line + '\n')
    }
    else if(line.includes("application/json: {}")){
        state = state2 = false
    }
    else if(line.includes("type") && state == true && state2 ==  true){
        components_arr.push("REST_ServiceResponse" + x )

        output.write(line + '\n')
        const res = '"#' + '/components/schemas/' + components_arr[components_arr.length - 1] + '"'
        output.write('                $ref: ' + res + '\n')
        state = false
        state2 = false
    }

    else{
        output.write(line + '\n')
    }
    x = x + 1
});

lineReader.on('close', () => {
    console.log("Finishig..."); //Print this when you finish reading test.json
    // fs.appendFileSync(outputFile, 'components:' + '\n');
    // fs.appendFileSync(outputFile, '  schemas:' + '\n');
    for(let i = 0; i < components_arr.length; i++){
        fs.appendFileSync(outputFile, '     ' + components_arr[i] +':' + '\n' + '       type: object' + '\n');

    }
});