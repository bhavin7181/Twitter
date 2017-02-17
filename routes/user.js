var ejs = require("ejs");
var util = require("./server-utility");
var Bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;
var soap = require('soap');
var baseURL = "http://localhost:8080/Twitter-SOAP-Service/services";
var url = baseURL+"/User?wsdl";

exports.getTweetCount = function(req,res)
{
	if(req.session.username)
	{
		var username = req.param("username");
		console.log("getTweetCount "+username);
		var json_responses;
		
		if(username!== '')
		{
			var tweets;
			var option = {
				ignoredNamespaces : true	
			};
			var args = {username: username};
			  soap.createClient(url,option, function(err, client) {
			      client.getTweetCount(args, function(err, result) {
				if(err){}
				else
				{
					console.log("tweets "+ result.getTweetCountReturn);
					res.send({count:result.getTweetCountReturn});
				}
			    });
			  });
		}
	}
	else
	{
		res.redirect('/twitter');
	}
}

exports.getFollowingCount = function(req,res)
{
	if(req.session.username)
	{
		var username = req.param("username");
		console.log("getFollowingCount "+username);
		var json_responses;
		
		if(username!== '')
		{
			var tweets;
			var option = {
				ignoredNamespaces : true	
			};
			var args = {username: username};
			  soap.createClient(url,option, function(err, client) {
			      client.getFollowingCount(args, function(err, result) {
				if(err){}
				else
				{
					res.send({count:result.getFollowingCountReturn});
				}
			    });
			  });
		}
	}
	else
	{
		res.redirect('/twitter');
	}
}

exports.getFollowerCount = function(req,res)
{
	if(req.session.username)
	{
		var username = req.param("username");
		var json_responses;
		
		if(username!== '')
		{
			var tweets;
			var option = {
				ignoredNamespaces : true	
			};
			var args = {username: username};
			  soap.createClient(url,option, function(err, client) {
			      client.getFollowerCount(args, function(err, result) 
			   {
			    	  res.send({count:result.getFollowerCountReturn});
			});
			 });
		}
	}
	else
	{
		res.redirect('/twitter');
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
		res.render('template',{ title: 'Twitter',path : '../views/afterLogin/home',username:req.session.username })
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

exports.getUserPage=function(req,res)
{
	if(util.validateSession(req, res)==true)
	{
		var username1 = req.param('username');
		var reqClick = req.param('clicked'); 
		var clicked =  typeof reqClick == "undefined" || reqClick == '' ?"tweets":reqClick;
		if(username1!=req.session.username)
		{
			var option = {
			ignoredNamespaces : true	
			};
			var args = {username: username};
			soap.createClient(url,option, function(err, client) {
		      client.getUserPage(args, function(err, result) 
				{
				if(err)
				{
					console.log("Error occurred while posting :"+err);
					res.send("Error occurred while loading page. Please try again.");
				}
				else
				{
					res.render('template',{ title: 'Twitter',path : '../views/afterLogin/user_home',"full_name":result.getUserPageReturn,session1:req.session,username:username1,"clicked":clicked})
				}
			});
			});
		}
		else
		{
			res.render('template',{ title: 'Twitter',path : '../views/afterLogin/user_home',"full_name":req.session.full_name,session1:req.session,username:username1,"clicked":clicked});
		}
	}
};

exports.loadPersonalInfo=function (req,res)
{
	if(util.validateSession(req, res)==true)
	{
		var username = req.param("username");
		var json_responses;
		var myTweets;
		var option = {
		ignoredNamespaces : true	
		};
		var args = {username: username};
		soap.createClient(url,option, function(err, client) {
	      client.loadPersonalInfo(args, function(err, result) 
		{
			if(err)
			{
				console.log("Error occurred while posting :"+err);
				res.send("Error occurred while loading page. Please try again.");
			}
			else
			{
				console.log("info:"+result.loadPersonalInfoReturn);
				var arr = new Array();
				arr.push(JSON.parse(result.loadPersonalInfoReturn));
				res.send(arr);
			}
		});
		});
	}
}

function getJSONObjArray(result)
{
	var res = result.split("~~~~");
	var arr = new Array();
	for(var i=0;i<res.length;i++)
	{
		arr.push(JSON.parse(res[i]));
	}
	return arr;
}

exports.loadFollowers=function (req,res)
{
	if(util.validateSession(req, res)==true)
	{
		var username = req.param("username");
		var json_responses;
		var myTweets;
		var option = {
		ignoredNamespaces : true	
		};
		var args = {username: username};
		soap.createClient(url,option, function(err, client) {
	      client.loadFollowers(args, function(err, results2) 
		{
			if(err)
			{
				console.log("Error occurred while posting :"+err);
				res.send("Error occurred while loading page. Please try again.");
			}
			else
			{
				console.log("follower_query results:"+results2);
				var args2 = {username: req.session.username};
				soap.createClient(url,option, function(err, client) {
			      client.loadFollowers2(args2, function(err, results1) 
				{
					if(err)
					{
						console.log("Error occurred while posting :"+err);
						res.send("Error occurred while loading page. Please try again.");
					}
					else
					{
						console.log("following_query results12345:"+results1);
						res.send({"follower":getJSONObjArray(results2.loadFollowersReturn),"following":getJSONObjArray(results1.loadFollowers2Return)});
						//res.send({"following":results1});
					}
				});
				});
			}
		});
		});
	}
}

exports.loadFollowing=function (req,res)
{
	if(util.validateSession(req, res)==true)
	{
		var username = req.param("username");
		var json_responses;
		var myTweets;
		var option = {
		ignoredNamespaces : true	
		};
		var args = {username: username};
		soap.createClient(url,option, function(err, client) {
		client.loadFollowing(args, function(err, results2) 
		{
			if(err)
			{
				console.log("Error occurred while posting :"+err);
				res.send("Error occurred while loading page. Please try again.");
			}
			else
			{
				console.log("following_query results:"+results2);
				res.send({"following":getJSONObjArray(results2.loadFollowingReturn)});
			}
		});
		});
	}
}

exports.saveProfile=function (req,res)
{
	if(util.validateSession(req, res)==true)
	{
		var username = req.session.username;
		var full_name=req.param('fullname');
		var json_responses;
		var myTweets;
		var birthdate = req.param('birthdate');
		var save_query="Update users set full_name='"+req.param('fullname')+"',location='"+req.param('location')+"',phone='"+req.param('phone')+"'";
		if(birthdate!='' && birthdate!='undefined')
		{
			save_query = save_query+",birth_date=STR_TO_DATE('"+birthdate+"', '%Y-%m-%d')";
		}
		save_query=save_query+" where user_name='"+username+"'";
		var option = {
		ignoredNamespaces : true	
		};
		var args = {username: save_query};
		console.log(args);
		soap.createClient(url,option, function(err, client) {
	      client.saveProfile1(args, function(err, result) 
		{
			if(err)
			{
				console.log("Error occurred while saving :"+err);
				res.send("Error occurred while loading page. Please try again.");
			}
			else
			{
				req.session.full_name=full_name;
				console.log(result.saveProfileReturn);
				res.send("Your profile has been saved.");
			}
		});
		});
	}
}

exports.follow = function(req,res)
{
	if(util.validateSession(req, res))
	{
		var username = req.session.username;
		var json_responses;
		var followingTo = req.param('following_to');
		if(username!== '')
		{
			var option = {
			ignoredNamespaces : true	
			};
			var args = {username: username,followingTo:followingTo};
			soap.createClient(url,option, function(err, client) {
		      client.saveProfile1(args, function(err, result) 
			{
				if(err){}
				else
				{
					res.send("successful");
				}
			});
			});
		}
	}
	else
	{
		res.redirect('/twitter');
	}
}

exports.loadSuggestions = function (req,res)
{
	var username = req.session.username;
	if(util.validateSession(req, res))
	{
		if(req.session.count==0)
		{
			req.session.count=3;
		} 
		else 
		{
			sql_sugg_query = sql_sugg_query + "OFFSET " + req.session.count;
			req.session.count += 1;
		}
		var option = {
		ignoredNamespaces : true	
		};
		var args = {username: username};
		soap.createClient(url,option, function(err, client) {
		client.loadSuggestions(args, function(err, results2) 
		{
			if(err){}
			else
			{
				console.log("Suggestions result :"+results2);
				res.send(getJSONObjArray(results2.loadSuggestionsReturn));
			}
		});
		});
	}
	else
	{
		res.redirect('/twitter');
	}
	
}

exports.doesEmailExist=function (req,res)
{
	var email=req.param('email');
	var option = {
	ignoredNamespaces : true	
	};
	var args = {email: email};
	soap.createClient(url,option, function(err, client) {
	client.doesEmailExist(args, function(err, results2) 
	{
			if(err)
			{
				console.log("Error occurred while validating email :"+err);
				res.send("Error occurred while loading page. Please try again.");
			}
			else
			{
				res.send(results2.doesEmailExistReturn);
			}
		});
	});
}

exports.doesUserExist=function (req,res)
{
	var email=req.param('username');
	var option = {
	ignoredNamespaces : true	
	};
	var args = {username: username};
	soap.createClient(url,option, function(err, client) {
	client.doesUserExist(args, function(err, results2) 
	{
			if(err)
			{
				console.log("Error occurred while validating email :"+err);
				res.send("Error occurred while loading page. Please try again.");
			}
			else
			{
				res.send(results2.doesUserExistReturn);
			}
		});
	});
}

exports.signUpNow = function(req,res)
{
	var username = req.param("username");
	var email = req.param("email");
	var fullname = req.param("fullname");
	var password = req.param("password");
	console.log("inside Signup now "+password);
	Bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) {
                return console.error(err);
        }
        Bcrypt.hash(password, salt, function(err, hash) {
                if(err) {
                	console.log("error while hashing "+password);
                        return console.error(err);
                }
                else
                {
                	console.log("final :"+hash);
                	var option = {
        			ignoredNamespaces : true	
        			};
        			var args = {email:email,username: username,hash:hash,fullname:fullname};
        			soap.createClient(url,option, function(err, client) {
        			client.signUpNow(args, function(err, results2) 
        			{
                		if(err)
                		{
                			console.log("Error occurred while creating new user :"+err);
                			res.send(false);
                		}
                		else
                		{
                			req.session.username = username;
                			req.session.count=0;
                			req.session.full_name = fullname;
                			console.log("Session initialized");
                			json_responses = {"statusCode" : 200,"session":req.session};
                			res.send(json_responses);
                		}
                	});
        			});
                }
        });
	});
}