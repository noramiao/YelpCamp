const express = require ('express');
const router = express.Router({mergeParams: true});
const catchAsync = require ('../utils/catchAsync');
const Campgroud = require ('../models/campground');
const Review = require ('../models/review');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const {id} = req.params;
    const campgroud = await Campgroud.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campgroud.reviews.push(review);
    await review.save();
    await campgroud.save();
    req.flash('success','Successfully created a new review!');
    res.redirect(`/campgrouds/${campgroud._id}`);

}))

router.delete('/:reviewId', isLoggedIn,isReviewAuthor, catchAsync(async(req, res) =>{
    
    const {id, reviewId} = req.params;
    const campgroud = await Campgroud.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted a review!');
    res.redirect(`/campgrouds/${campgroud._id}`);
}))

module.exports = router;