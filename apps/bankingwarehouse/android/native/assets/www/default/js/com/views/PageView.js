
/* JavaScript content from js/com/views/PageView.js in folder common */
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
		"handlebars",
		"com/models/Constants",
		"com/utils/Utils",
		"com/utils/TemplateUtils",

	], function( $, Backbone, Handlebars, Constants, Utils, TemplateUtils ) {

	// Extends Backbone.View
	var PageView = Backbone.View.extend( {
		_resizeEvent: "", //string
		_settingsUpdateEvent: "", //string

		_availableStylesheets: [], //var for switch theme
		_activeStylesheetIndex: 0, //var for switch theme

		/**
		 * The View Constructor
		 * @param el, DOM element of the page
		 */
		initialize: function(options)
		{
			var self = this;
			this.$el.on("pagebeforehide", function(event, data){
				self.dispose();
			});

			//handle when window is resized/orientation change
			var resizeTimerId;
			this._resizeEvent = "resize." + this.cid;
			this._settingsUpdateEvent = Constants.EVENT_SETTINGS_UPDATE + "." + this.cid;

			$(window).on(this._resizeEvent, function(){
				clearTimeout(resizeTimerId);
				resizeTimerId = setTimeout(function(){
					self._onResize();
				}, Constants.DEFAULT_WINDOW_RESIZE_DELAY);

			}).on(this._settingsUpdateEvent, function(){
				self._onSettingsUpdate();
			});

			$('link[rel*=style][data-themeroller]').each(function(i) {
				self._availableStylesheets.push(this.getAttribute('data-themeroller'));
				self._activeStylesheetIndex = i;
			});

			this.$el.on("tap", "#switchThemeBtn", function(){
				self._stylesheetToggle();
				return false;
			});
		},

		/**
		 * To loop through available stylesheets
		 * @param none
		 */
		_stylesheetToggle: function()
		{
			this._activeStylesheetIndex ++;
			this._activeStylesheetIndex %= this._availableStylesheets.length;
			this._stylesheetSwitch(this._availableStylesheets[this._activeStylesheetIndex]);
		},

		/**
		 * To switch to a specific named stylesheet
		 * @param styleName
		 */
		_stylesheetSwitch: function(styleName)
		{
			var self = this;

			$('link[rel*=style][data-themeroller]').each(
				function(i)
				{
					this.disabled = true;
					if (this.getAttribute('data-themeroller') == styleName) {
						this.disabled = false;
						self._activeStylesheetIndex = i;
					}
				}
			);
		},

		/**
		 * Renders all of the Category models on the UI
		 * called whenever the collection is changed for this view
		 * @param none
		 */
		render: function() {
			return this; //Maintains chainability
		},

		/**
		 * called when the window is resized or changed orientation
		 * to be overridden by child classes
		 * @param none
		 */
		_onResize: function() {
			$(window).trigger("scroll");
		},

		 /**
		 * called when the settings are updated
		 * to be overridden by child classes
		 * @param none
		 */
		_onSettingsUpdate: function() { },

		/**
		 * do any cleanup, remove window binding here
		 * @param none
		*/
		dispose: function() {
			$(window).off(this._resizeEvent).off(this._settingsUpdateEvent);
		},
	});

	// Returns the View class
	return PageView;
});