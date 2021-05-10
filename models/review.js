const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userReview: String,
  rating: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Review', reviewSchema);