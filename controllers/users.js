const User = require('../models/user');

// render the register format, let use to register
module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
};
// register user's information with the database
module.exports.register = async (req, res, next) =>{
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
    };
// a form allow user to enter the information to login
module.exports.renderLogin = (req, res)=>{
        res.render('users/login')
    }
// actually login users
module.exports.login = (req, res)=>{
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo ||'/campgrouds';
        // delete req.session.returnTo;
        res.redirect(redirectUrl);
    };
// the logout routes, with passport, req.logout with a callback function;
module.exports.logout = (req, res, next)=>{
        req.logout(function(err){
            if (err){
                return next(err);
            }
            req.flash('success', 'Goodbye!');
            res.redirect('/campgrouds');
        })};