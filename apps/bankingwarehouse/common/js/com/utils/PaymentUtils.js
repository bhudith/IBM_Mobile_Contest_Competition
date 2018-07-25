define([
	
	"jquery", 
	"backbone",
	"com/models/Constants",
	"com/utils/Utils",
	"com/utils/DataUtils",
	"com/models/PayeeModel",
	"com/collections/PayeeModelsCollection",
	
], function($, Backbone, Constants, Utils, DataUtils, PayeeModel, PayeeModelsCollection){
	
	var PaymentUtils = Backbone.Model.extend({},
	
	{
		/**
		 * get payees by type
		 * @param payeeInfo, payee info
		 * @param onPayeeHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
    	getPayeesByType: function(payeeInfo, onPayeeHandler,onErrorHandler){
        	var onResponse = function(response) {
        		console.log("getPayeesByType = "+response.statusMessage);
        		var payeeArr = [];
				for(var i in response.data) {
					var payee = response.data[i];
					payeeArr.push(new PayeeModel(payee)); 
				}
				if(response.errorCode=="0")
				onPayeeHandler(new PayeeModelsCollection(payeeArr));
				else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			var type = payeeInfo.type;
			var userId = payeeInfo.userId;
			console.log("type = "+type);
			console.log("userId = "+userId);
			this.invokeService("/payees?userId="+userId+"&type="+type, "get", {}, onResponse);
		},
		
		/**
		 * get payee by ID
		 * @param payeeId
		 * @param onPayeeHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
		getPayeeByPayeeId: function(payeeId, onPayeeHandler,onErrorHandler){
        	var onResponse = function(response) {
        		console.log("getPayeeByPayeeId  = "+response.statusMessage);
        		       		
        		if(response.errorCode=="0")
        			onPayeeHandler(new PayeeModel(response.data));
        		else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			console.log("payeeId = "+payeeId);
			this.invokeService("/payees/"+payeeId, "get", {}, onResponse);
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
		        	
					baseUrl = "http://"+apiServer+":"+Constants.DEFAULT_PAYMENTS_PORT;
				}else{
			       	var bluemixServer = DataUtils.getLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_ADDRESS);	        	
//		        	var bluemixPort = DataUtils.getLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_PORT);
		        	baseUrl = "http://"+bluemixServer+":"+Constants.DEFAULT_PAYMENTS_PORT;
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

	return PaymentUtils;

}); 








