
/* JavaScript content from js/com/views/MessagesPageView.js in folder common */
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
		"com/utils/Utils",
		"com/utils/DataUtils",
		"com/utils/TemplateUtils",
		"com/views/SideMenuPanel",
		"com/models/ServiceProxyFactory",
		"com/utils/MessagesUtils"

	], function( $, Backbone, Constants, PageView, Utils, DataUtils, TemplateUtils, SideMenuPanel, ServiceProxyFactory, MessagesUtils ) {

	// Extends PagView class
	var MessagesPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param none
		 */
		initialize: function() {
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

			
			// init the messages states and bubbles
			var onHandler = function(stateObj){
					DataUtils.setLocalStorageData(Constants.LS_KEY_MESSAGES_STATE,
										JSON.stringify(stateObj));
			};
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};
			MessagesUtils.initMessagesState({"userId": DataUtils.getLocalStorageData(Constants.LS_KEY_USERID)}, onHandler,onError);
					
			
			// init messages list
			var onMessagesHandler = function(messages){
				
				var messagesState = JSON.parse(DataUtils.getLocalStorageData(Constants.LS_KEY_MESSAGES_STATE));
				
				var items = [];
				messages.each(function(message, i){
					var index = messagesState.indexMap[message.get("messageId")+""];
					if(index >= 0 && !messagesState.deleteFlagArray[index]){
						items.push({subject: message.get("subject"), messageId: message.get("messageId"),
							date: message.get("date"), content: message.get("content"), actionRequired: message.get("actionRequired")});						
					}
				});

				var onTemplate = function(html){
					self.$el.find("#messagesList").append(html).listview("refresh");

					var messagesState = JSON.parse(DataUtils.getLocalStorageData(Constants.LS_KEY_MESSAGES_STATE));

					// update list divider
					Utils.updateBubble(self.$el.find(".notificationBubbleSpan"), messagesState.newMessageAmount);

					var list = self.$el.find(".message");
					list.each(function(idx){
							var messageId = $(this).attr("data-id");
							var index = messagesState.indexMap[messageId];
							if(index >= 0){
								// update the unread bubble span
								var span = $(this).find(".unreadBubbleSpan");
								if(span.length > 0){
										Utils.updateBubble(span, messagesState.isReadStateArray[index], true);
								}
	                            console.log("requireActionArray is "+messagesState.requireActionArray);
								// update the urgent bubble span
								span = $(this).find(".urgentBubbleSpan");
								if(span.length > 0 && messagesState.requireActionArray[index]){
										span.addClass("urgentBubble").text("URGENT");
								}
							}
					});
				};

				var parameters = {messages: items};
				TemplateUtils.getTemplate("messages_list_row", parameters, onTemplate);
			};
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};
			
			var userId = DataUtils.getLocalStorageData(Constants.LS_KEY_USERID);
			MessagesUtils.getMessages({userId: userId}, onMessagesHandler,onError);

			// show one message
			this.$el.on("tap", "#messagesList .message", function(){
				var messageId = $(this).attr("data-id");
				var bubbleSpan = $(this).find(".unreadBubble");
						// update messagesState obj
				var messagesState = JSON.parse(DataUtils.getLocalStorageData(Constants.LS_KEY_MESSAGES_STATE));
				var index = messagesState.indexMap[messageId];
				if(index >= 0){
					if(messagesState.isReadStateArray[index] != 0){ //if unread,change to read and reduce unread total number
						messagesState.isReadStateArray[index] = 0;
						messagesState.newMessageAmount -= 1;
						
						// update the bubble number in list
						Utils.updateBubble(bubbleSpan, 0);

						// update the divider bubble
						Utils.updateBubble(self.$el.find(".notificationBubbleSpan"), messagesState.newMessageAmount);
					}
				}
											
				DataUtils.setLocalStorageData(Constants.LS_KEY_MESSAGES_STATE, JSON.stringify(messagesState));

				$.mobile.changePage("message.html", {data: {messageId: $(this).attr("data-id")}});
				return false;
			});

			//render the side menu
			new SideMenuPanel({el: this.$el.find("#menuPanel"), currentPageId: "#messages"});

			return this; //Maintains chainability
		},

		 /**
		 * do cleanup
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},
	});

	// Returns the View class
	return MessagesPageView;
});