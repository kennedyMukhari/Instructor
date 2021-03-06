import { Component, HostListener } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { TabsService } from './core/tabs.service';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
// signal_app_id:string ='d0d13732-1fec-4508-b72b-86eaa0c62aa4';
// firbase_id:string='580007341136';

  public unsubscribeBackEvent: any;

  db = firebase.firestore()
  constructor(
    private platform: Platform,
    public tabs: TabsService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
    public alertCtrl: AlertController,
    public oneSignal: OneSignal,private storage: Storage,
    private screenOrientation: ScreenOrientation,
    
  ) 
  
  
  {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.initializeApp();
    // let status bar overlay webview
    // this.statusBar.overlaysWebView(true);
    // statusBar.styleBlackOpaque();
  }



//   initializeApp() {

//     this.platform.ready().then(() => {
//         this.backButton()
//       firebase.auth().onAuthStateChanged(function (user) {
        
//         if (user) {
//           // User is signed in.
//           this.router.navigateByUrl('main/the-map');
          
//           console.log('Current user in', user.uid);
//         } else {
//           // No user is signed in.
       
          
//           // this.router.navigateByUrl('/');
//         }
// if(this.platform.is('cordova')){
//   this.setupPush();
// }


//       });
//       this.splashScreen.hide();
//     });
//   }

initializeApp() {
  
  this.platform.ready().then(() => {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.backButton()
    this.statusBar.styleDefault();
    this.statusBar.styleLightContent();
    // set status bar to white
    this.statusBar.backgroundColorByHexString('#2E020C');

    // check if the user did the onboarding
    this.storage.get('onboarding').then(val => {
      if (val == 'checked') {
        // check if they are signed in
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            // check if user has profile
            firebase.firestore().collection('drivingschools').doc(user.uid).get().then(res => {
              if (!res.exists) {
                this.router.navigate(['/viewprofile']);
              } else {              
              this.router.navigate(['/main/the-map']);
              }
            })
          } else {
            this.router.navigate(['/login']);
          }
        })
      } else {
        this.router.navigate(['/onboarding']);
      }
    });


    if (this.platform.is('cordova')) {
      this.setupPush();
    }
  });
}


  async backButton() {
    this.platform.backButton.subscribeWithPriority(1, async () => {
      console.log(this.router.url);
      if (this.router.url == '/past-b') {
      this.router.navigate(['main/profile']);
      } else {
        let alerter = await this.alertCtrl.create({
          message: 'Do you want to exit the App?',
          buttons: [{
            text: 'No',
            role: 'cancel'
          },
        {
          text: 'Yes',
          handler: ()=> {
              navigator['app'].exitApp();
          }
        }]
        })
        alerter.present()
      }
  });
  }
  canActivate(route: ActivatedRouteSnapshot): boolean {

    console.log(route);

    let authInfo = {
        authenticated: false
    };

    if (!authInfo.authenticated) {
        this.router.navigate(['login']);
        return false;
    }

    return true;

}
ngOnInit() {
  
 }
 ionViewWillLeave() {
  // Unregister the custom back button action for this page
  this.unsubscribeBackEvent && this.unsubscribeBackEvent();
}


setupPush() {
 
  this.oneSignal.startInit('d0d13732-1fec-4508-b72b-86eaa0c62aa4', '580007341136')

  this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);


  this.oneSignal.handleNotificationReceived().subscribe(data => {
    let msg = data.payload.body;
    let title = data.payload.title;
    let additionalData = data.payload.additionalData;
    this.showAlert(title, msg, additionalData.task);
  });

  this.oneSignal.handleNotificationOpened().subscribe(data => {
    console.log(data)
   
    let additionalData = data.notification.payload.additionalData;

    this.showAlert('Notification opened', 'You already read this before', additionalData.task);
  });

  this.oneSignal.endInit();
}

async showAlert(title, msg, task) {
  const alert = await this.alertCtrl.create({
    header: title,
    subHeader: msg,
    buttons: [
      {
        text: `Action: ${task}`,
        handler: () => {
          // E.g: Navigate to a specific screen
        }
      }
    ]
  })
  alert.present();
}
@HostListener('document:readystatechange', ['$event'])
onReadyStateChanged(event) {
    if (event.target.readyState === 'complete') {
        this.splashScreen.hide();
    }
}
}
