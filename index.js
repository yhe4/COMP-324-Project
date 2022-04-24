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

//Connecting to mongodb's atlas cluster 
const {MongoClient} = require('mongodb');
const bodyParser =  require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

 //instance of mongo client with mongodb connection string 
 const uri = 'mongodb+srv://adminsp22:adminsp22@bookshelfcluster.ru5tu.mongodb.net/booksDB?retryWrites=true&w=majority';
 const client = new MongoClient(uri);
 client.connect();


// sendFile will go here
app.get('/', function(req, res) {
  app.use(express.static(path.join(__dirname, '/static')))
  res.sendFile(path.join(__dirname, '/static/home.html'));
});


//Post New User to DB & Sign In 
app.post('/signup', function(req,res){
  let new_user_info = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    user_bookshelf: Array[null]
  }
  
  client.db("booksDB").collection("booksCL").insertOne(new_user_info);
  
  return res.redirect('login.html');
})

//Get User Info and Log In 
app.get('/login', function(req,res){
  let username = req.body.username
  let password = req.body.password

  client.db("booksDB").collection("booksCL").findOne({username: req.body.username});

  return res.redirect('home.html');
})

app.listen(port);
console.log('Server started at http://localhost:' + port);
