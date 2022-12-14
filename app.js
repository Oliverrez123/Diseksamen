const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 2000;
const sqlite3 = require('sqlite3').verbose();
var crypto = require('crypto');
const connection = require('./db')
const taskName = require('./FrontDev/index')


const userDB = connection.query('CREATE TABLE if not exists user_table (user_id int NOT NULL AUTO_INCREMENT, username varchar(255), password varchar(255), PRIMARY KEY(user_id))')

const taskDB1 = connection.query('CREATE TABLE if not exists task_table (task_id int NOT NULL AUTO_INCREMENT, taskname varchar(255), process varchar(255), PRIMARY KEY(task_id))')
const taskDB = connection.query('CREATE TABLE if not exists task_table1 (task_id int NOT NULL AUTO_INCREMENT, taskname varchar(255), PRIMARY KEY(task_id))')
// Sqlite ting
//const db = new sqlite3.Database('./db.sqlite');

/*db.serialize(function() {
  console.log('creating databases if they don\'t exist');
  db.run('create table if not exists users (userId integer primary key, username text not null, password text not null)');
});*/
 

// Tilføjer user til db
const addUserToDatabase = (username, password) => {
  connection.query(
    'insert into user_table (username, password) values (?, ?)', 
    [username, password], 
    console.log(username + password),
    function(err) {
      if (err) {
        console.error(err);
      }
    }
  );
}

function saveTask(taskName){
  connection.query(
'insert into task_table1 (taskname) values (?)', 
[taskName], 
console.log(taskName),
function(err) {
if (err) {
  console.error(err);
}}
)}



const getUserByUsername = (username) => {
  // Smart måde at konvertere fra callback til promise:
  return new Promise((resolve, reject) => {  
    connection.query(
      'select * from user_table where userName=(?)',
      [username], 
      (err, rows) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        return resolve(rows);
      }
    );
  })
}

const md5sum = crypto.createHash('md5');
const salt = 'Some salt for the hash';

const hashPassword = (password) => {
  return md5sum.update(password + salt).digest('hex');
}



app.use(express.static(__dirname + '/FrontDev'))

app.use(
    session({
        secret: "Keep it secret",
        name: "uniqueSessionID",
        saveUninitialized: false,
    })
);

app.get("/", (req, res) => {
    if (req.session.loggedIn) {
        return res.sendFile("/index.html", { root: path.join(__dirname, "FrontDev")});
    } else {
        return res.sendFile("login.html", { root: path.join(__dirname, "FrontDev") });
    }
});












app.post("/authenticate", bodyParser.urlencoded(), async (req, res) => {
  
  
  // Opgave 1
  // Programmer så at brugeren kan logge ind med sit brugernavn og password

  // Henter vi brugeren ud fra databasen
  const user = await getUserByUsername(req.body.username)
  console.log({user});
  console.log({reqBody: req.body});

  if(user.length === 0) {
    console.log('no user found')
    return res.sendFile("login.html", { root: path.join(__dirname, "FrontDev") });
  }

  // Hint: Her skal vi tjekke om brugeren findes i databasen og om passwordet er korrekt
  if (user[0].password == hashPassword(req.body.password)) {
      req.session.loggedIn = true;
      req.session.username = req.body.username;
      console.log(req.session);
      res.sendFile("index.html", { root: path.join(__dirname, "FrontDev") });
  } else {
      // Sender en error 401 (unauthorized) til klienten
      return  res.sendStatus(401);
  }
});


app.get("/logout", (req, res) => {
  req.session.destroy((err) => {});
  return res.send("Thank you! Visit again");
});

app.post("/saveItem", bodyParser.urlencoded(), async (req, res) => {
  const task = await saveTask(req.body.taskName)
  console.log(task)
  })


app.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
      return res.redirect("/dashboard");
  } else {
      return res.sendFile("signup.html", { root: path.join(__dirname, "FrontDev") });
  }
});

app.post("/signup", bodyParser.urlencoded(), async (req, res) => {
  const user = await getUserByUsername(req.body.username)
  console.log(user)
  if (user.length > 0) {
    return res.send('Username already exists');
  }

  // Opgave 2
  // Brug funktionen hashPassword til at kryptere passwords (husk både at hash ved signup og login!)
  let hashedPassword = hashPassword(req.body.password)
  addUserToDatabase(req.body.username, hashedPassword);
  console.log(req.body.username, req.body.password)
  res.redirect('/');
})  
  



app.listen(port, () => {
  console.log("Website is running");
}); 