const express = require ('express');
const router = express.Router({mergeParams: true});
const catchAsync = require ('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require ('../schemas');
const Campgroud = require ('../models/campground');
const Review = require ('../models/review');

const validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res) => {
    const {id} = req.params;
    const campgroud = await Campgroud.findById(id);
    const review = new Review(req.body.review);
    campgroud.reviews.push(review);
    await review.save();
    await campgroud.save();
    req.flash('success','Successfully created a new review!');
    res.redirect(`/campgrouds/${campgroud._id}`);

}))

router.delete('/:reviewId', catchAsync(async(req, res) =>{
    const {id, reviewId} = req.params;
    const campgroud = await Campgroud.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted a review!');
    res.redirect(`/campgrouds/${campgroud._id}`);
}))

module.exports = router;