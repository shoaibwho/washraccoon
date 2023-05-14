const express = require("express");
const path = require("path");
const mysql = require('mysql2');
const cookieParser = require('cookie-parser');

// using dotenv to secure mysql user and password
const dotenv = require("dotenv");
dotenv.config({ path: './.env'});


//const mysql = require("mysql")
const app = express();

//creating mysql cannections
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE

});


// for static file like image,css and javascript files
const publicDirectory = path.join(__dirname,'./public' );
app.use(express.static(publicDirectory));

// parse URL-encoded bodies (as sent by html forms)
app.use(express.urlencoded({ extended: false}));

// Parse JSON bodies (as sent by API clints)
app.use(express.json());
app.use(cookieParser());

// Set the view engine to EJS
app.set("view engine", "hbs");

// Checking if mysql is connected or not
db.connect((err) => {
      if (err) {
        console.log("Error connecting to MySQL database:", err)
    } else {
        console.log("Connected to MySQL database")
    }
});



// Define  routes
app.use('/',require('./routes/pages'));
app.use('/auth' ,require('./routes/auth'));
// Start the server
app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
