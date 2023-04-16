const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
  
  });

exports.register = (req, res) => {
    console.log(req.body);

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const phonenumber = req.body.phonenumber;
    const email = req.body.email;
    const address = req.body.address;
    const password = req.body.password;
    const passwordconfirm = req.body.passwordconfirm;
    const usertype = req.body.usertype;
    
    db.query('SELECT email FROM users where email = ?' , [email], (error,results) =>{
        if(error) {
            console.log(error);  
        }
        if( resultslength > 0){
            return res.render('register',{
                message: 'That email is already in use'

            })
        } else if( password !== passwordconfirm) {
            return res.render('render',{
                message: 'Password do not match'
            });
        }
    })
 
    res.send("from shubmitted");
}