define([
	
	"jquery", 
	"backbone",
	"com/models/Constants",
	"com/utils/Utils",
	"com/utils/DataUtils",
	"com/models/MessageModel",
	"com/collections/MessageModelsCollection",
	
], function($, Backbone, Constants, Utils, DataUtils, MessageModel, MessageModelsCollection){
	
	var MessagesUtils = Backbone.Model.extend({},
	
	{
		
		/**
		 * get the user's messages data
		 * @param userInfo, user info
		 * @param onMessagesHandler, function to receive a MessageModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getMessages: function(userInfo, onMessagesHandler,onErrorHandler){
        	var onResponse = function(response) {
        		console.log("message response = "+JSON.stringify(response));
				var arr = [];
				for(var i in response.data) {
					var message = new MessageModel(response.data[i]);
					arr.push(message); 
				}
				
				var messages = new MessageModelsCollection(arr);				
				if(onMessagesHandler) {
					onMessagesHandler(messages);
				}
				else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			var userId = userInfo.userId;
			console.log("user ID = "+userId);
			this.invokeService("/messages?userId="+userId, "GET", {}, onResponse);
		},
		
		/**
		 * get the user's message data by ID
		 * @param messageId, message ID
		 * @param onMessageHandler, function to receive a MessageModel
		 */
		getMessageById: function(userInfo, messageId, onMessageHandler){
			var onMessages = function(messages) {
				messages.each(function(message){
					if(message.get("messageId") == messageId){
						if(onMessageHandler) {
							onMessageHandler(message);
						}
						return false;
					}
				});
			};
			this.getMessages(userInfo,onMessages);
		},
		
		/**
		 * update user's message data by ID
		 * @param messageId, message ID
		 * @param onMessageHandler, function to handle update completion
		 * @param onErrorHandler, function to handler error
		 */
		updateMessageById: function(messageInfo, onUpdateHandler,onErrorHandler){	
        	var onResponse = function(response) {
        		console.log("message response = "+JSON.stringify(response));
    			if(onUpdateHandler){
    				onUpdateHandler();
    			}
    			else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			var messageId = messageInfo.messageId;
			console.log("message ID = "+messageId);
			this.invokeService("/messages/"+messageId, "PUT", messageInfo, onResponse);	
		},
		
		/**
		 * delete user's message data by ID
		 * @param messageId, message ID
		 * @param onMessageHandler, function to handle delete completion
		 * @param onErrorHandler, function to handler error
		 */
		deleteMessageById: function(messageId, onDeletionHandler,onErrorHandler){	
        	var onResponse = function(response) {
        		console.log("message response = "+JSON.stringify(response));
    			if(onDeletionHandler){
    				onDeletionHandler();
    			}
    			else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			console.log("message ID = "+messageId);
			this.invokeService("/messages/"+messageId, "DELETE", {}, onResponse);	
		},
		
		/**
		 * init messages' read state obj, it has two properties: 
		 * newMessageAmount and isReadStateArray
		 * @param userInfo, user info 
		 * @param onHandler, function to handle the state obj
		 * @param onErrorHandler, function to handler error
		 */
		 initMessagesState: function(userInfo, onHandler,onErrorHandler){	
             var onMessagesHandler = function(messages){
                 var messagesState = { indexMap: {}, isReadStateArray: [], requireActionArray: [], deleteFlagArray: [] };
                 var index = 0;
                 var unreadTotal = 0;
                 messages.each(function(message) {
                	 messagesState.indexMap[message.get("messageId")+""] = index;
                     messagesState.isReadStateArray.push(message.get("isRead")? 0 : 1);
                     messagesState.requireActionArray.push(message.get("actionRequired"));    
                     messagesState.deleteFlagArray.push(false);
                     
                     if(!message.get("isRead")){
                    	 unreadTotal++;
                     }
                     index++;
				 });
 				
                 messagesState.newMessageAmount = unreadTotal;
                 if(onHandler){
                    onHandler(messagesState);
                 }
                 else if(onErrorHandler){
         			onErrorHandler(response.errorCode, response.statusMessage);
         		}
	         };
	         
	         this.getMessages(userInfo, onMessagesHandler);			 
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
		        	
					baseUrl = "http://"+apiServer+":"+Constants.DEFAULT_MESSAGES_PORT;
				}else{
			       	var bluemixServer = DataUtils.getLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_ADDRESS);	        	
//		        	var bluemixPort = DataUtils.getLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_PORT);
		        	baseUrl = "http://"+bluemixServer+":"+Constants.DEFAULT_MESSAGES_PORT;
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

	return MessagesUtils;

}); 








