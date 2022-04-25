const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');

const app = express();
const port = 3000;

//Connecting to mongodb's atlas cluster 
const {MongoClient} = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
const bodyParser =  require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());    


//connect user session 
app.use(cookieParser());                  //tell app to use cookies 
const oneDay = 1000 * 60 * 60 * 24;      //set cookie expiration to 24 hours 
      app.use(sessions({
          secret: "cookiemonsterfjs792ghed",    //encrypt cookie 
          saveUninitialized:true,
          cookie: { maxAge: oneDay },
          resave: false 
      }));



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
    user_bookshelf: []
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
      let session = req.session;
      session.userid = result._id //log in and save db id as user session id 
      req.session.save(function(err) {
        if(err){
          res.end("error occurred while saving session: " + err)
          return;
        }
      })
    } else {
      console.log("No document matches the provided query.");
    }
    return result;
  })
  .catch(err => console.error(`Failed to find document: ${err}`));

  return res.redirect('home.html');


})



//Add Book to Bookshelf - Did not work - Books are now added in bookShelf.js w/o mongodb
// app.post('/addBook', function(req,res){
//   //check if bookshelf array is null 
//   //if so insert new book 
//   console.log(req.body);

//   let book = req.body 

//   let session = req.session; //get session user id/db id 

//   if(session.userid){
//     console.log("user found");
//   }

//   console.log("pringting user id")
//   console.log(session.userid)

//   const userid = session.userid
//   const filter = { "_id": ObjectId(userid)};

//   const updateDoc = {
//     $push: {
//       user_bookshelf: book
//     }
//   };

//   client.db("booksDB").collection("booksCL").updateOne(filter, updateDoc);

// })

//Retrieve User's Book from db to Bookshelf - Books are now removed in bookShelf.js w/o mongodb


app.listen(port);
console.log('Server started at http://localhost:' + port);
