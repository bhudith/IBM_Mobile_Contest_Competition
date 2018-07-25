
/* JavaScript content from js/main.js in folder common */
function wlCommonInit(){
	/*
	 * Use of WL.Client.connect() API before any connectivity to a Worklight Server is required. 
	 * This API should be called only once, before any other WL.Client methods that communicate with the Worklight Server.
	 * Don't forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
	 *    
	 *    WL.Client.connect({
	 *    		onSuccess: onConnectSuccess,
	 *    		onFailure: onConnectFailure
	 *    });
	 *     
	 */
	
	// Common initialization code goes here
	MQA.startSession({
        versionName: "1.0", // app release version
        android: {
            applicationKey: "4c97d82486a3dab2b7bd4ddaff48566fa446b515",
            versionNumber: "1" // app version number
        },
        ios: {
            applicationKey: "6b6f4759b8891011aea07526ce6701bbc30e2b60",
            versionNumber: "1" // app version number
        },
        mode: "SILENT_MODE",
        shake: true 
    }, function(MQAObj) {
        console.log("MQA is ready");
    });

}

/* JavaScript content from js/main.js in folder iphone */
// This method is invoked after loading the main HTML and successful initialization of the Worklight runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
}