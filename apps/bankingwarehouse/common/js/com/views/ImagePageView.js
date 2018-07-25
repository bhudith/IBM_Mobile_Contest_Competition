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

	], function( $, Backbone, Constants, PageView ) {

	// Extends PagView class
	var ImagePageView = PageView.extend({

		_imageurl : "",

		/**
		 * The View Constructor
		 *  @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			var self = this;
			this._imageurl = options && options.data && options.data.url ? options.data.url : "";
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

			if(self._imageurl){
				self.$el.find("#imageid").attr("src", self._imageurl);
			}

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
	return ImagePageView;

});