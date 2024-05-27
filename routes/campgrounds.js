const express = require ('express');
const router = express.Router();
const catchAsync = require ('../utils/catchAsync');
const {isLoggedIn, validateCampgroud, isAuthor} = require('../middleware');

const Campgroud = require ('../models/campground');


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
    const campgrouds = await Campgroud.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
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
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res)=>{
    const campgrouds = await Campgroud.findById(req.params.id);
    if(!campgrouds){
        req.flash('error', 'Cannot find this Campground.');
        return res.redirect ('/campgrouds/')
    }

    // Add the logic to check if the author is same as req.user._id. If not, protect the route with req.flash and res.redirect;
    // move the below function to a middleware called isAuthor.
    // if (!campgrouds.author.equals(req.user._id)){
    //     req.flash ('error', 'You do not have permission to edit this campground.');
    //     return res.redirect(`/campgrouds/${campgrouds._id}`)
    // }
    res.render('campgrouds/edit', {campgrouds})
  
}))
//Step 2:Update the value with a PUT request and then redirect to a new page
router.put('/:id/', isLoggedIn, isAuthor, validateCampgroud, catchAsync(async (req, res) =>{
    const {id} = req.params;
    // to protect the edit routes, add logic we find the campground at first, then check if the author is the same as the currentUser. if yes, allow editing. using a middleware called isAuthor. 
   
    const campgrouds = await Campgroud.findByIdAndUpdate (id, {...req.body.campgroud});
    req.flash('success','Successfully updated a campground!');
    res.redirect(`/campgrouds/${campgrouds._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) =>{
    const {id} = req.params;
    await Campgroud.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a campground!');
    res.redirect('/campgrouds');
}))

module.exports = router; 