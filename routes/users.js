const express = require ('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');

// render the register format, let use to register
router.get('/register', (req,res)=>{
    res.render('users/register')
})

// register user's information with the database
router.post('/register', catchAsync(async (req, res, next) =>{
try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register (user, password);
    req.login(registeredUser, err =>{
        if (err){
            return next(err);
        }else{
            req.flash ('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrouds')
        }
    })
}catch(e){
    req.flash('error', e.message);
    res.redirect('register');
}
}));

// a form allow user to enter the information to login
router.get('/login', (req, res)=>{
    res.render('users/login')
})


// actually login users
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), (req, res)=>{
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo ||'/campgrouds';
    // delete req.session.returnTo;
    res.redirect(redirectUrl);
})

// the logout routes, with passport, req.logout with a callback function;
router.get('/logout', (req, res, next)=>{
    req.logout(function(err){
        if (err){
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrouds');
    });
})

module.exports = router;

