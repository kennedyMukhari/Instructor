import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { OnboardingPage } from '../onboarding/onboarding.page';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  tsProperty = '';
  public unsubscribeBackEvent: any;
  value : boolean = true;

  constructor( private platform: Platform,  private router: Router, ) { }

   ngOnInit() {
    // this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    // this.unsubscribeBackEvent && this.unsubscribeBackEvent();
  }

//   initializeBackButtonCustomHandler(): void {

//     this.platform.backButton.subscribeWithPriority(1, () => {
//       alert("Do you want to exit the App");
//       navigator['app'].exitApp();
// });
  

//   // this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(999999,  () => {
//   //     // alert("back pressed home" + this.constructor.name);
     
//   // });
//   /* here priority 101 will be greater then 100 
//   if we have registerBackButtonAction in app.component.ts */
// }

  ionViewDidEnter(){
    this.platform.ready().then(() => {
      console.log('Core service init');
      const tabBar = document.getElementById('myTabBar');
       tabBar.style.display = 'flex';
    });
  }

  showTab(){
    this.platform.ready().then(() => {
      console.log('Core service init');
      const tabBar = document.getElementById('myTabBar');
      tabBar.style.display = 'flex';
    });   
  }
instruct(){
  this.router.navigateByUrl('Onboarding');
}



activate(cmd) {

  switch (cmd) {
  

    
    case 'about':
      if (this.tsProperty == 'about'){
        this.tsProperty = ""
      }else{
        this.tsProperty = 'about';

      }
      
      break;

      case 'terms':
if (this.tsProperty =='terms'){
  this.tsProperty =""
}else{

  this.tsProperty = 'terms';
}
        
        break;
        case 'contact':
          if (this.tsProperty =='contact'){
            this.tsProperty =''
          }else{
            this.tsProperty = 'contact';
          }
         
      break;
      case 'disclaimer':
        if (this.tsProperty == 'disclaimer'){
          this.tsProperty =''
        }else{
          this.tsProperty = 'disclaimer';
        }
        
      break;
      case 'safety':
        if (this.tsProperty =='safety'){
          this.tsProperty =''
        }else{
          this.tsProperty = '';
        }
  
      break;
    default:
      break;
  }
}




}
