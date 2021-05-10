const User = require('../models/user');

module.exports.renderRegister =function (req,res) {
  res.render('users/register');
}

module.exports.registerUser = async function(req, res){
  try{
    const {email, username, password} = req.body;
    const user = new User({ 
      email, 
      username
    });
    const newUser = await User.register(user, password);

    req.login(newUser, function(err){
      if(err) return next(err);
      req.flash('success', 'Welcome to YelpCamp');
      res.redirect('/campgrounds');
    });
  }catch(e){
    req.flash('error', e.message);
    return res.redirect('/register')
  }
}

module.exports.renderLogin = function(req, res){
  res.render('users/login');
}

module.exports.loginUser = function(req, res){
  req.flash('success', 'Welcome back!!!');
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  return res.redirect(redirectUrl);
}

module.exports.logout = function(req, res){
  req.logout();
  req.flash('success', 'You have successfully logout');
  res.redirect('/campgrounds');
}