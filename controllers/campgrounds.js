const Campground = require('../models/campground');
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeoCoding({accessToken: mapBoxToken});
const {cloudinary} = require('../cloudinary');

module.exports.index = async function(req, res){
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds});
}

module.exports.newForm = function(req,res){
  res.render('campgrounds/newForm');
}

module.exports.createCampground = async function(req,res){
  const geoData = await geoCoder.forwardGeocode({
    query: req.body.campground.location,
  }).send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  campground.owner = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash('success', 'Successfully made a new campground');
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async function(req,res){
  const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'owner'
    }
  }).populate('owner');
  if(!campground){
    req.flash('error', 'Cannot find that campground.');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', {campground});
}

module.exports.editPage = async function(req,res){
  const {id} = req.params;
  const campground = await Campground.findById(id);
  if(!campground){
    req.flash('error', 'Cannot find that campground.');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', {campground});
}

module.exports.updatingCampground = async function(req,res){ 
  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  const images = req.files.map(f => ({url: f.path, filename: f.filename}))
  campground.images.push(...images);
  await campground.save();
  
  if(req.body.deleteImages){
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
  }

  req.flash('success', 'Successfully updated campground');
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async function(req,res){
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a campground');
  res.redirect('/campgrounds');
}