const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async function(req,res){
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.owner = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Successfully created a new review');
  res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.deleteReview = async function(req, res){
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted a review');
  res.redirect(`/campgrounds/${id}`);
}