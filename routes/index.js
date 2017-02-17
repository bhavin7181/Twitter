var login = require("./login");
/*
 * GET home page.
 */

exports.index = function(req, res){
	
 if(req.session.username)
{
	 login.redirectToHomepage(req,res);
}
 else
	 res.render('template', { title: 'Twitter',path : '../views/beforeLogin/signIn' });
};