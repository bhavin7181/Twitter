//loading the 'login' angularJS module
var main = angular.module('main', ["ngSanitize"]);
//var userhome1 = angular.module('main', ["ngSanitize"]);
var modal = angular.module('modal', ["ngSanitize"]);
//
main.controller('personalinfo1c',function ($scope, $http,$rootScope) 
{
	$scope.loadPersonalInfo = function(username){loadPersonalInfo($scope,$http,username,'/loadPersonalInfo')};
	$scope.loadFollowing = function(username){loadFollowing($scope,$http,$rootScope,username,'/loadFollowing')};
	$scope.loadFollowers= function(username){loadFollowers($scope,$http,$rootScope,username,'/loadFollowers')};
});

main.controller('user-controller',function($scope, $http) {
	$scope.getUserDetails=function(username)
	{
		getAllUserDetails($scope,$http,username);
	}
});

main.controller("ff",function($scope, $http,$rootScope)
{
	$rootScope.following_list=0;
	$scope.follow=function(val)
	{
		$("#follow_"+val).val("FOLLOWING");
		$http({
			method : "POST",
			url : "/follow",
			data :
			{
				"following_to" : val
			}
		}).success(function(data) {
			
		});
	};
});

function activate_border(target)
{
	$(".make-inactive").removeClass('active-border');
	$("#"+target).addClass('active-border');
}

main.controller('menu-controller', function($scope, $http,$rootScope) {
	$scope.init=function(username)
	{
		getAllUserDetails($scope,$http,username);
		if($("#clicked_input").val()=="tweets")
		loadAllTweets($scope, $http,username,'/loadMyTweets');
		else if($("#clicked_input").val()=="followers")
			loadFollowers($scope, $http, $rootScope,username,'/loadFollowers');
		else if($("#clicked_input").val()=="following")
		loadFollowing($scope, $http, $rootScope, username,'/loadFollowing');
	};
	
	$scope.loadFollowing=function(username)
	{
		$("#clicked_input").val("following");
		activate_border("following_li");
		getAllUserDetails($scope,$http,username);
		$http({
			method : "POST",
			url : '/loadFollowing',
			data : {"username":username}
		}).success(function(data) {
			traverseFollowingData(data,$scope,$rootScope);
		});
	};
	
	$scope.loadFollowers=function(username)
	{
		$("#clicked_input").val("followers")
		activate_border("followers_li");
		getAllUserDetails($scope,$http,username);
		$http({
			method : "POST",
			url : '/loadFollowers',
			data : {"username":username}
		}).success(function(data) {
			traverse_followers(data, $scope, $rootScope);
		});
	};
	
	$scope.loadMyTweets = function(username) {
		$("#clicked_input").val("tweets");
		activate_border("tweets_li");
		getAllUserDetails($scope,$http,username);
		$http({
			method : "POST",
			url : '/loadMyTweets',
			data : {"username":username}
		}).success(function(data) {
			var tweet_map={};
			var keyList = []; 
			if(!jQuery.isEmptyObject(data.tweets))
			{
				renderTweetContent(data.tweets,data.username);
				showCorrectBox();
			}
		});
};
});

function applyClassToHandleHashTag(tweet)
{
	if(!angular.isUndefinedOrNull(tweet))
	{
		var tweet_words = tweet.split(" ");
		var newTweet='';
		for(var i=0;i<tweet_words.length;i++)
		{
			if(tweet_words[i].startsWith("@"))
			{
				newTweet=newTweet+" "+"<span class='handler_word'>"+tweet_words[i]+"</span>";
			}
			else if(tweet_words[i].startsWith("#"))
			{
				newTweet=newTweet+" "+"<a href=\"/searchTwitter?search_box="+tweet_words[i]+"\">"+tweet_words[i]+"</a>";
			}
			else
			{
				newTweet=newTweet+" "+tweet_words[i];
			}
		}
		return newTweet;
	}
	return tweet;
}

function traverse_followers(data,$scope,$rootScope)
{
	if(!jQuery.isEmptyObject(data))
	{
		var flagsArray = [];
		for(var i=0;i<data.follower.length;i++){
			var flag = false;
			for(var j=0;j<data.following.length;j++){	
				if(data.follower[i].user_name == data.following[j].user_name ){
					flag = true;
					break;
				}	
			}
			flagsArray.push(flag);
		}	
		$rootScope.arrayflags1=flagsArray;
		$rootScope.following_list='';
		$rootScope.followers_list=data.follower;
		showCorrectBox();
	}
}

main.controller('who-to-follow',function($scope, $http) {
		$scope.loadSuggestions = function(username) {
			$http({
				method : "POST",
				url : '/loadSuggestions',
				data : {
					"username":username
				}
			}).success(function(data) {
				$scope.followSuggestions=data;
			});
		};
		
		$scope.follow=function(val)
		{
			$("#follow_"+val).html("FOLLOWING");
			$http({
				method : "POST",
				url : "/follow",
				data :
				{
					"following_to" : val,
				}
			}).success(function(data) {
				angular.element('#following_anchor').triggerHandler('click');
			});
		};
});


main.controller('tweet_t1',function($scope, $http,$rootScope) {
	if($scope.tweet_t!='' && $scope.tweet_t!='undefined')
	{
		$scope.postTweet = function() {
			$http({
				method : "POST",
				url : '/postTweet',
				data : {
				"tweet" : $scope.tweet_t
				}
			}).success(function(data) {
				$("#modal-text").text(data);
				$scope.tweet_t='';
				$('#char-count').text(140);
				toggleModal();
				setTimeout(toggleModal,2100);
				$rootScope.loadTweets();
			});
		};
	}
});

function saveProfile()
{
	var form=document.profileform;
	if($("#full-name").val()!='' && $("#full-name").val()!='undefined')
	{
		$.post("/saveProfile",
			    "fullname="+form.fullname.value+"&location="+form.location.value+"&birthdate="+form.birthdate.value+"&phone="+form.tel.value,
	    function(data){
	    	if(data)
	    	{
	    		$('#user-modal-popup').modal('toggle');
	    		$("#modal-text").text(data);
	    		$("#tweet_t_modal").val('');
				$('#char-count-modal').text(140);
				toggleModal();
				setTimeout(toggleModal,2100);
	    	}
		});
	}
	else
	{
		alert("Full-name is required");
		return false;
		$('#tweetsuccess').modal('toggle');
		toggleModal();
		setTimeout(toggleModal,2100);
	}
}


function postTweetFromModal()
{
	if($("#tweet_t_modal").val()!='' &&  $("#tweet_t_modal").val()!='undefined')
	{
		$.post("/postTweet",
			    "tweet="+$("#tweet_t_modal").val(),
	    function(data){
	    	if(data)
	    	{
	    		$("#modal-text").text(data);
	    		$("#tweet_t_modal").val('');
				$('#char-count-modal').text(140);
				$('#tweet-modal-popup').modal('toggle');
				toggleModal();
				setTimeout(toggleModal,2100);
	    	}
	    });
	}
}

function postReTweetFromModal()
{
		$.post("/postReTweet",
			    "comment="+$("#retweet_t_modal").val()+"&parent_tweet_id="+$("#current-tweet-id").html(),
	    function(data){
	    	if(data)
	    	{
	    		$("#modal-text").text(data);
	    		$("#retweet_t_modal").val('');
				$('#retweet-char-count-modal').text(140);
				$('#retweet-modal-popup').modal('toggle');
				toggleModal();
				setTimeout(toggleModal,2100);
	    	}
	    });
}

main.controller('tweet-loader',function ($rootScope,$scope, $http) 
	{
		$rootScope.loadTweets = function(username){loadAllTweets($scope,$http,username,'/loadTweets')};
	});
function loadPersonalInfo(scopeObj,httpObj,username,url) {
	httpObj({
		method : "POST",
		url : "/loadPersonalInfo",
		data : {"username":username}
	}).success(function(data) {
		if(!jQuery.isEmptyObject(data))
		{
			if(!angular.isUndefinedOrNull(data[0].year) && data[0].year!='')
			{
				$("#user-joining").show();
				scopeObj.joining_span="Joined on "+data[0].month+" "+data[0].joining_day+","+data[0].year;
			}
			if(!angular.isUndefinedOrNull(data[0].location) && data[0].location!='')
			{
				$("#location").val(data[0].location);
				$("#user-location").show();
				scopeObj.location_span=data[0].location;
			}
			if(!angular.isUndefinedOrNull(data[0].birth_date) && data[0].birth_date!='')
			{
				$("#birthday").val(data[0].row_birthdate);
				$("#user-birthday").show();
				scopeObj.birthday_span=data[0].birth_date;
			}
			if(!angular.isUndefinedOrNull(data[0].phone) && data[0].phone!='')
			{
				$("#tel").val(data[0].phone);
				$("#user-phone").show();
				scopeObj.phone_span=data[0].phone;
			}
		}
	});
}

function loadFollowers(scopeObj,httpObj,rootObj,username,url) {
	$("#clicked_input").val("followers");
	httpObj({
		method : "POST",
		url : url,
		data:{"username":username}
	}).success(function(data) {
		/*if(!jQuery.isEmptyObject(data))
		{
			if(!angular.isUndefinedOrNull(data[0].year))
			{
				$("#joining").show();
				scopeObj.joining_span="Joined on "+data[0].month+" "+data[0].year;
			}
			if(!angular.isUndefinedOrNull(data[0].location))
			{
				$("#location").show();
				scopeObj.location_span=data[0].location;
			}
			if(!angular.isUndefinedOrNull(data[0].birth_date))
			{
				$("#birthday").show();
				scopeObj.birthday_span=data[0].birth_date;
			}
		}*/
		traverse_followers(data, scopeObj,rootObj);
	});
}

function traverseFollowingData(data,$scope,$rootScope)
{
	if(!jQuery.isEmptyObject(data))
	{
		$rootScope.followers_list=0;
		$rootScope.following_list=data.following;
		showCorrectBox();
	}
}

function loadFollowing(scopeObj,httpObj,rootObj,username,url) {
	$("#clicked_input").val("following");
	httpObj({
		method : "POST",
		url : url,
		data : {"username":username}
	}).success(function(data) {
		/*if(!jQuery.isEmptyObject(data))
		{
			if(!angular.isUndefinedOrNull(data[0].year))
			{
				$("#joining").show();
				scopeObj.joining_span="Joined on "+data[0].month+" "+data[0].year;
			}
			if(!angular.isUndefinedOrNull(data[0].location))
			{
				$("#location").show();
				scopeObj.location_span=data[0].location;
			}
			if(!angular.isUndefinedOrNull(data[0].birth_date))
			{
				$("#birthday").show();
				scopeObj.birthday_span=data[0].birth_date;
			}
		}*/
		traverseFollowingData(data,scopeObj,rootObj);
	});
}

function getAllUserDetails(scopeObj,httpObj,username)
{
		httpObj({
			method : "POST",
			url : '/getTweetCount',
			data : 
			{
				"username" : username
			}
		}).success(function(data) {
			if(data.count==0)
				scopeObj.tweet='0';
			else
			 scopeObj.tweet=data.count;
		}).error(function(error) {
			scopeObj.tweet=0;
		});
	httpObj({
		method : "POST",
		url : '/getFollowerCount',
		data : 
		{
			"username" : username
		}
	}).success(function(data) {
		if(data.count==0)
			scopeObj.follower='0';
		else
		 scopeObj.follower=data.count;
	}).error(function(error) {
		scopeObj.tweet=0;
	});
	httpObj({
		method : "POST",
		url : '/getFollowingCount',
		data : 
		{
			"username" : username
		}
	}).success(function(data) {
		if(data.count==0)
			scopeObj.following='0';
		else
		 scopeObj.following=data.count;
	}).error(function(error) {
		scopeObj.following=0;
});
}

function loadAllTweets(scopeObj,httpObj,username,url) {
	httpObj({
		method : "POST",
		url : url,
		data : 
		{
			"username" : username
		}
	}).success(function(data) {
		if(!jQuery.isEmptyObject(data.tweets))
		{
			renderTweetContent(data.tweets,data.username);
			showCorrectBox();
		}
	});
}

function renderTweetContent(data,username)
{
	var tweet_map={};
	var keyList = []; 
	var c="",final_c="";
	$.each(data,function()
	{
		tweet_map[this.twit_id]={"tweet":this.twit,"full_name":this.full_name
				,"parent_tweet_id":this.parent_tweet_id,"user_name":$.trim(this.user_name),"created_dt":this.created_dt};
	});
	$.each(data,function()
	{
		var disableRetweet = this.user_name==username?"":"onclick=\"manageRetweet(this)\"";
		var disableCSS = this.user_name==username?"user-action-disabled":"user-action";
		var child =this;
		var childTweet = applyClassToHandleHashTag(child.twit);
		if(angular.isUndefinedOrNull(this.parent_tweet_id))
		{
			c="<div class=\"all-tweets tweet-border clearfix\">"+
	          "<img class=\"pull-left default-img\" src=\"../images/default-pic.png\"><div class=\"tweet-content\"><a class=\"getuserlink\" href=\"/getUserPage?username="+child.user_name+"\"\><span class=\"tweetby-full-name\">"+child.full_name+"</span></a><a class=\"getuserlink\" href=\"/getUserPage?username="+child.user_name+"\"\><span class=\"tweetby-handle\">@"+child.user_name+"</span></a></div>"+
	          "<p class=\"tweet-text tweet-content\">"+childTweet+"</p>" +
	          "<div class=\"parent-tweet\"><a href=\"#\"><span class=\"glyphicon glyphicon-new-window "+disableCSS+"\"></span>"+
	          "</a>" +
	          "<a href=\"#\" class=\"retweet-anchor\" id=\""+this.twit_id+"\" data-toggle=\"modal\" " +
	          disableRetweet+
	          ">"+
	          "<span class=\"glyphicon glyphicon-retweet "+disableCSS+"\"></span>"+
	          "</a><a href=\"#\"><span class=\"glyphicon glyphicon-heart user-action heart\"></span>"+
	          "</a></div></div>";
		}
		else
		{
			var parent = tweet_map[this.parent_tweet_id];
			if(!angular.isUndefinedOrNull(parent) && !jQuery.isEmptyObject(parent))
			{
				var parentTweet = applyClassToHandleHashTag(parent.tweet);
				c="<div class=\"all-tweets tweet-border clearfix\">"+
		          "<img class=\"pull-left default-img\" src=\"../images/default-pic.png\"><div class=\"tweet-content\"><a class=\"getuserlink\" href=\"/getUserPage?username="+child.user_name+"\"\><span class=\"tweetby-full-name\">"+child.full_name+"</span></a><a class=\"getuserlink\" href=\"/getUserPage?username="+child.user_name+"\"\><span class=\"tweetby-handle\">@"+child.user_name+"</span></a></div>"+
		          "<div class=\"tweet-text tweet-content\">"+childTweet+"</div>"+
		          "<div class=\"all-tweets parent-tweet-border parent-tweet clearfix\">"+
		          "<img class=\"pull-left default-img\" src=\"../images/default-pic.png\"><div class=\"tweet-content\"><a class=\"getuserlink\"  href=\"/getUserPage?username="+parent.user_name+"\"\><span class=\"tweetby-full-name\">"+parent.full_name+"</span></a><a class=\"getuserlink\" href=\"/getUserPage?username="+parent.user_name+"\"\><span class=\"tweetby-handle\">@"+parent.user_name+"</span></a></div>"+
				  "<div class=\"tweet-text tweet-content\">"+parentTweet+"</div></div>" +
				  "<div class=\"parent-tweet\"><a href=\"#\"><span class=\"glyphicon glyphicon-new-window "+disableCSS+"\"></span>"+
		          "</a>" +
		          "<a href=\"#\" class=\"retweet-anchor\"  data-id=\""+this.twit_id+"\" data-toggle=\"modal\" " +
		          disableRetweet+
		          ">"+
		          "<span class=\"glyphicon glyphicon-retweet "+disableCSS+"\"></span>"+
		          "</a><a href=\"#\"><span class=\"glyphicon glyphicon-heart user-action heart\"></span>"+
		          "</a></div>" +"</div>";
			}
		}
		final_c=final_c+c;
	});
	$("#tweet_c").html(final_c);
}

function showCorrectBox()
{
	if($("#tweets_li").hasClass("active-border") || $("#clicked_input").val()=='tweets')
	{
		$("#tweet-box").show();
		$("#user-home-wtf").show();
		$("#ff-box").hide();
	}
	else
	{
		$("#user-home-wtf").hide();
		$("#tweet-box").hide();
		$("#ff-box").show();
	}
}

function loadAllTweets1(scopeObj,httpObj,username,url) {
	httpObj({
		method : "POST",
		url : url,
		data : 
		{
			"username" : username
		}
	}).success(function(data) {
		var tweet_map={};
		var keyList = []; 
		if(!jQuery.isEmptyObject(data))
		{
			var c="",final_c="";
			$.each(data,function()
			{
				tweet_map[this.twit_id]={"tweet":this.twit,"full_name":this.full_name
						,"parent_tweet_id":this.parent_tweet_id,"user_name":$.trim(this.user_name),"created_dt":this.created_dt};
			});
			$.each(data,function()
			{
				var child =this;
				if(angular.isUndefinedOrNull(this.parent_tweet_id))
				{
					c="<div class=\"all-tweets tweet-border\">"+
			          "<div><a class=\"getuserlink\" href=\"/getUserPage?username="+child.user_name+"\"\><span class=\"tweetby-full-name\">"+child.full_name+"</span><span class=\"tweetby-handle\">@ddddddddddd"+child.user_name+"</span></a></div>"+
			          "<div class=\"tweet-text\">"+child.twit+"</div></div>";
				}
				else
				{
					var parent = tweet_map[this.parent_tweet_id];
					if(!jQuery.isEmptyObject(parent))
					{
						c="<div class=\"all-tweets tweet-border\">"+
				          "<div><a class=\"getuserlink\" href=\"/getUserPage?username="+child.user_name+"\"\><span class=\"tweetby-full-name\">"+child.full_name+"</span><span class=\"tweetby-handle\">@dddd"+child.user_name+"</span></a></div>"+
				          "<div class=\"tweet-text\">"+child.twit+"</div>"+
				          "<div class=\"all-tweets tweet-border parent-tweet\">"+
				          "<div><a class=\"getuserlink\" href=\"/getUserPage?username="+parent.user_name+"\"><span class=\"tweetby-full-name\">"+parent.full_name+"</span><span class=\"tweetby-handle\">@dddd"+parent.user_name+"</span></a></div>"+
						  "<div class=\"tweet-text\">"+parent.tweet+"</div></div></div>";
					}
				}
				final_c=final_c+c;
			});
			$("#tweet_c").html(final_c);
		}
	});
}
	
function toggleModal()
{
	$('#tweetsuccess').modal('toggle');
}
function countChar(val,id) {
var len = $(val).val().length;
if (len >= 140) {
  val.value = val.value.substring(0, 140);
  $('#'+id).text(0);
} else 
{
  $('#'+id).text(140 - len);
}
  };

  function manageRetweet(obj)
  {
	  $('#retweet-modal-popup').modal('toggle');
	  var twit_id = $(obj).attr('id');
	   $(".modal-body #current-tweet-id").html( twit_id );
  }
  
/*function searchTwitter(obj)
{
	var searchText = $(obj).val();
	if(searchText!='' && )
	{
		
	}
}*/

/* function searchTwitter(e)
 {
	 if (e.which == 13)
	 {
		 alert($("#search_box").val());
		if($("#search_box").val()!='')
		{
			$("#searchForm").submit();
		}
		return false;    //<---- Add this line
	 }
	 return false;
 }*/
