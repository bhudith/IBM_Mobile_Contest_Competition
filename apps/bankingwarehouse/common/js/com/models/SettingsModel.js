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
		"globalize",
		"com/models/Constants",
		"com/utils/DataUtils",
		 
	], function( $, Backbone, G, Constants, DataUtils ) {

    var SettingsModel = Backbone.Model.extend({
		
		initialize: function(attributes, options)
		{
			var properties = {};
			properties[Constants.LS_KEY_LANGUAGE] = DataUtils.getLocalStorageData(Constants.LS_KEY_LANGUAGE) || Constants.SETTINGS_DEFAULT_LANGUAGE;
			properties[Constants.LS_KEY_BPM_TIMEOUT] = DataUtils.getLocalStorageData(Constants.LS_KEY_BPM_TIMEOUT) || Constants.DEFAULT_BPM_TIMEOUT;
			properties[Constants.LS_KEY_BPM_SERVER_HOST] = DataUtils.getLocalStorageData(Constants.LS_KEY_BPM_SERVER_HOST) || Constants.DEFAULT_BPM_SERVER_HOST;
			properties[Constants.LS_KEY_BPM_SERVER_PORT] = DataUtils.getLocalStorageData(Constants.LS_KEY_BPM_SERVER_PORT) || Constants.DEFAULT_BPM_SERVER_PORT;
			this.set(properties);
			
			//trigger language change so transition direction is set correctly
			this.changeLanguage(this.get(Constants.LS_KEY_LANGUAGE));
		},
        
        /**
         * change language
         * also change the the default transition direction
         * @param language, code string
         */
        changeLanguage: function(language)
        {
        	this.set(Constants.LS_KEY_LANGUAGE, language);
        	var culture = Globalize.culture(language);
        	$.mobile.changePage.defaults.reverse = culture.isRTL;
        },
		
		/**
		 * save settings to localStorage
		 * remove from localstorage if data is undefined
		 * @param none
		 */
		save: function()
		{
			DataUtils.setLocalStorageData(Constants.LS_KEY_LANGUAGE, this.get(Constants.LS_KEY_LANGUAGE));
			DataUtils.setLocalStorageData(Constants.LS_KEY_BPM_TIMEOUT, this.get(Constants.LS_KEY_BPM_TIMEOUT));
			DataUtils.setLocalStorageData(Constants.LS_KEY_BPM_SERVER_HOST, this.get(Constants.LS_KEY_BPM_SERVER_HOST));
			DataUtils.setLocalStorageData(Constants.LS_KEY_BPM_SERVER_PORT, this.get(Constants.LS_KEY_BPM_SERVER_PORT));
			
			$(window).trigger(Constants.EVENT_SETTINGS_UPDATE);
			console.log("Settings saved to localStorage.");
		},
		
		/**
		 * reset settings and save
		 * @param none
		 */
		reset: function()
		{
			console.log("Settings reset to default");
			this.set(Constants.LS_KEY_LANGUAGE, WL.App.getDeviceLanguage()); //use device language on reset
			this.set(Constants.LS_KEY_BPM_TIMEOUT, Constants.DEFAULT_BPM_TIMEOUT);
			this.set(Constants.LS_KEY_BPM_SERVER_HOST, Constants.DEFAULT_BPM_SERVER_HOST);
			this.set(Constants.LS_KEY_BPM_SERVER_PORT, Constants.DEFAULT_BPM_SERVER_PORT);
			this.save();
		}
		
    });

    return SettingsModel;

} );