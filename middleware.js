const {campgroundSchema, reviewSchema} = require('./schemas');
const ExpressError = require('./utils/express-error');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = function(req, res, next){
  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in!!');
    return res.redirect('/login');
  }
  next();
}

module.exports.validateCampground = function(req, res, next){
  const {err} = campgroundSchema.validate(req.body);
  if(err){
    const message = err.details.map(el => el.message).join('.');
    throw new ExpressError(message, 400);
  }else{
    next();
  }
}

module.exports.isOwner = async function(req, res, next){
  const {id} = req.params;
  const campground  = await Campground.findById(id);
  if (!campground.owner.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that');
    res.redirect(`/campgrounds/${id}`);
  }
  next();
}

module.exports.validateReview = function (req, res, next) {
  const {err} = reviewSchema.validate(req.body);
  if(err){
    const message = err.details.map(el => el.message).join(',');
    throw new ExpressError(message, 400);
  }else{
    next();
  }
}

module.exports.isReviewOwner = async function(req, res, next){
  const {id, reviewId} = req.params;
  const review  = await Review.findById(reviewId);
  if (!review.owner.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that');
    res.redirect(`/campgrounds/${id}`);
  }
  next();
}