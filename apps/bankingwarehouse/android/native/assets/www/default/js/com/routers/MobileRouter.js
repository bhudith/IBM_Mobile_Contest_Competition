
/* JavaScript content from js/com/routers/MobileRouter.js in folder common */
/***********************************************
 *Licensed Materials - Property of IBM
 *6949 - 59L
 *(C) Copyright IBM Corp. 2013, 2014 All Rights Reserved
 *US Government Users Restricted Rights - Use, duplication or  
 *disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 ***********************************************/

/**
 * this is a singleton class
 * initialize the view class based on the loaded page
 */
define([ 
	
		"jquery",
		"backbone", 
		"com/models/Constants",
		"com/models/Model",
		"com/utils/DataUtils",
		"com/utils/Utils",
		
	], function( $, Backbone, Constants, Model, DataUtils, Utils ) {

    // Extends Backbone.Router
    var MobileRouter = Backbone.Router.extend({
		
		_pageViewClasses: null, //stores loaded pageview classes, object {"key" : PageView};
		_model: null, //Model object
		
		currentPage: null, //current page view class
		
        /**
         * The Router constructor
         * @param none
         */ 
        initialize: function() 
        {
            var self = this;
            
            require( Constants.VIEW_CLASSES, function(){

				self._pageViewClasses = {};
				for(var i=0; i<Constants.VIEW_CLASSES.length; i++)
				{
					var className = Constants.VIEW_CLASSES[i];
					self._pageViewClasses[className] = arguments[i];
				}
            
	            //initialize the view class associate with each view
	            $(document).on("pagebeforecreate", function(event, data){
	            	self.currentPage = null;
					//var page = $("div[data-role=page]").last();
					var page = event.target;
					if(page)
					{
						self._resetBackButton();
						var pageClassName = $(page).attr("data-class");
		
						//process params from url and pass to new page
						var d;
						var url = event.target.baseURI; //data && data.dataUrl
						if(url.indexOf("?") != -1) {
							var start = url.indexOf("?") + 1;
							d = $.deserialize(url.substring(start));
						}
		
						if(pageClassName)
						{
							console.log("Initializing " + pageClassName);
							if(self._pageViewClasses.hasOwnProperty(pageClassName))
							{
								var PageClass = self._pageViewClasses[pageClassName];
								self.currentPage = new PageClass( {el: page, data: d} );
							}
							else
							{
								throw new Error("PageView Class needs to be added to Constants.VIEW_CLASSES!");
							}
						}
						
						//parse page content as template, and apply localization
						if(self._model)
						{
							var settings = self._model.get("settings");
			    			var culture = Globalize.culture(settings.get("language"));
			    			
			    			//parse page html as handlebars template to allow for localization
			    			var template = Handlebars.compile($(page).html());
			    			var params = {isRTL: culture.isRTL, isLTR: !culture.isRTL};
							var html = template(params);
			    			var localizedHTML = Utils.applyLocalization(html, settings.get("language"));
							$(page).html(localizedHTML);
						}
					}
					
				}).on("pageshow", function(){
					
					//trigger to fix JQM page height
					$(window).trigger("resize");
					
				}).on("pagechange", function(event, data){
					
					//detect if current page is the placeholder page
					var toPageId = data.toPage.attr("id");
					console.log("Page Change: " + toPageId);
					
				});
				
				$(window).on("resize", function(){
					
					//fix JQM applying min-height to pages on show, only fix for pages without headers and footers
					var page = $("div[data-role=page]").last();
					var doFix = $(page).find("div[data-role=header], div[data-role=footer]").size() == 0;
					
					if(doFix)
					{
						$(page).css("min-height", "100%");
						setTimeout(function(){
							$(page).css("min-height", "100%");
						}, 250);
					}
					
				});
				
	            //go to index page and init components
	            $.mobile.changePage("pages/index.html", {transition: "none"});
	            
	            //fix for spinner on android after splash screen
	            /*
	        	if(typeof cordova != "undefined" && Utils.isAndroid()) {
	        		cordova.exec(null, null, "NativeBusyIndicator", "hide", [WL.ClientMessages.loading]);
	        	}
	        	*/
	            
	            // Tells Backbone to start watching for hashchange events
            	//Backbone.history.start();
            	
            });
        },
        
        /**
         * initialize singleton objects 
         * should be called after splash page so urls for templates can stay consistent
         * @param onInit, function
         */
        initComponents: function(onInit) 
        {
        	if(!this._model)
        	{
				//initialize localization and load default language
				var self = this;
				var onLocalization = function() 
				{
					var onLanguage = function() {
						if(onInit) {
							onInit();
						}
					};
					
					self._model = new Model({}); //init model first so selected language can be retrieved
					var settings = self._model.get("settings");
					var language = settings.get("language");
					DataUtils.loadLanguage(language, onLanguage);
				};
				DataUtils.initLocalization(onLocalization);
        	}
        	else {
        		if(onInit) {
					onInit();
				}
        		console.log("Cannot initialize singleton components, components already initialized.");
        	}
        },
        
        /**
         * return the reference to the model
         * @param none
         * @return model, Model object
         */
        getModel: function() {
        	return this._model;
        },
        
        /**
         * show the splash screen
         * @param none
         */
        showSplash: function() {
        	$.mobile.changePage("splash.html", {transition: "pop"});
        },
        
        /**
         * get the id of the current page DOM element
         * @param none
         * @return id, string
         */
        getCurrentPageId: function() 
        {
        	var id;
        	var page = this.currentPage.$el;
        	if(page) {
        		id = $(page).attr("id");
        	}
        	return id;
        },
        
        /**
		 * quit the app, if app does have the kill api, just log user out
		 * @param none
		 */
		killApp: function() 
		{
			//WL.App.close();
			if(navigator.app){
				navigator.app.exitApp();
				return false;
			}
			
			this.showSplash();
		},
		
		/**
		 * reset the back button handler
		 * @param none
		 */
		_resetBackButton: function() {
			$(document).off("backbutton");
		},

    });

    // Returns the Router class
    return MobileRouter;

} );