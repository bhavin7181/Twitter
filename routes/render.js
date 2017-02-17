exports.showSignUpPage = function(req, res){
  res.render('template', {title: 'Twitter',path : '../views/beforeLogin/signUp'});
};

exports.showSignInPage = function(req,res){
	res.render('template',{ title: 'Twitter',path : '../views/beforeLogin/signIn' })
};