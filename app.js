
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , render = require('./routes/render')
  , login = require('./routes/login')
  , session = require('client-sessions')
  , tweet = require('./routes/tweet')
  , fs = require('fs')
  , user = require('./routes/user');

var app = express();

app.use(session({   
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently

// all environments
app.set('port', process.env.PORT || 9090);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*app.get('/', routes.index);*/
app.get('/',routes.index);
app.get('/twitter',routes.index);
app.get('/signUpPage',render.showSignUpPage);
app.get('/signInPage',render.showSignInPage);
app.get('/homepage',login.redirectToHomepage);
app.post('/checklogin',login.login);
app.post('/login',login.login);
app.post('/logout',login.logout);
app.post('/getFollowerCount',user.getFollowerCount);
app.post('/getTweetCount',user.getTweetCount);
app.post('/getFollowingCount',user.getFollowingCount);
app.post('/postTweet',tweet.postTweet);
app.post('/postReTweet',tweet.postReTweet);
app.post('/loadTweets',tweet.loadTweets);
app.post('/loadMyTweets',tweet.loadMyTweets);
app.get('/getUserPage',user.getUserPage);
app.post('/loadPersonalInfo',user.loadPersonalInfo);
app.post('/loadFollowers',user.loadFollowers);
app.post('/loadFollowing',user.loadFollowing);
app.post('/saveProfile',user.saveProfile);
app.post('/follow',user.follow);
app.post('/searchTwitter',tweet.search);
app.post('/loadSuggestions',user.loadSuggestions);
app.post('/doesEmailExist',user.doesEmailExist);
app.post('/doesUserExist',user.doesUserExist);
app.post('/signUpNow',user.signUpNow)
/*app.post('/loadReTweets',tweet.loadReTweets);
app.post('/loadOtherTweets',tweet.loadOtherTweets);
app.post('/loadOtherReTweets',tweet.loadOtherReTweets);*/

http.createServer(app).listen('9000', function(){
  console.log('Express server listening on port 9000');
});