const express = require("express");
const authController = require('../controllers/auth')
const router = express.Router();

router.get('/',(req,res) => {
    res.render('index');

});


router.get('/register',(req,res) => {
    res.render("register");

});


router.get('/login',(req,res) => {
    res.render("login");

});

router.get('/profile',authController.isLoggedIn,(req,res) => {

    if(req.user) {
      res.render('profile',{
        user: req.user
      });

    } else {
        res.redirect('/login');
    }
});

router.get('/editprofile',(req,res) => {
    res.render("editprofile");

});

router.get('/changepassword',(req,res) => {
    res.render("changepassword");

});


router.get('/orderhistory',(req,res) => {
    res.render("orderhistory");

});

router.get('/removeaccount',(req,res) => {
    res.render("removeaccount");

});

module.exports = router;