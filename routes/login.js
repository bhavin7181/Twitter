var ejs = require("ejs");
var util = require("./server-utility");
var Bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;
var soap = require('soap');
var baseURL = "http://localhost:8080/Twitter-SOAP-Service/services";

exports.showSignUpPage = function(req, res){
  res.render('template', {title: 'Twitter',path : '../views/beforeLogin/signUp'});
};

exports.showSignInPage = function(req,res){
};
res.render('template',{ title: 'Twitter',path : '../views/beforeLogin/signIn' })

/**
 * Routes file for Login
 */

//Check login - called when '/checklogin' POST call given from AngularJS module in login.ejs
exports.login = function(req,res)
{
	var username, password;
	username = req.param("username");
	password = req.param("password");
	console.log(username);
	var json_responses;
	
if(username!== ''  && password!== '')
{
	/*var hashed_password = util.generateHashForPassword(password);
	console.log("hashed password: "+hashed_password);
	var queryString="select user_name,password,full_name,DATE_FORMAT(created_dt, '%m/%d/%Y') created_dt from users where user_name= "+
	"'"+username+"'";
	console.log("Query is:"+queryString);*/
	
	var option = {
			ignoredNamespaces : true	
		};
	 var url = baseURL+"/Login?wsdl";
	  var args = {username: req.param('username')};
	  soap.createClient(url,option, function(err, client) {
	      client.login(args, function(err, result) {
	    	  
	    	  if(err || result==null || typeof result=='undefined')
    		{
	    		  console.log("Invalid login or password.");
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
    		}
	    	else
    		{
	    	  var arr = result.loginReturn.split("~~~~");
	    	  console.log("dbpassword "+result.loginReturn+"arr "+arr);
    		  var dbPassword = arr[0];
    		  Bcrypt.compare(password, dbPassword, function(err, result) {
					if(err)
					{
						console.log("Error in Bcrypt compare");
						json_responses = {"statusCode" : 400};
						res.send(json_responses);
					}
					else
					{
						if(result==true)
						{
							req.session.username = username;
							req.session.count=0;
							req.session.full_name = arr[1];
							console.log("test "+arr[1]);
							console.log("Session initialized");
							json_responses = {"statusCode" : 200,"session":req.session};
							res.send(json_responses);
						}
						else
						{
							console.log("Invalid login or password.");
							json_responses = {"statusCode" : 400};
							res.send(json_responses);
						}
					}
				});
    		}
	    	  
	    	  
	      });
	  });
	}
	/*mysql.executeQuery(function(err,results){
		if(err){
			console.log(err.message);
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
		else
		{
			if(results.length==0)
			{
				console.log("Invalid login or password.");
				json_responses = {"statusCode" : 400};
				res.send(json_responses);
			}
			else
			{
				Bcrypt.compare(password, results[0].password, function(err, result) {
					if(err)
					{
						console.log("Error in Bcrypt compare");
						json_responses = {"statusCode" : 400};
						res.send(json_responses);
					}
					else
					{
						if(result==true)
						{
							req.session.username = username;
							req.session.count=0;
							req.session.full_name = results[0].full_name;
							console.log("test "+results[0].full_name);
							console.log("Session initialized");
							json_responses = {"statusCode" : 200,"session":req.session};
							res.send(json_responses);
						}
						else
						{
							console.log("Invalid login or password.");
							json_responses = {"statusCode" : 400};
							res.send(json_responses);
						}
					}
				});
			}
		  }
		},queryString);
	}*/
	else
	{
		json_responses = {"statusCode" : 401};
		res.send(json_responses);
	}
}


//Redirects to the homepage
exports.redirectToHomepage = function(req,res)
{
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('template',{ title: 'Twitter',path : '../views/afterLogin/home',session1:req.session,username:req.session.username});
	}
	else
	{
		res.redirect('/twitter');
	}
};


//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/twitter');
};
