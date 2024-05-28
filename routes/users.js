const express = require ('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const users = require('../controllers/users');

// render the register format, let use to register
router.get('/register', users.renderRegister);

// register user's information with the database
router.post('/register', catchAsync(users.register));

// a form allow user to enter the information to login
router.get('/login', users.renderLogin);


// actually login users
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), users.login);

// the logout routes, with passport, req.logout with a callback function;
router.get('/logout', users.logout);

module.exports = router;

