import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  @ViewChild('mySlider', { static: false }) slides: IonSlides;

  constructor(private router: Router,
    private storage: Storage,
    private screenOrientation: ScreenOrientation,
    public splashscreen: SplashScreen) {
    //constructor code
    
  }

  ngOnInit() {
    setTimeout(()=>{
      this.splashscreen.hide()
          },2000)
    // 
    this.splashscreen.hide()
  }

  swipeNext() {
    console.log("Clicked");
    
    this.slides.slideNext();
  }

  goToLogin() {
    console.log("Went to the login page");
    
    this.router.navigate(['login']);
    this.storage.set('onboarding', 'checked');
  }
  goToRegister() {
    this.router.navigate(['login']);
    this.storage.set('onboarding', 'checked');
  }
}
