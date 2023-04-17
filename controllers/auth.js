const mysql = require('mysql2');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs'); 
const { query } = require('express');

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
    
    // total number of users
    db.query('SELECT COUNT(*) as totalUsers FROM users', function (error, results, fields) {
        if (error) throw error;
        const totalUsers = results[0].totalUsers;
        const newUserId = totalUsers + 1;
        console.log('Total number of users:', totalUsers);
        console.log('New user ID:', newUserId);
        
        db.query('SELECT email FROM users where email = ?' , [email], async (error,results) =>{
            if(error) {
                console.log(error);  
            }
            if( results.length > 0){
                return res.render('register',{
                    message: 'That email is already in use'
                })
            } else if( password !== passwordconfirm) {
                return res.render('register',{
                    message: 'Password do not match'
                });
            }

            let hashedPassword = await bcrypt.hash(password, 4);
            console.log( hashedPassword);

            db.query('INSERT INTO users SET ?', { 
                userid: newUserId, 
                firstname: firstname, 
                lastname: lastname,
                phonenumber: phonenumber,
                email:email,
                address:address,
                password: hashedPassword,
                usertype: usertype
            }, (error,results) => {
                if(error) {
                    console.log(error);
                } else {
                    console.log(results);
                    return res.render('register',{
                        message: 'User registered' 
                    });
                }
            });
        });
    });
};
