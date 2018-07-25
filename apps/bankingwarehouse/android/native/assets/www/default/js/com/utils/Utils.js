
/* JavaScript content from js/com/utils/Utils.js in folder common */
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
	
], function($, Backbone, Constants){
	
	var Utils = Backbone.Model.extend({},
	
	{
		
		LANGUAGE_ALIGN_KEY : "%languageAlign%",
		LANGUAGE_ALIGN_OPPOSITE_KEY : "%!languageAlign%", //align opposite to the selected language alignment
		LANGUAGE_ALIGN_LEFT_CLASS : "languageLTR",
		LANGUAGE_ALIGN_RIGHT_CLASS : "languageRTL",
		
		/**
		 * check network connection on device
		 * 
		 * @return boolean, if connection available
		 */
		isConnectionAvailable: function(){
			if(navigator.connection){

	            var networkState = navigator.connection.type;

	            if(networkState === Connection.NONE){
	            	return false;
	            }

        	} else{
        		console.log("Navigator connection not available");
        	}
			
			return true;
		},
		
		/**
		 * convert currency to a number
		 * @param currency, string
		 * @return value, number
		 */
		convertCurrencyToNumber: function(currency)
		{
			var value = 0;
			var isNegative = currency.indexOf("(") != -1;
			currency = currency.replace("$", "");
			currency = currency.replace(/[(),]/g, "");
			if(!isNaN(currency)){
				value = Number(currency);
			}
			
			if(isNegative){
				value *= -1;
			}
			return value;
		},
		
		/**
		 * convert a number to a currency string with $ symbol prefix, thousand place separaters and precision to two decimal places
		 * @param number, Number
		 * @return currency, string
		 */
		convertNumberToCurrency: function(number)
		{
			if(isNaN(number)){
				return "$0.00";
			}
			
			//round off the number to max two decimal places
			number = Math.round(number * 100) / 100;
			var decimals = number - Math.floor(number);
			number = Math.floor(number);
				
			var isNegative = number < 0;
			var currency = "$" + String(number).replace(/\-/g, "").split("").reverse().join("").replace(/(.{3}\B)/g, "$1,").split("").reverse().join("");
			
			if(decimals > 0){
				var temp = String(Math.round(decimals * 100));
				currency += "." + (temp.length == 1 ? "0" : "") + temp;
			}
			
			if(currency.indexOf(".") == -1) {
				currency += ".00";
			}
			
			if(isNegative){
				currency = "(" + currency + ")";
			}
			
			return currency;
		},
		
		/**
		 * convert meters to miles
		 * @param meters, number
		 * @return miles, number
		 */
		convertMetersToMiles: function(meters)
		{
			var miles = meters * 0.000621371192;
			return miles;
		},
        
        /**
         * force a number to be double digits if it's not
         * @param num
         * @return numString
         */
        forceDoubleDigits: function(num)
        {
        	var numString = String(num);
        	if(numString.length < 2) {
        		numString = "0" + numString;
        	}
        	return numString;
        },
		
		/**
		 * load a css file by appending it into the head
		 * deprecated, using Modernizr.load instead
		 * @param file, path to the file
		 */
		loadCSSFile: function(file)
		{
			$("head").append("<link>");
		    var css = $("head").children(":last");
		    css.attr({
		    	rel:  "stylesheet",
				type: "text/css",
		    	href: file
		    });
		},
		
		/**
		 * check to see if environment is iOS, iphone+ipad
		 * @param none
		 * @return boolean
		 */
		isiOS: function()
		{
			var isiOS = WL.Client.getEnvironment() == WL.Environment.IPAD || WL.Client.getEnvironment() == WL.Environment.IPHONE;
			return isiOS;
		},
		
		/**
		 * check to see if environment is android
		 * @param none
		 * @return boolean
		 */
		isAndroid: function()
		{
			var isAndroid = WL.Client.getEnvironment() == WL.Environment.ANDROID;
			return isAndroid;
		},
		
		/**
		 * convert inches to a feet string
		 * @param length, int
		 * @return lenString, string
		 */
		convertInchesToFeet: function(length)
		{
			var feet = Math.floor(length/12);
			var inches = length - (feet * 12);
			var lenString = feet + "'" + inches + "\""; 
			return lenString;
		},
		
		/**
		 * find strings and replace with localized strings
		 * @param string, string
		 * @param language, language code string
		 * @return string
		 */
		applyLocalization: function(string, language)
		{
			//convert language alignment classes
			var culture = Globalize.culture(language);
			var languageAlignMatch = new RegExp(Utils.LANGUAGE_ALIGN_KEY, 'g');
			string = string.replace(languageAlignMatch, (culture.isRTL ? Utils.LANGUAGE_ALIGN_RIGHT_CLASS : Utils.LANGUAGE_ALIGN_LEFT_CLASS));
			var languageAlignOppositeMatch = new RegExp(Utils.LANGUAGE_ALIGN_OPPOSITE_KEY, 'g');
			string = string.replace(languageAlignOppositeMatch, (culture.isRTL ? Utils.LANGUAGE_ALIGN_LEFT_CLASS : Utils.LANGUAGE_ALIGN_RIGHT_CLASS));
			
			//translate strings
			var matches = string.match(/%[^>](.*?)%/g); 
			for(var i in matches) 
			{
				var match = matches[i];
				var replacement = Globalize.localize(match, language);
				string = string.replace(match, replacement);
			}
			return string;
		},
		
		/**
		 * get translation for a key for the currently selected language
		 * @param key, String
		 * @return translation, string
		 */
		getTranslation: function(key)
		{
			var model = MobileRouter.getModel();
			var settings = model.get("settings");
			var translation = Globalize.localize(key, settings.get("language"));
			return translation;
		},
		
		/**
		 * returns if the screen is a phone based on the screen size
		 * @param none 
		 * @return isPhone, boolean
		 */
		isPhone: function() {
			var isPhone = $(window).width() <= Constants.RESOLUTION_PHONE;
			return isPhone;
		},
		
		/**
         * launch the gallery browser
         * store image on device and receive uri  
         * @param onImage, function to receive uri to image file on device
         * @param anchor, DOM element
         */
        getImageFromGallery: function(onImage, anchor)
        {
        	var self = this;
        	if(navigator.camera)
			{
				function onSuccess(image) {
				    if(onImage) {
				    	onImage(image);
				    }
				};
				
				function onFail(message) {
				    console.log('Camera failed because: ' + message);
				};
				
				// Take picture using device camera and retrieve path to image in camera roll
				var x = $(anchor).offset().left;
				var y = $(anchor).offset().top;
				var w = $(anchor).width();
				var h = $(anchor).height();
				var popover = new CameraPopoverOptions(x, y, w, h, Camera.PopoverArrowDirection.ARROW_ANY);
				
			    var options = {
			    	sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
			    	quality: 45, // previously 5.  Stay below 50 per Phonegap doc about IOS memory issues
			    	//destinationType: Camera.DestinationType.FILE_URI,
					encodingType: Camera.EncodingType.JPEG,
					popoverOptions : popover,
					//saveToPhotoAlbum: true,
					correctOrientation: true,
					// I get OutOfMemoryError on Samsung Galaxy S3 (and other Android) if I don't specify size.
					// see thread:  https://groups.google.com/forum/?fromgroups=#!topic/phonegap/YWZlnFUfRjE
					targetWidth: 1024,
					targetHeight: 1024
			    };
			    
			    navigator.camera.getPicture(onSuccess, onFail, options);
			    //cant use Camera.DestinationType.DATA_URL because it causes memory issue on the iphone4 
			}
			else{
				console.log("Photo library not available");
			}
        },
        
        /**
         * take a picure with the camera
         * @param onImage, function to receive to image file on device
         */
        takePhoto: function(onImage)
        {
        	if(navigator.camera)
			{
				// Take picture using device camera and retrieve path to image in camera roll
			    var options = {
			    	sourceType : Camera.PictureSourceType.CAMERA,
			    	quality: 45, // previously 5.  Stay below 50 per Phonegap doc about IOS memory issues
			    	destinationType: Camera.DestinationType.FILE_URI,
					encodingType: Camera.EncodingType.JPEG,
					saveToPhotoAlbum: true,
					correctOrientation: true,
					// I get OutOfMemoryError on Samsung Galaxy S3 (and other Android) if I don't specify size.
					// see thread:  https://groups.google.com/forum/?fromgroups=#!topic/phonegap/YWZlnFUfRjE
					targetWidth: 256,
					targetHeight: 256
			    };
			    
			    var onFail = function() {
			    	console.log("Take photo error");
			    };
			    
			    navigator.camera.getPicture(function(image){
			    	if(onImage){
			    		onImage(image);
			    	}
			    }, onFail, options);
			    //cant use Camera.DestinationType.DATA_URL because it causes memory issue on the iphone4 
			}
			else{
				console.log("Camera capture not available");
			}
        },
        
        /**
         * take a picture encoded as base64 string with the camera
         * @param onImage, function to receive to image file on device
         */
        takePhotoBase64: function(onImage)
        {
        	if(navigator.camera)
			{
				// Take picture using device camera and retrieve path to image in camera roll
			    var options = {
			    	sourceType : Camera.PictureSourceType.CAMERA,
			    	quality: 30, // previously 5.  Stay below 50 per Phonegap doc about IOS memory issues
			    	destinationType: Camera.DestinationType.DATA_URL,
					encodingType: Camera.EncodingType.JPEG,
					saveToPhotoAlbum: true,
					correctOrientation: true,
					// I get OutOfMemoryError on Samsung Galaxy S3 (and other Android) if I don't specify size.
					// see thread:  https://groups.google.com/forum/?fromgroups=#!topic/phonegap/YWZlnFUfRjE
					targetWidth: 1600,
					targetHeight: 1600
			    };
			    
			    var onFail = function() {
			    	console.log("Take photo error");
			    };
			    
			    navigator.camera.getPicture(function(image){
			    	if(onImage){
			    		onImage(image);
			    	}
			    }, onFail, options);
			    //cant use Camera.DestinationType.DATA_URL because it causes memory issue on the iphone4 
			}
			else{
				console.log("Camera capture not available");
			}
        },
        
        /**
         * show confirm dialog
         * @param question
         * @param onYes, function
         * @param onNo, function
         * @param title
         * @param labels, comma delimited string
         */
        showConfirmationAlert: function(question, onYes, onNo, title, labels)
        {
        	if(!title) {
        		//title = WL.Client.getAppProperty(WL.AppProperty.APP_DISPLAY_NAME);
        		title = Utils.getTranslation("%alert.title%");
        	}
        	
        	if(!labels) {
        		labels = "Cancel,OK";
        	}
        	
        	var onConfirm = function(index) {
    			if(index == 2 || index === true) {
    				if(onYes) {
    					onYes();
    				}
    			} else {
    				if(onNo) {
    					onNo();
    				}
    			}
    		};
    		
    		if(navigator.notification) {
    			navigator.notification.confirm(question, onConfirm, title, labels);
    		}
    		else {
    			var answer = confirm(question);
    			if(answer) {
    				onConfirm(2);
    			}
    		}
        },
	
		/**
		 * check if a string is null or empty
		 * 
		 * @param text
		 */
		isNullOrEmpty : function(text)
		{
			var isNullOrEmpty = text == null || text == "";
			return isNullOrEmpty;
		},
		
		/**
		 * get current date
		 * 
		 * @return timestamp
		 */
		getCurrentDate : function()
		{
			var now = new Date();
			var timestamp = now.toLocaleString();
			var colonIndex = timestamp.lastIndexOf(":",timestamp.length-1);
			var frontPart = timestamp.substring(0,colonIndex);
			var backPart = timestamp.substring(colonIndex+3);
			var dateTime = frontPart + backPart;
			console.log(dateTime);
			return dateTime;
		},
		
		/**
		 * show loader
		 * @param none
		 */
		showLoader : function() {
			$.mobile.loading( "show" );
		},
		
		/**
		 * hide loader
		 * @param none
		 */
		hideLoader : function() {
			$.mobile.loading( "hide" );
		},
		
		/**
		 * compare two google maps geo points to see if they are the same by rounding them off to the 6 decimal places
		 * @param point1
		 * @param point2
		 * @return isSame, boolean
		 */
		isSameLocation : function(point1, point2) {
			var isSame = false;
			var lat1 = Math.round(point1.lat() * 1e6);
			var lng1 = Math.round(point1.lng() * 1e6);
			var lat2 = Math.round(point2.lat() * 1e6);
			var lng2 = Math.round(point2.lng() * 1e6);
			
			if(Math.abs(lat1-lat2) < 10000 && 
				Math.abs(lng1-lng2) < 10000) {
				isSame = true;
			}
			
			return isSame;
		}, 
		
        
        /**
         * update the number in bubble, if number is 0, then
         * remove the number and class
         * @param bubbleSpan, container associated with the bubble
         * @param number, number of messages
         * @param isSoloMessage, is solo message
         */
        updateBubble: function(bubbleSpan, number, isSoloMessage){
            if(number > 0){
                    if(isSoloMessage){
                            bubbleSpan.addClass("unreadBubble");
                            bubbleSpan.closest("li").addClass("unRead");
                    } else{
                            bubbleSpan.text(number).addClass("notificationBubble");
                    }
            }
            else{
                    bubbleSpan.text("").removeClass("unreadBubble notificationBubble");
                    bubbleSpan.closest("li").removeClass("unRead");
            }
        },
    
	    /**
		* add require user action image
		* @param parent, parent element
		*/
	    requireAction: function(parent){
	            $(parent).children().last().addClass("urgentBubble").text("URGENT");
	    },
        
        /**
         * show alert dialog
         * @param message, message shown
         * @param onOk, function to handle OK event
         * @param title, title of the dialog
         * @param buttonName, button name
         */
        showAlert: function(message, onOk, title, buttonName) {
        	if(!title) {
        		//title = WL.Client.getAppProperty(WL.AppProperty.APP_DISPLAY_NAME);
        		title = Utils.getTranslation("%alert.title%");
        	}
        	if(!buttonName) {
        		buttonName = "OK";
        	}

        	if(navigator.notification) {
        		navigator.notification.alert(message, onOk, title, buttonName);
    		} else {
    			window.alert(message);
    			if(onOk){
    				onOk();
    			}
    		}
        },
        
        /**
         * check if a specified date within a date range
         * 
         * @param checkedDate, specified date
         * @param startDate, start date of the range
         * @param endDate, end date of the range
         */
    	validateDate: function (checkedDate, startDate, endDate) {
    		if (moment(startDate) && moment(endDate)) {
    			if (!moment(startDate).isValid() && moment(checkedDate).isValid()) {
        			if (moment(checkedDate).isBefore(endDate) || moment(checkedDate).isSame(endDate)) {
        				return true;
        			}
        		} else if (moment(startDate).isValid() && !moment(checkedDate).isValid()) {
        			if (moment(checkedDate).isAfter(startDate) || moment(checkedDate).isSame(startDate)) {
        				return true;
        			}
        		} else if (moment(startDate).isValid() && moment(checkedDate).isValid()) {
        			if ((moment(checkedDate).isAfter(startDate) || moment(checkedDate).isSame(startDate)) 
        					&& (moment(checkedDate).isBefore(endDate) || moment(checkedDate).isSame(endDate))) {
        				return true;
        			}
        		} else {
        			return true;
        		}
    		}
    	},
    	
        /**
         * make a phone call to the number
         * 
         * @param number, phone number
         */
    	dialNumber: function(number){
			var onCancel = function() {
			};

			var onCall = function() {
				window.location.href="tel:" + number;
			};
			
    		if(this.isiOS()){
    			if(this.isPhone()){
        			onCall();
    			}else{
    				this.showAlert("This device can not dial number!");
    			}      
    		}
    		else{
    			var cancel = Utils.getTranslation("%label.cancel%");
    			var call = Utils.getTranslation("%label.call%");
    			this.showConfirmationAlert("Are you sure you want to dial "+number+" ?", onCall, onCancel, null, cancel + "," + call);
    		}
    	},
	});

	return Utils;

}); 








