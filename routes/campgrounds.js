const express = require ('express');
const router = express.Router();
const catchAsync = require ('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroudSchema} = require ('../schemas');
const isLoggedIn = require('../middleware');

const Campgroud = require ('../models/campground');


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

router.get('/', catchAsync(async (req, res)=>{
    const campgrouds = await Campgroud.find({});
    res.render('campgrouds/index', {campgrouds})
  
}))

router.get('/new', isLoggedIn, (req, res)=>{
    res.render('campgrouds/new')
})

router.post('/', isLoggedIn, validateCampgroud, catchAsync(async (req, res)=>{
    const campgroud = new Campgroud(req.body.campgroud);
    campgroud.author = req.user._id;
    await campgroud.save();
    req.flash('success','Successfully made a new campground!');
    res.redirect (`/campgrouds/${campgroud._id}`)

}))

router.get('/:id', catchAsync(async (req, res)=>{
    const campgrouds = await Campgroud.findById(req.params.id).populate('reviews').populate('author');
    // console.log(campgrouds);
    if(!campgrouds){
        req.flash('error', 'Cannot find this Campground.');
        return res.redirect ('/campgrouds/')
    }
    res.render('campgrouds/show', {campgrouds})
  
}))

//EDIT function need 2 steps, one create get request and render a edit form. 
//Two, create a put request and render the edit form, redirect to a new page
//Step1:
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res)=>{
    const campgrouds = await Campgroud.findById(req.params.id);
    if(!campgrouds){
        req.flash('error', 'Cannot find this Campground.');
        return res.redirect ('/campgrouds/')
    }
    res.render('campgrouds/edit', {campgrouds})
  
}))
//Step 2:Update the value with a PUT request and then redirect to a new page
router.put('/:id/', isLoggedIn, validateCampgroud, catchAsync(async (req, res) =>{
    const {id} = req.params;
    const campgrouds = await Campgroud.findByIdAndUpdate (id, {...req.body.campgroud});
    req.flash('success','Successfully updated a campground!');
    res.redirect(`/campgrouds/${campgrouds._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async(req, res) =>{
    const {id} = req.params;
    await Campgroud.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a campground!');
    res.redirect('/campgrouds');
}))

module.exports = router; 