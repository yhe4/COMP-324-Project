const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user')
const mongoose = require('mongoose');

const app = express();
const port = 3000;

//Connecting to mongodb's atlas cluster 
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
const bodyParser = require("body-parser");
const res = require('express/lib/response');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


//connect user session 
app.use(cookieParser());                  //tell app to use cookies 
const oneDay = 1000 * 60 * 60 * 24;      //set cookie expiration to 24 hours 
app.use(sessions({
  secret: "cookiemonsterfjs792ghed",    //encrypt cookie 
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));



//instance of mongo client with mongodb connection string 
const uri = 'mongodb+srv://adminsp22:adminsp22@bookshelfcluster.ru5tu.mongodb.net/booksDB?retryWrites=true&w=majority';
const client = new MongoClient(uri);
client.connect();
//'mongodb://localhost:27017/bookshelf'

//connecting to Atlas URI for our database
mongoose.connect('mongodb+srv://adminsp22:adminsp22@bookshelfcluster.ru5tu.mongodb.net/booksDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
  //useFindAndModify: false
}).then(() => {
  console.log("yes")
}).catch(err => {
  console.log(err)
})

const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Database connected");
// });

// sendFile will go here
app.get('/', function (req, res) {
  app.use(express.static(path.join(__dirname, '/static')))
  res.sendFile(path.join(__dirname, '/static/login.html'));
});





//Add New User to DB & Sign In 
app.get('/signup', (req, res) => {
  res.render('signup')
})

app.post('/signup', async (req, res) => {
  const {
    fname, lname, email, username, password,
    // user_bookshelf: []
  } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    fname, lname, email, username, password: hash,
    //user_bookshelf: []
  })
  //client.db("booksDB").collection("booksCL").insertOne(new_user_info);
  await user.save()
  return res.redirect('login.html');
})




//NEW LOGIN METHODS
//Retrieve User Info and Log In 
app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  //const user = await client.db("booksDB").collection("booksCL").findOne({ username });
  const user = await User.findOne({ username }); //check if user exists
  if (!user) {
    return res.redirect('login.html') //if user does not exist return to login.html
  }
  const validPassword = await bcrypt.compare(password, user.password); //compares given password with registered password
  if (validPassword) {
    console.log(`Successfully found document: `);

    let session = req.session;
    session.userid = user._id //log in and save db id as user session id 
    req.session.save(function (err) {
      if (err) {
        res.end("error occurred while saving session: " + err)
        return;
      }
      return res.redirect('home.html'); //if everything checks out then continue to home
    })
  }
  else {
    return res.redirect('login.html');  //if password does not correspond to user return to login.html
  }
})

// Original methods>>>>
// //Add New User to DB & Sign In 
// app.post('/signup', function(req,res){
//   let new_user_info = {
//     fname: req.body.fname,
//     lname: req.body.lname,
//     email: req.body.email,
//     username: req.body.username,
//     password: req.body.password,
//     user_bookshelf: []
//   }

//   client.db("booksDB").collection("booksCL").insertOne(new_user_info);

//   return res.redirect('login.html');
// })

// //Retrieve User Info and Log In 
// app.post('/login', function(req,res){
//   let username = req.body.username;
//   let password = req.body.password;

//   client.db("booksDB").collection("booksCL").findOne({username: username, password:password})
//   .then(result => {
//     if(result) {
//       console.log(`Successfully found document: ${result._id}, ${result.username},${result.password}`);
//       let session = req.session;
//       session.userid = result._id //log in and save db id as user session id 
//       req.session.save(function(err) {
//         if(err){
//           res.end("error occurred while saving session: " + err)
//           return;
//         }
//       })
//     } else {
//       console.log("No document matches the provided query.");
//     }
//     return result;
//   })
//   .catch(err => console.error(`Failed to find document: ${err}`));

//   return res.redirect('home.html');


// })



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
