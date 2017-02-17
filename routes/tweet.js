var ejs = require("ejs");
var util = require("./server-utility");
var soap = require('soap');
var baseURL = "http://localhost:8080/Twitter-SOAP-Service/services";
var url = baseURL+"/Tweet?wsdl";

exports.loadTweets = function(req,res)
{
	if(util.validateSession(req, res)==true)
	{
		var username = req.param("username");
		console.log("load all tweets 789"+username);
		var json_responses,myTweets;
		var myTweets,myReTweets,otherTweets,otherReTweets;
		var option = {
		ignoredNamespaces : false	
		};
		var args = {username: username};
		soap.createClient(url,option, function(err, client) {
	    client.loadTweets(args, function(err, results) {
			if(err)
			{
				console.log("Error occurred while posting :"+err);
				res.send("Error occurred while loading page. Please try again.");
			}
			else
			{
				console.log("myTweets:"+results);
				res.send({tweets:getJSONObjArray(results.loadTweetsReturn),username:req.session.username});
			}
		});
		});
	}
}

exports.loadMyTweets = function(req,res)
{
	if(util.validateSession(req, res)==true)
	{
		var username = req.param("username");
		console.log("load My Tweets 456 :"+username);
		var json_responses,myTweets;
		var myTweets;
		var option = {
		ignoredNamespaces : true	
		};
		var args = {username: username};
		soap.createClient(url,option, function(err, client) {
	    client.loadMyTweets(args, function(err, results) {
			if(err)
			{
				console.log("Error occurred while posting :"+err);
				res.send("Error occurred while loading page. Please try again.");
			}
			else
			{
				console.log("myTweets:"+results);
				res.send({tweets:getJSONObjArray(results.loadTweetsReturn),username:req.session.username});
			}
		});
		});
	}
}

exports.postReTweet = function(req,res)
{
	if(util.validateSession(req, res)==true)
	{
		var username = req.session.username;
		var comment = req.param("comment");
		var parent_tweet_id = req.param("parent_tweet_id");
		var json_responses;
		var handle_arr='';
		var hashtag_arr='';
		var tweet_words=comment.split(" ");
		var j=0,k=0;
		for(var i=0;i<tweet_words.length;i++)
		{
			if(tweet_words[i].startsWith("@"))
			{
				if(j!=0)
					handle_arr=handle_arr+",";
				handle_arr=handle_arr+tweet_words[i];
				j++;
			}
			else if(tweet_words[i].startsWith("#"))
			{
				if(k!=0)
					hashtag_arr=hashtag_arr+",";
				hashtag_arr=hashtag_arr+tweet_words[i];
				k++;
			}
		}
		var option = {
		ignoredNamespaces : true	
		};
		var args = {username: username,comment:comment,parent_tweet_id: parent_tweet_id,handle_arr: handle_arr,hashtag_arr: hashtag_arr};
		soap.createClient(url,option, function(err, client) {
	    client.postReTweet(args, function(err, results) {
			if(err)
			{
				console.log("Error occurred while posting :"+err);
				res.send("Error occurred while posting. Please try again.");
			}
			else
			{
				console.log("Retweet was posted successfully.");
				res.send("Your tweet was posted!");
			}
		});
		});
	}
}

/*exports.postTweet = function(req,res)
{
	if(util.validateSession(req, res)==true)
	{
		var username = req.session.username;
		var tweet = req.param("tweet");
		var json_responses;
		var tweets;
		var handle_arr='';
		var hashtag_arr='';
		var tweet_words=tweet.split(" ");
		var j=0,k=0;
		for(var i=0;i<tweet_words.length;i++)
		{
			if(tweet_words[i].startsWith("@"))
			{
				if(j!=0)
					handle_arr=handle_arr+",";
				handle_arr=handle_arr+tweet_words[i];
				j++;
			}
			else if(tweet_words[i].startsWith("#"))
			{
				if(k!=0)
					hashtag_arr=hashtag_arr+",";
				hashtag_arr=hashtag_arr+tweet_words[i];
				k++;
			}
		}
		var tweet_query="INSERT into tweet(user_name,twit,created_dt,tweet_handler,hashtag) values ('"+username+"','"+tweet+"',NOW(),'"+handle_arr+"','"+hashtag_arr+"')";
		mysql.executeQuery(function(err,results)
		{
			if(err)
			{
				console.log("Error occurred while posting :"+err);
				res.send("Error occurred while posting. Please try again.");
			}
			else
			{
				console.log("Tweet was posted successfully.");
				res.send("Your tweet was posted!");
			}
		},tweet_query);
	}
}*/

exports.postTweet = function(req,res)
{
	if(util.validateSession(req, res)==true)
	{
		var username = req.session.username;
		var comment = req.param("tweet");
		var json_responses;
		var handle_arr='';
		var hashtag_arr='';
		var tweet_words=comment.split(" ");
		var j=0,k=0;
		for(var i=0;i<tweet_words.length;i++)
		{
			if(tweet_words[i].startsWith("@"))
			{
				if(j!=0)
					handle_arr=handle_arr+",";
				handle_arr=handle_arr+tweet_words[i];
				j++;
			}
			else if(tweet_words[i].startsWith("#"))
			{
				if(k!=0)
					hashtag_arr=hashtag_arr+",";
				hashtag_arr=hashtag_arr+tweet_words[i];
				k++;
			}
		}
		var option = {
		ignoredNamespaces : true	
		};
		var args = {username: username,comment:comment,handle_arr: handle_arr,hashtag_arr: hashtag_arr};
		soap.createClient(url,option, function(err, client) {
	    client.postTweet(args, function(err, results) {
			if(err)
			{
				console.log("Error occurred while posting :"+err);
				res.send("Error occurred while posting. Please try again.");
			}
			else
			{
				console.log("Retweet was posted successfully.");
				res.send("Your tweet was posted!");
			}
		});
		});
	}
}

exports.search = function(req,res)
{
	if(util.validateSession(req, res)==true)
	{
		var t = req.param("search_box");
		var search_tweet_query='',search_user_query='';
		/*if(t.startsWith("@"))
		{
			search_tweet_query="select m.twit_id,m.twit,u.full_name,m.parent_tweet_id,m.user_name,m.created_dt " +
			"from tweet m, users u " +
			"where u.user_name=m.user_name and m.tweet_handler like '%"+t+"%' order by m.created_dt desc";
			search_user_query="select * from users where u.user_name like '%"+t.substring(1,t.length-1)+"%'";
			mysql.executeQuery(function(err,results)
			{
				if(err)
				{
					console.log("Error occurred while searching :"+err);
					res.send({ERROR:"Error occurred while searching. Please try again."});
				}
				else
				{
					console.log("Users with parameter "+t+" :"+results);
					res.send({"searched_users":results});
				}
			},search_user_query);
		}
		else 
		if(t.startsWith("#"))
		{*/
		var option = {
				ignoredNamespaces : true	
				};
				var args = {t:t};
				soap.createClient(url,option, function(err, client) {
			    client.search(args, function(err, results) {
				if(err)
				{
					console.log("Error occurred while searching :"+err);
					res.send({ERROR:"Error occurred while searching. Please try again."});
				}
				else
				{
					res.render("template",{"title":"Search Results for "+t,"search_query":t,"searched_tweets":getJSONObjArray(results.loadSearchReturn),path : '../views/afterLogin/search_results.ejs',session1:req.session});
				}
			});
			});
		}
		else
		{
			res.render("template",{"title":"Search Results for "+t,"search_query":t,"searched_tweets":'',path : '../views/afterLogin/search_results.ejs',session1:req.session});
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