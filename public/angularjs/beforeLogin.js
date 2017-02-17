var signup = angular.module('signup',[]);
var signin = angular.module('signin', []);
signin.controller('signin-controller', function($scope, $http) {
	$scope.NAME_REQ = true;
	$scope.PWD_REQ = true;
	$scope.unexpected_error=true;
	$scope.invalid_login=true;
	$scope.submit = function() {
		if($scope.username=='')
		{
			$scope.NAME_REQ = false;
		}
		else if($scope.password=='')
		{
			$scope.PWD_REQ = false;
		}
		else
		{
			$http({
				method : "POST",
				url : '/login',
				data : {
					"username" : $scope.username,
					"password" : $scope.password
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 400) {
					$scope.invalid_login = false;
					$scope.unexpected_error = true;
				}
				else if(data.statusCode == 200)
					window.location.assign("/homepage"); 
			}).error(function(error) {
				$scope.unexpected_error = false;
				$scope.invalid_login = true;
			});
		}
	};
//})
});

function hideSignUpErrors($scope)
{
	$scope.signupbox=false;
	$scope.fullname_req = true;
	$scope.username_req = true;
	$scope.username_reg = true;
	$scope.email_req=true;
	$scope.email_reg=true;
	$scope.email_invalid=true;
	$scope.password_req=true;
	$scope.password_len=true;
	$scope.creation=true;
}

signup.controller("signup-controller", function($scope, $http) {
	$scope.init = function()
	{
		hideSignUpErrors($scope);
	}
	$scope.signup = function() {
		var forwardRequest = true;
		hideSignUpErrors($scope);
		if($scope.fullname=='' || typeof $scope.fullname=='undefined')
		{
			return false;
			$scope.fullname_req = false;
		}
		if($scope.username=='' || typeof $scope.username=='undefined')
		{
			return false;
			$scope.username_req = false;
		}
		else
		{
			$http({
				method : "POST",
				url : '/doesUserExist',
				data : {
					"username" : $scope.username
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data == "true") {
					$scope.username_reg=false;
					return false;
				}
				else
				{
					if($scope.email=='' || typeof $scope.email=='undefined')
					{
						$scope.email_req = false;
						return false;
					}
					else if(!validateEmail($scope.email))
					{
						$scope.email_invalid = false;
						return false;
					}
					else
					{
						$http({
							method : "POST",
							url : '/doesEmailExist',
							data : {
								"email" : $scope.email
							}
						}).success(function(data) {
							//checking the response data for statusCode
							if (data == "true") {
								$scope.email_reg=false;
								return false;
							}
							else
							{
								if(typeof $scope.password=='undefined' || $scope.password=='')
								{
									$scope.password_req = false;
									return false;
								}
								else if($scope.password.length<6)
								{
									$scope.password_len = false;
									return false;
								}
								else
								{
										$scope.creation=false;
										$scope.signupbox=true;
										$http({
											method : "POST",
											url : '/signUpNow',
											data : {
												"username" : $scope.username,
												"fullname" : $scope.fullname,
												"email" : $scope.email,
												"password" : $scope.password
											}
										}).success(function(data) {
											//checking the response data for statusCode
											if (data==false) {
												alert("Unexpected error. Please try again.");
												return false;
											}
											else
											{
												window.location.assign("/homepage");
											}
										}).error(function(error) {
											/*$scope.unexpected_error = false;*/
											alert("Unexpected error. Please try again.");
											return false;
										});
									}
								}
						}).error(function(error) {
							$scope.unexpected_error = false;
							return false;
						});
					}
				}
			}).error(function(error) {
				$scope.unexpected_error = false;
				return false;
			});
		}
	};
//})
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}