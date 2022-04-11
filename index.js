//server using only Node 

//const http = require('http');
//const nStatic = require('node-static');



//const fileServer = new nStatic.Server('./static');

//http.createServer(function (req, res) {
    
    //fileServer.serve(req, res);

//}).listen(3000);


//server using Express


const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// sendFile will go here
app.get('/', function(req, res) {
  app.use(express.static(path.join(__dirname, '/static')))
  res.sendFile(path.join(__dirname, '/static/home.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
