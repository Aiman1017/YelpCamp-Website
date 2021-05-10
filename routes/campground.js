const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const {isLoggedIn, isOwner, validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

const Campground = require('../models/campground');

router.get('/newform', campgrounds.newForm);

router.route('/:id')
      .get(catchAsync(campgrounds.showCampground))
      .put(isLoggedIn, isOwner, upload.array('image'), validateCampground, catchAsync(campgrounds.updatingCampground))
      .delete(isLoggedIn, isOwner, catchAsync(campgrounds.deleteCampground));

router.get('/', catchAsync(campgrounds.index));

router.post('/', isLoggedIn, upload.array('image'), validateCampground, 
            catchAsync(campgrounds.createCampground));

router.get('/:id/edit', isOwner, 
            catchAsync(campgrounds.editPage));

module.exports = router;