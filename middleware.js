
const Campgroud = require ('./models/campground');
const Review = require ('./models/review');
const {campgroudSchema, reviewSchema} = require ('./schemas');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(req.user);
if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in.');
    return res.redirect('/login');
}
next();
}

module.exports.storeReturnTo = (req, res, next) =>{
    if (req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampgroud = (req, res, next) =>{
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

module.exports.isAuthor = async (req, res, next)=>{
    const {id} = req.params;
    const campgrouds = await Campgroud.findById(id);
    if (!campgrouds.author.equals(req.user._id)){
        req.flash ('error', 'You do not have permission to edit this campground.');
        return res.redirect(`/campgrouds/${campgrouds._id}`)
    }
    next();
}


module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next)=>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)){
        req.flash ('error', 'You do not have permission to delete this review.');
        return res.redirect(`/campgrouds/${id}`)
    }
    next();
}