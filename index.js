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


//Add New User to DB & Sign In 
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

//Retrieve User Info and Log In 
app.post('/login', function(req,res){
  let username = req.body.username;
  let password = req.body.password;

  client.db("booksDB").collection("booksCL").findOne({username: username, password:password})
  .then(result => {
    if(result) {
      console.log(`Successfully found document: ${result._id}, ${result.username},${result.password}`);
    } else {
      console.log("No document matches the provided query.");
    }
    return result;
  })
  .catch(err => console.error(`Failed to find document: ${err}`));

  return res.redirect('home.html');
})



//Add Book to Bookshelf 
app.post('/addBook', function(req,res){
  //check if bookshelf array is null 
  //if so insert new book 
 
  let book = {
    user_bookshelf: [{
      type: Object,
      title: req.body.title,
      authors: req.body.authors,
      publisher: req.body.publisher,
      publisheddate: req.body.publisheddate,
    }]
  }
  console.log(user_bookshelf)
  query = { "Object_id": id }

  client.db("booksDB").collection("booksCL").findOneAndUpdate(query,
    
    { $push: book }
  );
  
})

//Retrieve User's Book from db to Bookshelf

app.listen(port);
console.log('Server started at http://localhost:' + port);
