const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
//const port = 2000;
var crypto = require('crypto');
const connection = require('./db')
const opgaveNavn = require('./FrontDev/index')


const userDB = connection.query('CREATE TABLE if not exists user_table (user_id int NOT NULL AUTO_INCREMENT, username varchar(255), password varchar(255), PRIMARY KEY(user_id))')

const taskDB1 = connection.query('CREATE TABLE if not exists task_table (task_id int NOT NULL AUTO_INCREMENT, opgaveNavn varchar(255), process varchar(255), PRIMARY KEY(task_id))')
const taskDB = connection.query('CREATE TABLE if not exists task_table1 (task_id int NOT NULL AUTO_INCREMENT, opgaveNavn varchar(255), PRIMARY KEY(task_id))')
// Sqlite ting
//const db = new sqlite3.Database('./db.sqlite');

/*db.serialize(function() {
  console.log('creating databases if they don\'t exist');
  db.run('create table if not exists users (userId integer primary key, username text not null, password text not null)');
});*/
 

// Tilføjer user til db
const gemBrugerDB = (username, password) => {
  connection.query(
    'insert into user_table (username, password) values (?, ?)', [username, password], 
    console.log(username + password),
    function(err){
      if (err){
        console.error(err);
      } });}

function gemOpg(opgaveNavn){
  connection.query(
'insert into task_table1 (opgaveNavn) values (?)', 
[opgaveNavn], 
console.log(opgaveNavn),
function(err) {
if (err) {
  console.error(err);
}}
)}



const findBruger = (username) => {
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
        return resolve(rows);} );})
}

const md5sum = crypto.createHash('md5');
const salt = 'Some salt for the hash';

const hPW = (password) => {
  return md5sum.update(password + salt).digest('hex');
}
app.use(express.static(__dirname + '/FrontDev'))

app.use(
    session({
        secret: "hold det hemmeligt",
        name: "uniqueSessionID",
        saveUninitialized: false,
        resave: false
  })
);

app.get("/", (req, res) => {
    if (req.session.loggedIn) {
        return res.sendFile("/index.html", { root: path.join(__dirname, "FrontDev")});
    } else {
        return res.sendFile("login.html", { root: path.join(__dirname, "FrontDev") });
    }});












app.post("/true", bodyParser.urlencoded({extended: true}), async (req, res) => {
  
  
  // Opgave 1
  // Programmer så at brugeren kan logge ind med sit brugernavn og password

  // Henter vi brugeren ud fra databasen
  const user = await findBruger(req.body.username)
  console.log({user});
  console.log({reqBody: req.body});

  if(user.length === 0) {
    console.log('no user found')
    return res.sendFile("login.html",   { root: path.join(__dirname, "FrontDev") });
  }

  // Hint: Her skal vi tjekke om brugeren findes i databasen og om passwordet er korrekt
  if (user[0].password == hPW(req.body.password)) {
      req.session.loggedIn = true;
      req.session.username = req.body.username;
      console.log(req.session);
      res.sendFile("index.html", { root: path.join(__dirname, "FrontDev") });} else {
      // Sender en error 401 (unauthorized) til klienten
      return  res.sendStatus(401);
  }});



app.post("/saveItem", bodyParser.urlencoded({extended: true}), async (req, res) => {
  const task = await gemOpg(req.body.opgaveNavn)
  console.log(task) })


app.get("/register", (req, res) => {
  if (req.session.loggedIn) {
      return res.redirect("/brugerflade");
  } else {
      return res.sendFile("register.html", { root: path.join(__dirname, "FrontDev") });
  }});

app.post("/register", bodyParser.urlencoded({extended: true}), async (req, res) => {
  const user = await findBruger(req.body.username)
  console.log(user)
  if (user.length > 0) {
    return res.send("bruger eksisterer allerede"); }

  // Opgave 2
  // Brug funktionen hPW til at kryptere passwords (husk både at hash ved register og login!)
  let hashedPassword = hPW(req.body.password)
  gemBrugerDB(req.body.username, hashedPassword);
  console.log(req.body.username, req.body.password)
  res.redirect('/');
})  
  

const PORT = process.env.PORT || 2000;
app.listen(PORT);
console.log(`Op og køre på port ${PORT}`);