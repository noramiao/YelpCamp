const express = require ('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require ('../utils/catchAsync');
const {isLoggedIn, validateCampgroud, isAuthor} = require('../middleware');

const Campgroud = require ('../models/campground');


router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampgroud, catchAsync(campgrounds.createCampground));

router.get('/:id', catchAsync(campgrounds.showCampground));

//EDIT function need 2 steps, one create get request and render a edit form. 
//Two, create a put request and render the edit form, redirect to a new page
//Step1:
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
//Step 2:Update the value with a PUT request and then redirect to a new page
router.put('/:id/', isLoggedIn, isAuthor, validateCampgroud, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router; 