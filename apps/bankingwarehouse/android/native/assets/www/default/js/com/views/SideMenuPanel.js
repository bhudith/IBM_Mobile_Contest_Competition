
/* JavaScript content from js/com/views/SideMenuPanel.js in folder common */
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
		"com/models/ServiceProxyFactory",
		"com/views/PageView",
		"com/utils/TemplateUtils",
		"com/utils/Utils",
		"com/utils/AdapterUtils",
		"com/utils/DataUtils",
		"com/utils/AuthenticateUtils",

	], function( $, Backbone, Constants, ServiceProxyFactory, PageView, TemplateUtils, Utils, AdapterUtils, DataUtils, AuthenticateUtils ) {

	// Extends PagView class
	var SideMenuPanel = PageView.extend({

		_currentPageId: "", // the current page to show

		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			PageView.prototype.initialize.call(this);
			this._currentPageId = options && options.currentPageId ? options.currentPageId : "";
			this.render();
		},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function() {
			PageView.prototype.render.call(this);

			var self = this;

			//render the left side menu
			var onTemplate = function(html) {
				var model = MobileRouter.getModel();
				var settings = model.get("settings");
				var language = settings.get("language");
				var localizedHtml = Utils.applyLocalization(html, language);
				self.$el.html(localizedHtml);
				self.$el.find("#menuList").listview();

				self.$el.on( "panelbeforeopen", function( event, ui ) {
					$(this).find(self._currentPageId + " a").addClass("ui-btn-active");
				} );
				
	   			// tap current page handler
            	self.$el.on("tap", "#menuList li", function(event){
            		if($(this).attr("id") == self._currentPageId.substring(1)){
            			self.$el.panel("close");
                		event.preventDefault();
            		} else if($(this).attr("id") != Utils.getTranslation("%sidemenu.logout%")){
            			self.$el.find(self._currentPageId + " a").removeClass("ui-btn-active");
            		}
            	});
            	
            	self.$el.on("taphold", "#menuList li", function(event){
            		if($(this).attr("id") == self._currentPageId.substring(1)){
            			self.$el.panel("close");
                		event.preventDefault();
            		} else if($(this).attr("id") != Utils.getTranslation("%sidemenu.logout%")){
            			self.$el.find(self._currentPageId + " a").removeClass("ui-btn-active");
            			$.mobile.changePage($(this).find("a").attr("href"));
            		}
            	});
			};
			TemplateUtils.getTemplate("side_menu", {}, onTemplate);

		   	//logout handler
			this.$el.on("tap", ".sbLogout", function(){
				self._logout();
				return false;
			});

			return this; //Maintains chainability
		},

		/**
		 * log out a user
		 * @param none
		 */
		_logout: function()
		{
			var question = Utils.getTranslation("%home.logout.question%");
			var onYes = function() {
				var onSuccess = function() {
					$.mobile.changePage("login.html", {reverse: true});
				};
				var onError = function(errorCode, statusMessage){
					Utils.showAlert(statusMessage);
				};
				AuthenticateUtils.logout(
						[DataUtils.getLocalStorageData(Constants.LS_KEY_USERID),
						 DataUtils.getLocalStorageData(Constants.LS_KEY_TOKEN)]//,
						, onSuccess,onError);
			};
			Utils.showConfirmationAlert(question, onYes);
		},

		 /**
		 * do cleanup
		 * @param none
		 */
		dispose: function() {
			//nothing to do here. page containing the menu should handle this
		},

		_onResize: function() {
			var self = this;
			PageView.prototype._onResize.call(this);

			var windowH = $(window).height();
			$("div[data-role=content]").parent().css("min-height", windowH);
		},

	});

	// Returns the View class
	return SideMenuPanel;

});