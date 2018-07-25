define([
	
	"jquery", 
	"backbone",
	"com/models/Constants",
	"com/utils/Utils",
	"com/utils/DataUtils",
	
], function($, Backbone, Constants, Utils, DataUtils){
	
	var AuthenticateUtils = Backbone.Model.extend({},
	
	{
		
		/**
		 * user login
		 * @param userInfo, user info
		 * @param onLoginHandler, function to handle login result
		 * @param onErrorHandler, function to handler error
		 */
		login: function(userInfo, onLoginHandler,onErrorHandler){
			var onSuccess = function(response){
				console.log("response  = "+JSON.stringify(response));
//				DataUtils.setLocalStorageData(Constants.LS_KEY_USERID, response.data.id);
				//DataUtils.setLocalStorageData(Constants.LS_KEY_TOKEN, response.invocationResult.token);
				//DataUtils.setLocalStorageData(Constants.LS_KEY_SESSION_ID, response.invocationResult.sessionId);
				if(response.errorCode=="0")
				onLoginHandler(response);
				else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			//get user name and password
			var staffName = userInfo.username;
			var password = userInfo.password;
			if(!staffName){
				$.mobile.loading("hide");
				var message =  Utils.getTranslation("%login.username.empty%");
				Utils.showAlert(message);
			}else{
			
			console.log("staff name = "+staffName+" password = "+password);
			this.invokeService("/auth/users?userName="+staffName+"&password="+password, "GET", {}, onSuccess);
			}
		},
		
		/**
		 * user logout
		 * @param userInfo, user info
		 * @param onLogoutHandler, function to handle logout result
		 * @param onErrorHandler, function to handler error
		 */
		logout: function(userInfo, onLogoutHandler,onErrorHandler){
    		if(onLogoutHandler){
    			onLogoutHandler();
    		}
		},
		
		/**
		 * user getUserInfo
		 * @param userId
		 * @param onLoginHandler, function to get user info
		 * @param onErrorHandler, function to handler error
		 */
		getUserInfo: function(userId, onLoginHandler,onErrorHandler){
			var onSuccess = function(response){
				console.log("response  = "+JSON.stringify(response));
//				DataUtils.setLocalStorageData(Constants.LS_KEY_USERID, response.data.userId);
				//DataUtils.setLocalStorageData(Constants.LS_KEY_TOKEN, response.invocationResult.token);
				//DataUtils.setLocalStorageData(Constants.LS_KEY_SESSION_ID, response.invocationResult.sessionId);
				if(response.errorCode=="0")
				onLoginHandler(response);
				else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			

			console.log("userId = "+userId);
			this.invokeService("/users/"+userId, "GET", {}, onSuccess);
		},
		
		/**
		 * invoke backend service
		 * 
		 * @param url, rest service url to be invoked
		 * @param method, method used for the request, e.g., get, post, delete, etc.
		 * @param params, parameters to be sent with the request
		 * @param onResponseHandler, function to handle response from the server
		 * @param async, if use async onvocation
		 * 
		 */
		invokeService: function(url, method, params, onResponseHandler, async){
			console.log("accept = "+Constants.DEFAULT_REST_SERVICE_ACCEPT_HEADER);
			if(!Utils.isConnectionAvailable()){
				var self = this;
				$.mobile.loading("hide");
				
				var message = Utils.getTranslation("%common.network.unavailable%");
				var title = Utils.getTranslation("%common.network.unavailable.title%");
				var onYes = function(){		
					self.invokeService(url, method, params, onResponseHandler,  async);
				};
				
				
				Utils.showConfirmationAlert(message, onYes, null, title, "Cancel,Retry");
			}else{
				var baseUrl = null;
				
	        	var usingServerId = DataUtils.getLocalStorageData(Constants.LS_KEY_USING_SERVER_ID);
	        	if(!usingServerId){
	        		usingServerId = Constants.DEFAULT_USING_SERVER_ID;
	                DataUtils.setLocalStorageData(Constants.LS_KEY_USING_SERVER_ID, usingServerId);
	        	}
				if(usingServerId == 1){
		        	var apiServer = DataUtils.getLocalStorageData(Constants.LS_KEY_API_SERVER_ADDRESS);
		        	if(!apiServer){
		        		apiServer = Constants.DEFAULT_API_SERVER_ADDRESS;
		                DataUtils.setLocalStorageData(Constants.LS_KEY_API_SERVER_ADDRESS, apiServer);
		        	}
		        	
					baseUrl = "http://"+apiServer+":"+Constants.DEFAULT_AUTHENTICATE_PORT;
				}else{
			       	var bluemixServer = DataUtils.getLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_ADDRESS);	        	
//		        	var bluemixPort = DataUtils.getLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_PORT);
		        	baseUrl = "http://"+bluemixServer+":"+Constants.DEFAULT_AUTHENTICATE_PORT;
				}
				
				console.log("api path = "+baseUrl+url);
                console.log("method = "+method);
			$.ajax({
				type: method,
				url: baseUrl+url,
				async: typeof async == "undefined" ? true : async,
						   cache: true,
				timeout: parseInt(DataUtils.getLocalStorageData(Constants.LS_KEY_CONNECT_TIMEOUT))*1000,
				dataType: "json",
				data: params,
				beforeSend: function(xhr){						    
					xhr.setRequestHeader("Accept",Constants.DEFAULT_COMMON_ACCEPT_HEADER);
				},
				success: function(data){
				    console.log("success to get the data");
					if(onResponseHandler){
						onResponseHandler(data);
					}
				},
				error: function(data , errorCode){
					console.log("Failed to get data ");
					$.mobile.loading("hide");
					var message = errorCode == "timeout"?"Connection timeout":"System error connecting to backend service.";
					Utils.showAlert(message);
				}
			});
			}
		},
		
			
	});

	return AuthenticateUtils;

}); 








