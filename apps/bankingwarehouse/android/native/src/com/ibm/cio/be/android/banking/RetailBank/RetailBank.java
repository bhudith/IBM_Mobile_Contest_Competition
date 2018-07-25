package com.ibm.cio.be.android.banking.RetailBank;



//import java.util.List;
//import bolts.Continuation;
//import bolts.Task;

import android.app.AlertDialog;
//import android.app.AlertDialog.Builder;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.os.Bundle;


import org.apache.cordova.CordovaActivity;


//import com.ibm.mobile.services.core.IBMBluemix;
//import com.ibm.mobile.services.push.IBMPush;
//import com.ibm.mobile.services.push.IBMPushNotificationListener;
//import com.ibm.mobile.services.push.IBMSimplePushNotification;

import com.worklight.androidgap.api.WL;
import com.worklight.androidgap.api.WLInitWebFrameworkResult;
import com.worklight.androidgap.api.WLInitWebFrameworkListener;

public class RetailBank extends CordovaActivity implements WLInitWebFrameworkListener {
	
//	private IBMPush push = null;
//	private IBMPushNotificationListener notificationListener = null;
//	
//	
//	private List<String> allTags;
//	private List<String> subscribedTags;
//
//
//    private static final String APP_ID = "b75791f6-cf90-44bd-b0a1-01b9131755b6";
//    private static final String APP_SECRET = "2bbe1c4d896655984e1497c7c9223c4bf52ee00c";
//    private static final String APP_ROUTE = "PushDF.mybluemix.net";
//

    
	@Override
	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);

		WL.createInstance(this);

		WL.getInstance().showSplashScreen(this);

		WL.getInstance().initializeWebFramework(getApplicationContext(), this);


//        // Initialize the IBM core backend-as-a-service.
//        IBMBluemix.initialize(this, APP_ID, APP_SECRET,  APP_ROUTE);
//		push = IBMPush.initializeService();
//		push.register("DemoDevice", "DemoUser1").continueWith(new Continuation<String, Void>() {
//            @Override
//            public Void then(Task<String> task) throws Exception {
//                if (task.isFaulted()) {
//                	showSimplePushMessage("Error registering with Push Service. " + task.getError().getMessage() + "\n"
//                            + "Push notifications will not be received.");
//                } else {
//                	showSimplePushMessage("Device is registered with Push Service" + "\n" + "Device Id : " + task.getResult());
//
//
//                    displayTagSubscriptions().continueWith(new Continuation<Void, Void>() {
//
//                        @Override
//                        public Void then(Task<Void> task) throws Exception {
//                            subscribeToTag();
//                            return null;
//                        }
//
//                    });
//                }
//                return null;
//            }
//        });
//		
//		displayTags();
//		
//		notificationListener = new IBMPushNotificationListener() {
//
//			@Override
//			public void onReceive(final IBMSimplePushNotification message) {
//				System.out.println(message);
//				showAlert(message.getAlert());
//
//			}
//
//		};
	}

	/**
	 * The IBM Worklight web framework calls this method after its initialization is complete and web resources are ready to be used.
	 */
 	public void onInitWebFrameworkComplete(WLInitWebFrameworkResult result){
		if (result.getStatusCode() == WLInitWebFrameworkResult.SUCCESS) {
			super.loadUrl(WL.getInstance().getMainHtmlFilePath());
		} else {
			handleWebFrameworkInitFailure(result);
		}
	}

	private void handleWebFrameworkInitFailure(WLInitWebFrameworkResult result){
		AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
		alertDialogBuilder.setNegativeButton(R.string.close, new OnClickListener() {
			@Override
			public void onClick(DialogInterface dialog, int which){
				finish();
			}
		});
		alertDialogBuilder.setTitle(R.string.error);
		alertDialogBuilder.setMessage(result.getMessage());
		alertDialogBuilder.setCancelable(false).create().show();
	}

//	@Override
//	protected void onResume() {
//		super.onResume();
//
//		if (push != null) {
//			push.listen(notificationListener);
//		}
//	}
//
//	@Override
//	protected void onPause() {
//		super.onPause();
//
//		if (push != null) {
//			push.hold();
//		}
//	}
//	
//	void showSimplePushMessage(final String message) {
//
//				System.out.println("Notification Alert : "+ message.toString());
//	}
//	
//	void showAlert(final String message) {
//		runOnUiThread(new Runnable() {
//			@Override
//			public void run() {
//				Builder builder = new AlertDialog.Builder(RetailBank.this);
//				builder.setMessage("Notification Alert : "
//						+ message.toString());
//				builder.setCancelable(true);
//				builder.setPositiveButton("OK",
//						new DialogInterface.OnClickListener() {
//							@Override
//							public void onClick(DialogInterface dialog, int s) {
//							}
//						});
//
//				AlertDialog dialog = builder.create();
//				dialog.show();
//			}
//		});
//	}
//	
//	private void displayTags() {
//		push.getTags().continueWith(new Continuation<List<String>,Void>() { 
//			
//			@Override
//			public Void then(Task<List<String>> task) throws Exception {
//				if(task.isFaulted()) {
//					showSimplePushMessage("Error getting tags. " + task.getError().getMessage());
//					return null;
//				}
//				List<String> tags = task.getResult();
//				showSimplePushMessage("Retrieved Tags : " + tags);
//				allTags = tags;
//				return null;
//			}
//		});		
//	}
//	
//	private Task<Void> displayTagSubscriptions() {
//		
//		return push.getSubscriptions().continueWith(new Continuation<List<String>,Void>() { 
//			
//			@Override
//			public Void then(Task<List<String>> task) throws Exception {
//				if(task.isFaulted()) {
//					showSimplePushMessage("Error getting subscriptions.. " + task.getError().getMessage());
//					return null;
//				}
//				List<String> tags = task.getResult();
//				showSimplePushMessage("Retrieved subscriptions : " + tags);
//				subscribedTags = tags;
//				return null;
//			}
//		});			
//	}
//
//	private void subscribeToTag() {
//		if ((subscribedTags != null && subscribedTags.size() == 0) && (allTags != null && allTags.size() != 0)) {
//			push.subscribe(allTags.get(0)).continueWith(new Continuation<String, Void>() {
//
//                @Override
//                public Void then(Task<String> task) throws Exception {
//                    if (task.isFaulted()) {
//                    	showSimplePushMessage("Error subscribing to Tag.."
//                                + task.getError().getMessage());
//                        return null;
//                    }                    
//                    showSimplePushMessage("Successfully Subscribed to Tag "+task.getResult());
//                    
//                    return null;
//                }
//            });
//			
//		} else {			
//			showSimplePushMessage("Not subscribing to any more tags.");			
//		}
//	}
}

