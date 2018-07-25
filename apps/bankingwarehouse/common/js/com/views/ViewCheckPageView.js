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
		"com/views/SideMenuPanel",
		"com/utils/Utils",
		"com/utils/DataUtils",

	], function( $, Backbone, Constants, PageView, SideMenuPanel, Utils, DataUtils ) {

	// Extends PagView class
	var ViewCheckPageView = PageView.extend({

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

			self.$el.on("click", "#imgFront", function() {
				var mode = {url:"../images/check.png"};
				$.mobile.changePage("image_check.html", {data:mode, transition:"none"});
			});

			self.$el.on("click", "#imgBack", function() {
				var mode = {url:"../images/check_back.png"};
				$.mobile.changePage("image_check.html", {data:mode, transition:"none"});
			});

			return this;
		},

		/**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},
	});

	// Returns the View class
	return ViewCheckPageView;
});