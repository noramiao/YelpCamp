const express = require ('express');
const app = express ();
const path = require ('path');
const mongoose = require('mongoose');
const ejsMate = require ('ejs-mate');
const {campgroudSchema} = require ('./schemas');
const catchAsync = require ('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campgroud = require ('./models/campground');
const Review = require ('./models/review');

// connect to mongodb and handle the connection error.
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').
    catch (error => handleError(error));

app.set ('view engine', 'ejs');
app.set ('views', path.join(__dirname, 'views'));

app.engine ('ejs', ejsMate)
app.use (express.urlencoded({extended: true}))
app.use(methodOverride('_method'));

const validateCampgroud = (req, res, next) =>{
    // Step 1: define the validation schema: https://joi.dev/api/?v=17.13.0
    
    // const result =camgroudSchema.validate(req.body);
    // console.log(result);
    // console.log(result.error);

    // Step 2: passthrough data to validate
    const {error} = campgroudSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

app.get('/', (req, res)=>{
    res.render ('home')
})

app.get('/campgrouds', catchAsync(async (req, res)=>{
    const campgrouds = await Campgroud.find({});
    res.render('campgrouds/index', {campgrouds})
  
}))

app.get('/campgrouds/new', (req, res)=>{
    res.render('campgrouds/new')
})

app.post('/campgrouds', validateCampgroud, catchAsync(async (req, res)=>{

    
    const campgroud = new Campgroud(req.body.campgroud);
    await campgroud.save();
    res.redirect (`/campgrouds/${campgroud._id}`)

}))

app.get('/campgrouds/:id', catchAsync(async (req, res)=>{
    const campgrouds = await Campgroud.findById(req.params.id);
    res.render('campgrouds/show', {campgrouds})
  
}))

//EDIT function need 2 steps, one create get request and render a edit form. 
//Two, create a put request and render the edit form, redirect to a new page
//Step1:
app.get('/campgrouds/:id/edit', catchAsync(async (req, res)=>{
    const campgrouds = await Campgroud.findById(req.params.id);
    res.render('campgrouds/edit', {campgrouds})
  
}))
//Step 2:Update the value with a PUT request and then redirect to a new page
app.put('/campgrouds/:id/', validateCampgroud, catchAsync(async (req, res) =>{
    const {id} = req.params;
    const campgrouds = await Campgroud.findByIdAndUpdate (id, {...req.body.campgroud});
    res.redirect(`/campgrouds/${campgrouds._id}`)
}))

app.delete('/campgrouds/:id', catchAsync(async(req, res) =>{
    const {id} = req.params;
    await Campgroud.findByIdAndDelete(id);
    res.redirect('/campgrouds');
}))

app.post('/campgrouds/:id/reviews', catchAsync(async(req, res) => {
    const {id} = req.params;
    const campgroud = await Campgroud.findById(id);
    const review = new Review(req.body.review);
    campgroud.reviews.push(review);
    await review.save();
    await campgroud.save();
    res.redirect(`/campgrouds/${campgroud._id}`);

}))

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