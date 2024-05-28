const express = require ('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require ('../utils/catchAsync');
const {isLoggedIn, validateCampgroud, isAuthor} = require('../middleware');

const Campgroud = require ('../models/campground');

router.route('/')
    .get( catchAsync(campgrounds.index))
    .post( isLoggedIn, validateCampgroud, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route ('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put( isLoggedIn, isAuthor, validateCampgroud, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router; 