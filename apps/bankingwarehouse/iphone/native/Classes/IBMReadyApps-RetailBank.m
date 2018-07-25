//
//  MyAppDelegate.m
//  IBMReadyApps-RetailBank
//
//

#import "IBMReadyApps-RetailBank.h"
#import "WLWebFrameworkInitResult.h"
#import "Cordova/CDVViewController.h"
#import <IBMPush/IBMPush.h>
#import <IBMPush/IBMPushAppMgr.h>
#import <IBMBluemix/IBMBluemix.h>

@interface Compatibility50ViewController : UIViewController
@end

@implementation Compatibility50ViewController
/**
 In iOS 5 and earlier, the UIViewController class displays views in portrait mode only. To support additional orientations, you must override the shouldAutorotateToInterfaceOrientation: method and return YES for any orientations your subclass supports.
 */
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    return YES;
}
@end

@implementation MyAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions 
{
	BOOL result = [super application:application didFinishLaunchingWithOptions:launchOptions];

    // A root view controller must be created in application:didFinishLaunchingWithOptions:  
	self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    UIViewController* rootViewController = [[Compatibility50ViewController alloc] init];     
    
    [self.window setRootViewController:rootViewController];
    [self.window makeKeyAndVisible];
   
    [[WL sharedInstance] showSplashScreen];
    // By default splash screen will be automatically hidden once Worklight JavaScript framework is complete. 
	// To override this behaviour set autoHideSplash property in initOptions.js to false and use WL.App.hideSplashScreen() API.

    [[WL sharedInstance] initializeWebFrameworkWithDelegate:self];
    
    [[UIAlertView alloc]initWithTitle:@"Push" message:@"hello world" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
    // Override point for customization after application launch.
    [application registerForRemoteNotificationTypes:
     UIRemoteNotificationTypeBadge |
     UIRemoteNotificationTypeAlert |
     UIRemoteNotificationTypeSound];
    
    // Call this method to collect metrics when app is opened by clicking on push notification.
    [[IBMPushAppMgr get] appOpenedFromNotificationClick : launchOptions];

    return result;
    
}

// This method is called after the WL web framework initialization is complete and web resources are ready to be used.
-(void)wlInitWebFrameworkDidCompleteWithResult:(WLWebFrameworkInitResult *)result
{
    if ([result statusCode] == WLWebFrameworkInitResultSuccess) {
        [self wlInitDidCompleteSuccessfully];
    } else {
        [self wlInitDidFailWithResult:result];
    }
}

-(void)wlInitDidCompleteSuccessfully
{
    UIViewController* rootViewController = self.window.rootViewController;

    // Create a Cordova View Controller
    CDVViewController* cordovaViewController = [[CDVViewController alloc] init] ;

    cordovaViewController.startPage = [[WL sharedInstance] mainHtmlFilePath];
     
    // Adjust the Cordova view controller view frame to match its parent view bounds
    cordovaViewController.view.frame = rootViewController.view.bounds;

	// Display the Cordova view
    [rootViewController addChildViewController:cordovaViewController];    
    [rootViewController.view addSubview:cordovaViewController.view];
}

-(void)wlInitDidFailWithResult:(WLWebFrameworkInitResult *)result
{
    UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"ERROR"
                                                  message:[result message]
                                                  delegate:self
                                                  cancelButtonTitle:@"OK"
                                                  otherButtonTitles:nil];
    [alertView show];
}


- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    
}

-(void) application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken{
    
    //_appDelegateVC.myToken = deviceToken.description;
    NSString *myToken = deviceToken.description;
    
    [IBMBluemix initializeWithApplicationId: @"b75791f6-cf90-44bd-b0a1-01b9131755b6" andApplicationSecret: @"2bbe1c4d896655984e1497c7c9223c4bf52ee00c" andApplicationRoute: @"PushDF.mybluemix.net"];
    IBMPush *pushService = [IBMPush initializeService];
    
    //_appDelegateVC.result.text = @"Registering device ... ";
    
    //[_appDelegateVC updateMessage:[NSString stringWithFormat:@"Consumer Id :: %@\n\nAlias :: %@",@"testconsumerId",@"testalias"]];
    
    if(pushService != nil){
        [[pushService registerDevice:@"cxwpad" withConsumerId:@"demouser" withDeviceToken:myToken]  continueWithBlock:^id(BFTask *task) {
            if(task.error){
                //[self.appDelegateVC updateMessage:@"Failure ... "];
                //[self.appDelegateVC updateMessage:task.error.description];
            }else{
                //[self.appDelegateVC updateMessage:@"Success... "];
                NSDictionary *result = task.result;
                //[self.appDelegateVC updateMessage: result.description];
                
                [[pushService getSubscriptions] continueWithBlock:^id (BFTask *task){
                    if(task.error){
                        //[self.appDelegateVC updateMessage:@"Failure during getSubscriptions operation"];
                        //[self.appDelegateVC updateMessage:task.error.description];
                    }else{
                        NSDictionary *subscriptions = [task.result objectForKey:@"subscriptions"];
                        if (subscriptions.count == 0){
                            [[pushService getTags] continueWithBlock:^id (BFTask *task) {
                                //[self.appDelegateVC updateMessage:@"Checking for available tags to subscribe."];
                                if (task.error){
                                    //[self.appDelegateVC updateMessage:@"Failure during getTags operation"];
                                    //[self.appDelegateVC updateMessage:task.error.description];
                                }else{
                                    NSArray* tags =[task.result objectForKey:@"tags"];
                                    NSDictionary *result = task.result;
                                    if(tags.count == 0){
                                        //[self.appDelegateVC updateMessage:@"No tags are available for subscription"];
                                    }else{
                                        //[self.appDelegateVC updateMessage:@"The following tags are available"];
                                        //[self.appDelegateVC updateMessage:result.description];
                                        
                                        //subscribing to the first tag available.
                                        NSString *tag = [tags objectAtIndex:0];
                                        //[self.appDelegateVC updateMessage:@"Subscribing to tag: "];
                                        //[self.appDelegateVC updateMessage:tag];
                                        [[pushService subscribeToTag:tag] continueWithBlock:^id (BFTask *task){
                                            if (task.error){
                                                //[self.appDelegateVC updateMessage:@"Failure during tag subscription operation"];
                                                //[self.appDelegateVC updateMessage:task.error.description];
                                            }else{
                                                //[self.appDelegateVC updateMessage:@"Successfully subscribed to tag:"];
                                                NSDictionary *result = task.result;
                                                //[self.appDelegateVC updateMessage: result.description];
                                            }
                                            return nil;
                                        }];
                                    }
                                }
                                
                                return nil;
                            }];
                            
                        }else{
                            //[self.appDelegateVC updateMessage:@"Device subscribed to the following tag(s)."];
                            //[self.appDelegateVC updateMessage:subscriptions.description];
                        }
                        
                    }
                    return nil;
                }];
            }
            return nil;
        }];
    }else{
        NSLog(@"Push Service is nil. Possible wrong classname");
    }
}

- (void)application:(UIApplication*)application didFailToRegisterForRemoteNotificationsWithError:(NSError*)error
{
    NSLog(@"Failed to get token from APNS, error: %@", error);
}

- (void)application:(UIApplication*)application didReceiveRemoteNotification:(NSDictionary*)userInfo
{
    // add this module to collect metrics for Notification received, Notification displayed and Notification clicked when app is in background.
//    [[IBMPushAppMgr get] notificationReceived : userInfo];
//    
//    if ( application.applicationState == UIApplicationStateInactive || application.applicationState == UIApplicationStateBackground  ) {
//        [[IBMPushAppMgr get]appOpenedFromNotificationClickInBackground : userInfo];
//    }
    
    if (application.applicationState == UIApplicationStateActive){
        UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"Push Notification"
                                                        message:userInfo.description
                                                       delegate:self
                                              cancelButtonTitle:@"OK"
                                              otherButtonTitles:nil];
        [alertView show];
    }
    
    
   // [[WL sharedInstance] sendActionToJS:@"pushtest" withData:userInfo];
}


@end
