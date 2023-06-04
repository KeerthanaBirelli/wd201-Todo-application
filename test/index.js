/*const http= require("http");
const fs=require("fs");
const server=http.createServer((req,res)=>{
    fs.readFile("sample.txt", (err,data) =>{
        res.end(data);
    })

});
server.listen(3000);*/

/*const readline = require("readline");

const lineDetail = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

lineDetail.question(`Please provide your name - `, (name) => {
  console.log(`Hi ${name}!`);
  lineDetail.close();
});*/
console.log('Hello 1');

// Print message after 100 millisecond
setTimeout(function() {
   console.log('Hello 2');
}, 100);
console.log('Hello 3');