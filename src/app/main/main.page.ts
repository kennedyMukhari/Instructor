import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { NavController,  AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  

 subscribe:any;


  constructor( public platform:Platform, public splashscreen: SplashScreen) {   


  }

  ngOnInit() {
    this.splashscreen.hide()
  }

  ionViewDidLoad(){
 
  }

 


 

}
