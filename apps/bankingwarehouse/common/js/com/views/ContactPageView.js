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
		"com/views/PageView",
		"com/views/SideMenuPanel",
		"com/utils/TemplateUtils",
		"com/utils/Utils",
		"com/models/Constants",

	], function( $, Backbone, PageView, SideMenuPanel, TemplateUtils, Utils, Constants ) {

	// Extends PagView class
	var ContactPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param none
		 */
		initialize: function() {
			var self = this;
			PageView.prototype.initialize.call(this);

			self.$el.on("pageshow", function(){
				self.render();
			});
		},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function() {
			var self = this;
			PageView.prototype.render.call(this);

			var number = "" ;
			self.$el.on("tap", ".phone", function() {
				number = $(this).find(".phoneNum").text();
                Utils.dialNumber(number);
			});

			//render the left side menu
			new SideMenuPanel({el: this.$el.find("#menuPanel"), currentPageId: "#contact"});

			return this; //Maintains chainability
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
	return ContactPageView;

});