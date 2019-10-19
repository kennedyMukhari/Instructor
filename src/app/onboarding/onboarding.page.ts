import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  @ViewChild('mySlider', { static: false }) slides: IonSlides;

  constructor(private router: Router,
    private storage: Storage,
    public splashscreen: SplashScreen) {
    //constructor code
    
  }

  ngOnInit() {
    this.splashscreen.hide()
  }

  swipeNext() {
    console.log("Clicked");
    
    this.slides.slideNext();
  }
  goToLogin() {
    this.router.navigate(['login']);
    this.storage.set('onboarding', 'checked');
  }
  goToRegister() {
    this.router.navigate(['login']);
    this.storage.set('onboarding', 'checked');
  }
}
