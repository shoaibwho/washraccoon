const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const { query } = require('express');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('login', {
        message:'Please provide an email and password'
      })
    }

    db.query("SELECT * from users WHERE email =?", [email], async (error, results) => {
      console.log(results);
      if (!results || !(await bcrypt.compare(password,results[0].password))) {
         res.status(401).render("login",{
            message:"Email or Password is incorrect"
         })
        }else {
          const id = results[0].id;
          const token = jwt.sign({ id: id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

          console.log("The token is: "+ token);

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 *60 *1000
            ),
            httpOnly: true
          }

          res.cookie("jwt",token, cookieOptions);
          res.status(200).redirect("/");
      }
    })
  } catch (error) {
    console.log(error);
  }
};

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

    db.query('SELECT email FROM users where email = ?', [email], async (error, results) => {
      if (error) {
        console.log(error);  
      }
      if (results.length > 0) {
        return res.render('register',{
          message: 'That email is already in use'
        })
      } else if (password !== passwordconfirm) {
        return res.render('register',{
          message: 'Passwords do not match'
        });
      }

      db.query('INSERT INTO users SET ?', { 
        userid: newUserId, 
        firstname: firstname, 
        lastname: lastname,
        phonenumber: phonenumber,
        email: email,
        address: address,
        password: password,
        usertype: usertype
      }, (error, results) => {
        if (error) {
          console.log(error);
        } else {
          console.log(results);
          return res.render('register',{
            message: 'User registered' 
          });
  
       }
    })
  });
});
  


exports.isLoggedIn = async (req, res, next) => {
  // console.log(req.cookies);
  if( req.cookies.jwt) {
    try {
      //1) verify the token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,
      process.env.JWT_SECRET
      );

      console.log(decoded);

      //2) Check if the user still exists
      db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
        console.log(result);

        if(!result) {
          return next();
        }

        req.user = result[0];
        console.log("user is")
        console.log(req.user);
        return next();

      });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
}

exports.logout = async (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2*1000),
    httpOnly: true
  });

  res.status(200).redirect('/');
}

// rest of the code above
if (error) {
  return res.status(400).json({
    message: 'User not found'
  });
}
// if user is found but password is wrong
if (!user.validPassword(password)) {
  return res.status(400).json({
    message: 'Incorrect password'
  });
}
// all good, return token
return res.json({
  token: jwt.sign({
    email: user.email,
    _id: user._id
  }, 'SECRET')
});
}
