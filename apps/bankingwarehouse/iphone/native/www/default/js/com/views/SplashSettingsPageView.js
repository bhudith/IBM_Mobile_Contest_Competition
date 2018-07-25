
/* JavaScript content from js/com/views/SplashSettingsPageView.js in folder common */
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
		"cftoaster",
		"com/views/PageView",
		"com/models/Constants",
		"com/utils/Utils",
		"com/utils/DataUtils",
	
	], function( $, Backbone, CFToaster, PageView, Constants, Utils, DataUtils ) {
		
    // Extends PagView class
    var SplashSettingsPageView = PageView.extend({
    	
    	/**
         * The View Constructor
         * @param none
         */
        initialize: function() {
			PageView.prototype.initialize.call(this);
			
			var self = this;
			this.$el.on("pagebeforeshow", function(){
				self.render();
			});
        },
        
        /**
         * Renders the UI
         * @param none
         */
        render: function() {
        	var self = this;
        	
        	//init timeout from local storage. use default if not set
        	var timeout = DataUtils.getLocalStorageData(Constants.LS_KEY_CONNECT_TIMEOUT);
        	if(!timeout){
                timeout = Constants.DEFAULT_CONNECT_TIMEOUT;
                DataUtils.setLocalStorageData(Constants.LS_KEY_CONNECT_TIMEOUT, timeout);
        	}
        	self.$el.find("#timeout").val(timeout);
            
        	//init online from local storage. use default if not set
        	var online = DataUtils.getLocalStorageData(Constants.LS_KEY_IS_ONLINE);
        	if(!online){
        		online = Constants.DEFAULT_IS_ONLINE;
                DataUtils.setLocalStorageData(Constants.LS_KEY_IS_ONLINE, online);
        	}
        	
        	console.log("online mode: "+online);
        	self.$el.find("#online").prop("checked", online == "true").checkboxradio("refresh");
        	
        	var apiServer = DataUtils.getLocalStorageData(Constants.LS_KEY_API_SERVER_ADDRESS);
        	if(!apiServer){
        		apiServer = Constants.DEFAULT_API_SERVER_ADDRESS;
                DataUtils.setLocalStorageData(Constants.LS_KEY_API_SERVER_ADDRESS, apiServer);
        	}
        	
        	var apiPort = DataUtils.getLocalStorageData(Constants.LS_KEY_API_SERVER_PORT);
        	if(!apiPort){
        		apiPort = Constants.DEFAULT_API_SERVER_PORT;
                DataUtils.setLocalStorageData(Constants.LS_KEY_API_SERVER_PORT, apiPort);
        	}
        	
        	var bluemixServer = DataUtils.getLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_ADDRESS);
        	if(!bluemixServer){
        		bluemixServer = Constants.DEFAULT_BLUEMIX_SERVER_ADDRESS;
                DataUtils.setLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_ADDRESS, bluemixServer);
        	}
        	
        	var bluemixPort = DataUtils.getLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_PORT);
        	if(!bluemixPort){
        		bluemixPort = Constants.DEFAULT_BLUEMIX_SERVER_PORT;
                DataUtils.setLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_PORT, bluemixPort);
        	}
        	
        	var usingServerId = DataUtils.getLocalStorageData(Constants.LS_KEY_USING_SERVER_ID);
        	if(!usingServerId){
        		usingServerId = Constants.DEFAULT_USING_SERVER_ID;
                DataUtils.setLocalStorageData(Constants.LS_KEY_USING_SERVER_ID, usingServerId);
        	}
        	
        	self.$el.find("#API_Sever").val(apiServer);
        	self.$el.find("#API_Port").val(apiPort);
        	
        	self.$el.find("#Bluemix_Sever").val(bluemixServer);
        	self.$el.find("#Bluemix_Port").val(bluemixPort);
			
        	self.$el.find("[type=radio]").val(usingServerId == 1 ? "api" : "bluemix");

            if(online == "false" || !online){
        		self.$el.find(".server-setting-radios").checkboxradio("disable");
        		self.$el.find(".server-setting-inputs").textinput("disable");
        	} else{
        		self.$el.find(".server-setting-radios").checkboxradio("enable");
        		self.$el.find(".server-setting-inputs").textinput("enable");
        		if(usingServerId == 2){
            		self.$el.find("#BlueMix").attr("checked", true).checkboxradio("refresh");
            	} else{
        			self.$el.find("#APIManger").attr("checked", true).checkboxradio("refresh");
            	}
        	}
        	
        	this.$el.on("click", "#saveBtn", function(){
        		DataUtils.setLocalStorageData(Constants.LS_KEY_IS_ONLINE,self.$el.find("#online").is(":checked"));
        		DataUtils.setLocalStorageData(Constants.LS_KEY_USING_SERVER_ID,self.$el.find("#APIManger").is(":checked") ? 1 : 2);       		
        		DataUtils.setLocalStorageData(Constants.LS_KEY_CONNECT_TIMEOUT,self.$el.find("#timeout").val());
        		DataUtils.setLocalStorageData(Constants.LS_KEY_API_SERVER_ADDRESS,self.$el.find("#API_Sever").val());
        		DataUtils.setLocalStorageData(Constants.LS_KEY_API_SERVER_PORT,self.$el.find("#API_Port").val());
        		DataUtils.setLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_ADDRESS,self.$el.find("#Bluemix_Sever").val());
        		DataUtils.setLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_PORT,self.$el.find("#Bluemix_Port").val());
        		
        		history.back();
        	});
        	
        	this.$el.on("click", "#resetBtn", function(){
            	var apiServer = Constants.DEFAULT_API_SERVER_ADDRESS;
                DataUtils.setLocalStorageData(Constants.LS_KEY_API_SERVER_ADDRESS, apiServer);   	

            	var apiPort = Constants.DEFAULT_API_SERVER_PORT;
                DataUtils.setLocalStorageData(Constants.LS_KEY_API_SERVER_PORT, apiPort);

                var bluemixServer = Constants.DEFAULT_BLUEMIX_SERVER_ADDRESS;
                DataUtils.setLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_ADDRESS, bluemixServer);


            	var bluemixPort = Constants.DEFAULT_BLUEMIX_SERVER_PORT;
                DataUtils.setLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_PORT, bluemixPort);
                
                var timeout = Constants.DEFAULT_CONNECT_TIMEOUT;
                DataUtils.setLocalStorageData(Constants.LS_KEY_CONNECT_TIMEOUT, timeout);
                    
            	self.$el.find("#API_Sever").val(apiServer);
            	self.$el.find("#API_Port").val(apiPort);
            	self.$el.find("#Bluemix_Sever").val(bluemixServer);
            	self.$el.find("#Bluemix_Port").val(bluemixPort);
            	self.$el.find("#timeout").val(timeout);
        	});
        	
        	
        	this.$el.on("change", "#online", function(){
        		var online = self.$el.find("#online").is(":checked");
        		var usingServerId = DataUtils.getLocalStorageData(Constants.LS_KEY_USING_SERVER_ID);
        		
        		DataUtils.setLocalStorageData(Constants.LS_KEY_IS_ONLINE,online);
        		
        		if(!online){
        			self.$el.find(".server-setting-radios").checkboxradio("disable");
        			self.$el.find(".server-setting-inputs").textinput("disable");
            	} else{
        			self.$el.find(".server-setting-radios").checkboxradio("enable");
        			self.$el.find(".server-setting-inputs").textinput("enable");
            	}
        		
        		self.$el.find("[type=radio]").eq(usingServerId - 1).attr("checked",true).checkboxradio("refresh");
        	});
        	
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
    return SplashSettingsPageView;
});