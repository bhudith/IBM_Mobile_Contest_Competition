
/* JavaScript content from js/RequireJSConfig.js in folder common */

// Sets the require.js configuration for your application.
require.config( {
	
	  waitSeconds: 0,
	  	
      // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
      paths: {
            // Core Libraries
            "jquery"		: "../libs/jquery/jquery-1.9.1.min",
            "jquerymobile"	: "../libs/jquery.mobile/1.4.2/jquery.mobile-1.4.2.min",
            "underscore"	: "../libs/underscore/underscore-min",
            "backbone"		: "../libs/backbone/backbone-min",
            "handlebars"	: "../libs/handlebars/handlebars",
            "scrollto"		: "../libs/jquery.scrollto/jquery.scrollTo.min",
            "hammer"		: "../libs/hammerjs/1.0.6.dev/hammer.min",
            "jqueryhammer"	: "../libs/hammerjs/1.0.6.dev/jquery.hammer.min",
            "deserialize" 	: "../libs/jquery.deserialize/jquery.deserialize", 
            "cftoaster"		: "../libs/cf_toaster/jquery.cftoaster.1.0.1.min",
            "iscroll4"		: "../libs/iscroll/iscroll-4",
            "iscroll5"		: "../libs/iscroll/iscroll-5",
            "less"			: "../libs/less/less-1.3.3.min",
            "bootstrap"		: "../libs/bootstrap/js/bootstrap.min",
            "globalize"		: "../libs/globalize/globalize",
        	"moment"		: "../libs/moment/moment.min",
        	"d3"			: "../libs/d3/d3.min",
        	"datepicker"	: "../libs/bootstrap.datetimepicker/js/bootstrap-datetimepicker.min",
      },

      // Sets the configuration for your third party scripts that are not AMD compatible
      shim: {
            "backbone"		: {
            	"deps"		: [ "underscore", "jquery" ],
                "exports"	: "Backbone"  //attaches "Backbone" to the window object
            },
            
            "handlebars"	: {
				"deps" 		: ["jquery"],
				"exports" 	: "Handlebars"
			},
			
			"underscore"	: {
            	"exports"	: "_"
            },
            
            "d3"			: {
                exports		: 'd3'
            },
            
            "scrollto"		: ["jquery"],
            "jqueryhammer"	: ["jquery", "hammer"],
            "easing"		: ["jquery"],
            "deserialize"	: ["jquery"],
            "cftoaster"		: ["jquery"],
            "bootstrap"		: ["jquery"],
      } // end Shim Configuration
});

// Includes File Dependencies
require([
		"jquery", 
		"backbone",
		"deserialize",
		"bootstrap",
		"less",
		"globalize",
		"com/routers/MobileRouter", 
		"com/models/Constants",
	], function( $, Backbone, Deserialize, Bootstrap, Less, G, MobileRouter, Constants ) {
	
	$( document ).on( "mobileinit",
		// Set up the "mobileinit" handler before requiring jQuery Mobile's module
		function() {
			// Prevents all anchor click handling including the addition of active button state and alternate link bluring.
			//$.mobile.linkBindingEnabled = false;

			// Disabling this will prevent jQuery Mobile from handling hash changes
			//$.mobile.hashListeningEnabled = false;
			
			console.log("mobile init!");
			
			// Instantiates a new Backbone.js Mobile Router
			window.MobileRouter = new MobileRouter();
			
			//disable selection for any element on the page
			document.onselectstart = function(){ return false; };
			
			//make sure scroll event fires sooner on ios
			document.addEventListener("touchmove", function(){$(window).trigger("scroll");}, false);
			document.addEventListener("scroll", function(){$(window).trigger("scroll");}, false);
			
			//set default page transition
			$.mobile.defaultPageTransition = Constants.DEFAULT_PAGE_TRANSITION;
			
			//TODO: reset state of app, need to remove for production 
			//window.localStorage.clear();
	});
	
	//need to be loaded after mobileinit has been set to be able to listen for the event
	require( [ "jquerymobile" ], function() {
	});
});