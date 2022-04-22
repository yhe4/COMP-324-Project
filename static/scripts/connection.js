//Connecting to mongodb's atlas cluster 
const {MongoClient} = require('mongodb');

async function main() {
    //instance of mongo client with mongodb connection string 
    const uri = 'mongodb+srv://adminsp22:adminsp22@bookshelfcluster.ru5tu.mongodb.net/booksDB?retryWrites=true&w=majority';
    const client = new MongoClient(uri);

    try {
        //connect cluster and await until complete 
        await client.connect();

       

    } catch (e) {
        console.error(e) //error message incase connection fails  
    } finally{

        await client.close();
    }

}

main().catch(console.error)

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    databasesList.databases.forEach(db => {
        console.log(`-${db.name}`)
    })

}


//general fucntion to connect to atlas cluster db 
async function connect() {
    //const {MongoClient} = require('mongodb');
    //instance of mongo client with mongodb connection string 
    const uri = 'mongodb+srv://adminsp22:adminsp22@bookshelfcluster.ru5tu.mongodb.net/booksDB?retryWrites=true&w=majority';
    const client = new MongoClient(uri);

    try {
        //connect cluster and await until complete 
        await client.connect();

    } catch (e) {
        console.error(e) //error message incase connection fails  
    } 

    return client
}


//function for adding a new user (Cr -- CrUD)
//fname, lname, email, username, password from sign up html form 

async function createNewUser() {
    //connect to db 
    client =  await connect()
   let new_user_info = {
       fname: document.getElementById("newUser-fname").value,
       lname: document.getElementById("newUser-lname").value,
       email: document.getElementById("newUser-email").value,
       username: document.getElementById("newUser-username").value,
       password: document.getElementById("newUser-password").value,
       user_bookshelf: Array[null]

    }
    
    await client.db("booksDB").collection("booksCL").insertOne(new_user_info);

    await client.close();



}