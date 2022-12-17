
//Henter node moduler
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
var crypto = require('crypto');
const connection = require('./db')
const opgaveNavn = require('./FrontDev/index')


//Laver tabeller til DB, med tilhørende
const userDB = connection.query('CREATE TABLE if not exists user_table (user_id int NOT NULL AUTO_INCREMENT, username varchar(255), password varchar(255), PRIMARY KEY(user_id))')

const taskDB1 = connection.query('CREATE TABLE if not exists task_table (task_id int NOT NULL AUTO_INCREMENT, opgaveNavn varchar(255), process varchar(255), PRIMARY KEY(task_id))')
const taskDB = connection.query('CREATE TABLE if not exists task_table1 (task_id int NOT NULL AUTO_INCREMENT, opgaveNavn varchar(255), PRIMARY KEY(task_id))')

// Tilføjer brugeren til database, med username og PW
const gemBrugerDB = (username, password) => {
  connection.query(
    'insert into user_table (username, password) values (?, ?)', [username, password], 
    console.log(username + password),
    function(err){
      if (err){
        console.error(err);
      } });}
//Funktion til DB, så opgaver kan gemmes
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
  return new Promise((resolve, reject) => {  
    connection.query(
      'select * from user_table where userName=(?)',
      [username], 
      (err, rows) => {
        if (err) {
          console.error(err);
          return reject(err);}
        return resolve(rows);} );})}

const md5sum = crypto.createHash('md5');
const salt = 'Skal du saltes?';

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
//Opretter default endpoint. Hvis bruger er logget ind bliver de redirectet til brugerflade, ellers tilbage til login
app.get("/", (req, res) => {
    if (req.session.loggedIn) {
        return res.sendFile("/index.html", { root: path.join(__dirname, "FrontDev")});
    } else {
        return res.sendFile("login.html", { root: path.join(__dirname, "FrontDev") });
    }});



app.post("/true", bodyParser.urlencoded({extended: true}), async (req, res) => {
  
  

  // Finder bruger fra DB 
  const user = await findBruger(req.body.username)
  console.log({user});
  console.log({reqBody: req.body});
//Redirecter brugeren til login.html hvis brugeren ikke logger ind med gyldig konto
  if(user.length === 0) {
    console.log('no user found')
    return res.sendFile("login.html",   { root: path.join(__dirname, "FrontDev") });
  }

  // Tjekker hvorledes bruger er i database samt om inputs er korrekte
  if (user[0].password == hPW(req.body.password)) {
      req.session.loggedIn = true;
      req.session.username = req.body.username;
      console.log(req.session);

      res.sendFile("index.html", { root: path.join(__dirname, "FrontDev") });} else {
        return  res.sendStatus(401);
  }});


//laver diverse endpoints
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

 
  //Krypterer password fra bruger
  let hashedPassword = hPW(req.body.password)
  gemBrugerDB(req.body.username, hashedPassword);
  console.log(req.body.username, req.body.password)
  res.redirect('/');
})  
  

const PORT = process.env.PORT || 2000;
app.listen(PORT);
console.log(`Op og køre på port ${PORT}`);