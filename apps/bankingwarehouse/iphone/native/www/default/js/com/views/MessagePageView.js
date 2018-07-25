
/* JavaScript content from js/com/views/MessagePageView.js in folder common */
/***********************************************
 *Licensed Materials - Property of IBM
 *6949 - 59L
 *(C) Copyright IBM Corp. 2013, 2014 All Rights Reserved
 *US Government Users Restricted Rights - Use, duplication or  
 *disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 ***********************************************/

define([

		"jquery",
		"backbone",
		"com/models/Constants",
		"com/views/PageView",
		"com/utils/DataUtils",
		"com/utils/Utils",
		"com/models/ServiceProxyFactory",
		"com/utils/MessagesUtils",

	], function( $, Backbone, Constants, PageView, DataUtils, Utils, ServiceProxyFactory, MessagesUtils ) {

	// Extends PagView class
	var MessagePageView = PageView.extend({
		_messageId: "",

		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			this._messageId = options && options.data && options.data.messageId ? options.data.messageId : "";

			var self = this;
			PageView.prototype.initialize.call(this);

			//initialize components so it would be ready for the page
			this.$el.on("pageshow", function(){
				self.render();
			});
		},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function() {
			PageView.prototype.render.call(this);

			var self = this;
			var onMessage = function(message){
				if(message){
					self.$el.find("#title > h1").html(message.get("subject"));
					self.$el.find("#title > p").append(message.get("date"));
					self.$el.find("#messageContent > p").html(message.get("content"));
					
					self.$el.find("#deleteBtn").button("enable");
					
					var messageInfo = {
						    "messageId":self._messageId,
							"subject": message.get("subject"),
			 			    "date": message.get("date"),
			 			    "content": message.get("content"),
			 			    "type": message.get("type"),
			 			    "from": message.get("from"),
			 			    "userId": message.get("userId"),
			 			    "actionRequired": false,
			 			    "isRead": true,
					};
					
					var onUpdateHandler = function(response){
						console.log("update message by messageid successfully.")
					};
					var onErrorHandler = function(errorCode, statusMessage){
						Utils.showAlert(statusMessage);
					};
					if(!message.get("isRead")||message.get("actionRequired")){
						MessagesUtils.updateMessageById(messageInfo, onUpdateHandler, onErrorHandler);
					}
				}
			};
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};
			var userId = DataUtils.getLocalStorageData(Constants.LS_KEY_USERID);
			MessagesUtils.getMessageById({userId: userId},this._messageId, onMessage,onError);

			//delete message handler
			this.$el.on("tap", "#deleteBtn", function(){
				self._delete();
				return false;
			});

			return this; //Maintains chainability
		},

		 /**
		 * do cleanup
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},

		/**
		 * delete a message
		 *
		 * @param none
		 */
		_delete: function() {
			var self = this;
			
			var question = Utils.getTranslation("%message.delete.question%");
			var onYes = function() {
				var onDeletion = function(){
					self._markDeletion(self._messageId);
					$.mobile.changePage("messages.html");
				};
				var onError = function(errorCode, statusMessage){
					Utils.showAlert(statusMessage);
				};
				MessagesUtils.deleteMessageById(self._messageId, onDeletion,onError);
			};
			Utils.showConfirmationAlert(question, onYes);
		},
		
		 /**
		 * mark deletion flag for message and decrease message number by 1
		 * this is mainly used for local json data
		 * 
		 * @param messageId, ID of message deleted
		 */
		_markDeletion: function(messageId) {
			var messagesState = JSON.parse(DataUtils.getLocalStorageData(Constants.LS_KEY_MESSAGES_STATE));
			var index = messagesState.indexMap[messageId+""];
			if(index >= 0){
				messagesState.deleteFlagArray[index] = true;
			}
			
			DataUtils.setLocalStorageData(Constants.LS_KEY_MESSAGES_STATE, JSON.stringify(messagesState));
		},
	});

	// Returns the View class
	return MessagePageView;
});