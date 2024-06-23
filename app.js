if (process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}
const express = require ('express');
const app = express ();
const path = require ('path');
const mongoose = require('mongoose');
const ejsMate = require ('ejs-mate');
const {campgroudSchema, reviewSchema} = require ('./schemas');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local'); 
const User = require('./models/user')

const campgroudRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// connect to mongodb and handle the connection error.
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').
    catch (error => handleError(error));

app.set ('view engine', 'ejs');
app.set ('views', path.join(__dirname, 'views'));

app.engine ('ejs', ejsMate)
app.use (express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisisatopsecret.',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session (sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.use('/campgrouds', campgroudRoutes);
app.use('/campgrouds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res)=>{
    res.render ('home')
})

app.all ('*', (req, res, next) =>{
    // next(new ExpressError('Page Not Found', 404)
    next(new ExpressError)
})

// below is the error handler, write how you want the error to be handled.
app.use ((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Something went wrong here'
	res.status(statusCode).render('error',{err})
})

// app.use((err, req, res, next) => {
//     const { statusCode = 500, message = "It won't work" } = err;
//     console.log(`BEFORE: statusCode=${err.statusCode}, message=${err.message}`);
//     if (!err.message) err.message = 'Oh No, Something Went Wrong!';
//     if (!err.statusCode) err.statusCode = 500;
//     console.log(`AFTER: statusCode=${err.statusCode}, message=${err.message}`);
//     res.status(statusCode).render('error', { err });
// })


app.listen(3000, () =>{
    console.log('Serving on port 3000')
})