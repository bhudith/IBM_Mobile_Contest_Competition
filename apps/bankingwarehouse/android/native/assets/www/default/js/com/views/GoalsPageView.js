
/* JavaScript content from js/com/views/GoalsPageView.js in folder common */
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
		"com/views/SideMenuPanel",

	], function( $, Backbone, Constants, PageView, Utils, SideMenuPanel ) {

	// Extends PagView class
	var GoalsPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			var self = this;
			PageView.prototype.initialize.call(this, options);

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
			//edit btn handler
			this.$el.on("click", "#editBtn", function(){

				self._showUnsupportedMessage();
				return false;
			});

			//add btn handler
			this.$el.on("click", "#addBtn", function(){
				self._showUnsupportedMessage();
				return false;
			});
			
			//undone btn handler
			this.$el.on("expand", ".undone", function(){
				self._showUnsupportedMessage();
				return false;
			});

		   	//render the side menu
   			new SideMenuPanel({el: self.$el.find("#menuPanel"), currentPageId: "#goals"});

			return this;
		},

		/**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},

		/**
		 * show feature unavailable message
		 * @param none
		 */
		_showUnsupportedMessage: function() {
			var message = Utils.getTranslation("%common.feature.unavailable%");
			Utils.showAlert(message, null);
		},
	});

	// Returns the View class
	return GoalsPageView;
});