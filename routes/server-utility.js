var Bcrypt = require('bcryptjs');


exports.validateSession= function (req,res)
{
	if(req.session.username)
	{
		var username = req.session.username;
		if(username!== '')
		{
			return true;
		}
	}
	else
	{
		res.redirect('/twitter');
	}
}

var SALT_WORK_FACTOR = 10;

exports.generateHashForPassword = function (password)
{
	var hashed = '';
	console.log("inside generate for "+password);
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
                	hashed=hash;
                	console.log("hashed "+hashed);
                    return hashed;
                }
        });
        
	});
}

exports.doesPasswordMatch = function (password,hashInDB)
{
    Bcrypt.compare(pass, hashInDB, function(err, isMatch) {
        if(err) {
                return console.error(err);
        }
        console.log('do they match?', isMatch);
});
}