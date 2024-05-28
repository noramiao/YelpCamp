const Campgroud = require ('../models/campground');
const Review = require ('../models/review');

module.exports.createReview = async(req, res) => {
    const {id} = req.params;
    const campgroud = await Campgroud.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campgroud.reviews.push(review);
    await review.save();
    await campgroud.save();
    req.flash('success','Successfully created a new review!');
    res.redirect(`/campgrouds/${campgroud._id}`)};

module.exports.deleteReview = async(req, res) =>{
    
    const {id, reviewId} = req.params;
    const campgroud = await Campgroud.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted a review!');
    res.redirect(`/campgrouds/${campgroud._id}`)};