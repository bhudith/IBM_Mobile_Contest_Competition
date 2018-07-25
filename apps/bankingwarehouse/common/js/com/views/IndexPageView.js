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

	], function( $, Backbone, PageView ) {

	// Extends PagView class
	var IndexPageView = PageView.extend({

		/**
		 * The View Constructor
		 *  @param none
		 */
		initialize: function() {
			PageView.prototype.initialize.call(this);

			//initialize components so it would be ready for the page
			this.$el.on("pageshow", function(){
				var onInit = function() {
					$.mobile.loading("hide");
					MobileRouter.showSplash();
				};
				$.mobile.loading("show");
				MobileRouter.initComponents(onInit);
			});

			//kill the app on back button
			$(document).on("backbutton", function(){
				MobileRouter.killApp();
			});
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
	return IndexPageView;

});