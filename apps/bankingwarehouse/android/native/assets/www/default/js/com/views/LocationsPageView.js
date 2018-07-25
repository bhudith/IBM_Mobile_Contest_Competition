
/* JavaScript content from js/com/views/LocationsPageView.js in folder common */
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
		"com/utils/DataUtils",
		"com/utils/Utils",
		"com/utils/TemplateUtils",
		"com/views/LocationsMap",
		"com/views/SideMenuPanel",
		"com/models/Constants",

	], function( $, Backbone, PageView, DataUtils, Utils, TemplateUtils, LocationsMap, SideMenuPanel, Constants ) {

	// Extends PagView class
	var LocationsPageView = PageView.extend({

		_map: null, //map

		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			var self = this;
			PageView.prototype.initialize.call(this, options);

			//render view on pageshow event
			self.$el.on("pageshow", function(){
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

			//check network
			if(!Utils.isConnectionAvailable()){
				var message = Utils.getTranslation("%locations.network.unavailable%");
				Utils.showAlert(message, null);
			}

			window.map_init=function(){

				//render location list
		  		var onListDataReceived = function(locations){
		  			var list = self.$el.find("#locationsList");
		
			   		var onTemplate = function(html) {
			   			list.append(html);
			   			list.listview("refresh");
			   		};
			
			   		var items = [];
		   			for(var i in locations) {
		   				var location = locations[i];
		   				var context = {
		   						name: location.name,
		   						hours: location.hours ? location.hours : "",
		   						phone: location.formatted_phone_number ? location.formatted_phone_number : "",
		   						address: location.formatted_address ? location.formatted_address : ""
		   					};
		
		   				items.push(context);
			   		}
		
		   			var params = {locations: items};
		   			TemplateUtils.getTemplate("location_list_row", params, onTemplate);
		  		};
		
			   	//init locations map
			   	var mapContainer = self.$el.find("#map");
	   			setTimeout(function(){		
	   		   		self._map = new LocationsMap({el: mapContainer, onListDataReceivedHandler: onListDataReceived});
	   		   		self._map.render();
	   			}, 500);
	
		   		var viewMapToggleHandler = function(){
		   			$("body").scrollTo(0, 500);
		   		};		
			
			   	//location row tap handler, show associated marker on the map
			   	self.$el.on("click", "#locationsList .location", function(){
			   		var name = $(this).attr("data-name");
			   		if(self._map){
			   			viewMapToggleHandler();
			   			self._map.selectMarker(name);
			   		}
				});
			};

			if(!DataUtils.getLocalStorageData(Constants.LS_KEY_LOADMAP_MARK)){
				Utils.showLoader();
				$.getScript("https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places,geometry&sensor=true&callback=map_init").done(function(script, textStatus) {
				  	 DataUtils.setLocalStorageData(Constants.LS_KEY_LOADMAP_MARK,1);
					 console.log("Get script status: "+textStatus);
				  	 Utils.hideLoader();
				  }).fail(function( jqxhr, settings, exception ) {
					 console.log("load mapapi fail");
					 Utils.hideLoader();
				 });
			}else{
				map_init();
			}
			
		   	//render the side menu
   			new SideMenuPanel({el: self.$el.find("#menuPanel"), currentPageId: "#locations"});

			return this; //Maintains chainability
		},
	
		/**
		 * called when the window is resized or changed orientation
		 *
		 * @param none
		 */
		_onResize: function() {
			PageView.prototype._onResize.call(this);

			var self = this;
			var windowH = $(window).height(),
				headerH =  self.$el.find("div[data-role=header]").outerHeight(),
				footerH =  self.$el.find("div[data-role=footer]").outerHeight(),
				height = windowH - headerH - footerH - 250;

			var mapContainer = self.$el.find("#map");
			mapContainer.height(height).width("100%");		
		},

		 /**
		 * do cleanup
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);

			//unbind scroll handler
			$(window).unbind("scroll");
		},
	});

	// Returns the View class
	return LocationsPageView;
});