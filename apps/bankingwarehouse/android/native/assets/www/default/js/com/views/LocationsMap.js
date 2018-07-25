
/* JavaScript content from js/com/views/LocationsMap.js in folder common */
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
		"com/utils/Utils",
		"com/utils/TemplateUtils",
	], function( $, Backbone, Utils, TemplateUtils) {

	// Extends Backbone.View class
	var LocationsMap = Backbone.View.extend ({

		_map: null, //google maps map object
		_userMarker: null, //array of google maps marker objects
		_bankMarkers: null,  //array of google maps marker objects
		_infoWindow: null,  //google maps infoWindow object
		_onListDataReceived: null,  //function to run when the entire list data is received

		_locations: null, //array of objects from google maps

		_lat: 41.8782,		//default center
		_lng: -87.6297,	 //default center

		/**
		 * The View Constructor
		 *  @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			Utils.showLoader();

			var self = this;

			self._onListDataReceived = options && options.onListDataReceivedHandler ? options.onListDataReceivedHandler : null;
			self._userMarker = null;
			self._bankMarkers = [];	
		},

		/**
		 * Render google map, user and nearby bank branches
		 * @param none
		 */
		render : function() {
			var self = this;

			var center = new google.maps.LatLng(self._lat, self._lng);
			self._map = new google.maps.Map(self.$el.get(0), {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: center,
				zoom: 14
			});

			self._infoWindow = new google.maps.InfoWindow();

			google.maps.event.addListenerOnce(self._map, 'bounds_changed', function(){
				self._getUserLocation();
			});	
		},
		
		/**
		 * get the user's location and plot it to map
		 * @param none
		 */
		_getUserLocation : function() {
			
			var self = this;
			var onSuccess = function(position) {
	        	self._lat = position.coords.latitude;
	        	self._lng = position.coords.longitude;
	        	self._renderLocations();
			    console.log("Model._getUserLocation success: " + position.coords.latitude + ", " + position.coords.longitude);
			};

			function onError(error) {
				var message = Utils.getTranslation("%common.gps.unavailable%");
				Utils.showAlert(message, null);	 
				Utils.hideLoader();
			    console.log("Model._getUserLocation error: " + error.message);
			};
			
			navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout: 5000});
			console.log("Getting user's location...");
		},

		/**
		 * get bank locations and plot them to map
		 * @param none
		 */
		_renderLocations : function() {

			var scope = this;
			if(scope._userMarker){
				scope._userMarker.setMap(null);
			}

			var lat = scope._lat;
			var lng = scope._lng;
			var user = new google.maps.LatLng(lat, lng);

			var image = '../images/locations/icon_user.png';
			scope._userMarker = new google.maps.Marker({
				  position: user,
				  map: scope._map,
				  icon: image
			});

			scope._map.panTo(user);
			
			var bounds = scope._map.getBounds();
			if(bounds){
				var ne = bounds.getNorthEast();
				var neLat = ne.lat();
				var neLng = ne.lng();
				
				var latDiff = (lat - neLat) / 6;
				var lngDiff = (lng - neLng) / 6;
				
				scope._locations = [];
				
				for(var i = 0 ; i < 5 ; i++){
					scope._locations.push(scope._createBankLocation(latDiff, lngDiff, (i+1), (i+1), i * 5));	
					scope._locations.push(scope._createBankLocation(latDiff, lngDiff, 0 - (i+1), (i+1), i * 5 + 1));	
					scope._locations.push(scope._createBankLocation(latDiff, lngDiff, (i+1), 0 - (i+1), i * 5 + 2));	
					scope._locations.push(scope._createBankLocation(latDiff, lngDiff, 0 - (i+1), 0 - (i+1), i * 5 + 3));	
				}
				
				scope._drawLocationMarkers(scope._locations);
				
				if(scope._onListDataReceived){
					scope._onListDataReceived(scope._locations);
				}

			}
		},
		
		/**
		 * create a bank location with randomly generated lat and lng
		 * @param latDiff, lat difference of each step from the center of the map
		 * @param latDiff, lat difference of each step from the center of the map
		 * @param latStep, lat steps from the center
		 * @param lngStep, lng steps from the center
		 * @param locationNo, location number
		 * @return loc, new bank location
		 */
		_createBankLocation : function(latDiff, lngDiff, latStep, lngStep, locationNo) {
			var scope = this;
			
			var lat = scope._lat;
			var lng = scope._lng;
			
			var rLat = lat + latStep * latDiff * Math.random();
			var rLng = lng + lngStep * lngDiff * Math.random();
			
			var loc = {};
			loc["location"] = new google.maps.LatLng(rLat, rLng);
			loc["formatted_address"] = "71 Finders Street";
			loc["formatted_phone_number"] = "(312) 555-55555";
			loc["name"] = "WL Bank #" + locationNo;
			loc["hours"] = "Hours: M-S 9am - 5pm";
			
			return loc;
		},

		/**
		 * draw location markers
		 * @param locations, google map location objects
		 */
		_drawLocationMarkers : function(locations) {
			var scope = this;

			scope._bankMarkers = [];

			var image = '../images/locations/icon_bank.png';
			for (var i=0; i<locations.length; i++) {
				var loc = locations[i];
				var bankIcon = new google.maps.Marker({
					position: loc.location,
					map: scope._map,
					icon: image,
					loc: loc
				});

				var attachClickEvent = function(marker) {
					google.maps.event.addListener(marker, "click", function() {
						//show mock data
						var onTooltip = function(content) {
							scope._infoWindow.setContent(content);
							scope._infoWindow.open(scope._map, marker);
						};

						scope._createTooltipHTML(marker.loc, onTooltip);
					});
				};

				attachClickEvent(bankIcon);
				scope._bankMarkers.push(bankIcon);
			}
			
			Utils.hideLoader();
		},


		/**
		 * pop the info window for the selected marker
		 * @param locName, google maps location name
		 */
		selectMarker : function(locName) {
			for(var i in this._bankMarkers)	{
				var icon = this._bankMarkers[i];
				var loc = icon.loc;
				if(loc.name === locName) {
					google.maps.event.trigger(icon, 'click');
					break;
				}
			}
		},

		/**
		 * create html for bank tooltip
		 * @param location, google maps location result object
		 * @param onTooltipHandler, handler of created tooltip HTML
		 * @return html, String
		 */
		_createTooltipHTML : function(location, onTooltipHandler) {
			var loc = location.location;

			var context = {
				name: location.name,
				lat: loc.lat(),
				lng: loc.lng(),
				hours: location.hours ? location.hours : "",
				phone: location.formatted_phone_number ? location.formatted_phone_number : "",
				address: location.formatted_address ? location.formatted_address : ""
			};

			var onTemplate = function(html) {
				if(onTooltipHandler){
					onTooltipHandler(html);
				}
			};

			TemplateUtils.getTemplate("location_tooltip", context, onTemplate);
		},
	});

	// Returns the View class
	return LocationsMap;

});