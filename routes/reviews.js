const express = require('express');
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewOwner} = require('../middleware');
const catchAsync = require('../utils/catch-async');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewOwner, catchAsync(reviews.deleteReview));

module.exports = router;