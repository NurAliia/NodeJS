const csvFilePath="./task_1/example.csv";
const csvtojsonV2=require("csvtojson/v2");
const fs=require("fs");

function convertCsvToJson(){
  csvtojsonV2()
  .fromFile(csvFilePath)
  .then((jsonObj)=>{
    writeToFile(jsonObj);
  })
}

function writeToFile(jsonObj){
  let text='';
  jsonObj.forEach(item => {
    text+=JSON.stringify(item) + '\n';
  })
  fs.writeFile("./task_1/output.txt", text, (err) => {
    if (err) {  console.error(err);  return; };
    console.log("File has been created");
  })      
}

exports.convertCsvToJson=convertCsvToJson();