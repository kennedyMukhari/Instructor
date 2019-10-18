import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { Camera,CameraOptions } from '@ionic-native/Camera/ngx';
import { Router, NavigationEnd } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { PopoverController, IonItemSliding, NavController, ActionSheetController } from '@ionic/angular';
import { PopOverComponent } from '../pop-over/pop-over.component';
import { AlertController } from '@ionic/angular';
import { TabsService } from '../core/tabs.service';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { FormGroup, Validators,FormControl, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
// import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
// import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { LoadingController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { ViewprofilePage } from "../viewprofile/viewprofile.page";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

// NativeGeocoderResult


export class ProfilePage implements OnInit {
  db = firebase.firestore()
  schoolDetails: any = {}
  packsToDisplay = []
  editPacks = false;
  packstoEdit = {
    amount: null,
    code: null,
    name: null,
    number: null
  }
  singlePackAmount = 0;
  segmentVal = 'code01'
  packages = [

    {code01: [ //3
    ],
  price: 0},

    {code08: [ //0
    ],
    price: 0},

    {code10: [ //1
    ],
    price: 0},
    {code14: [ //2
    ],
    price: 0}
   
  ]
  constructor(
     public zone: NgZone,
     public formBuilder: FormBuilder ,
     private geolocation : Geolocation, 
     public forms: FormBuilder,
     public router:Router,
     public camera: Camera,
     public alertController: AlertController,
     public popoverController: PopoverController,
     public renderer: Renderer2, 
     public tabs: TabsService,
     public platform : Platform,
     public elementref: ElementRef, 
     public alert : LoadingController,
     public NavCtrl: NavController,
      public actionSteetCtrl: ActionSheetController
     ) 

     {

    
  }


  ngOnInit() {
    this.zone.run(()=> {
      firebase.auth().onAuthStateChanged(user => {
        this.db.collection('drivingschools').doc(user.uid).get().then(res => {
          this.schoolDetails = res.data();
          this.packages = res.data().packages
          this.packsToDisplay =  this.packages[0].code01
          this.singlePackAmount = this.packages[0].price
          console.log(this.packages);
          console.log('Driving school details', res.data());
          
        })
      })
    })
    
  }
 
  async presentActionSheet(i, p) {
    let packageIndex = i
    let packge = p
    const actionSheet = await this.actionSteetCtrl.create({
      header: 'Albums',
      buttons: [{
        text: 'Delete',
        icon: 'trash',
        handler: async () => {
         let alerter =  await this.alertController.create({
            header: 'Delete Package',
            message:'Are you sure you want to delete this package?',
            buttons: [
              {
                text: 'No',
                role: 'cancel'
              },
              {
                text: 'Sure',
                handler: ()=> {
                  console.log('deleted package , ', i, 'pack', p);
                }
              }
            ]
          })
          alerter.present()
        }
      }, {
        text: 'Edit',
        icon: 'create',
        handler: () => {
          this.zone.run(()=> {
            this.packstoEdit = {
              amount: p.amount,
              code: p.code,
              name: p.name,
              number: p.number
            }
            this.editCodePack()
          })
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        
        }
      }]
    });
    await actionSheet.present();
  }
  editCodePack() {
    this.zone.run(()=>{
      this.editPacks = true;
      switch (this.segmentVal) {
        case 'code01':
            console.log('editting code1');
            // this.editPacks = false;
          break;
          case 'code08':
            console.log('editting code8');
            // this.editPacks = false;
          break;
          case 'code10':
            console.log('editting code10');
            // this.editPacks = false;
          break;
          case 'code14':
            console.log('editting cod14');
            // this.editPacks = false;
          break;
      
        default:
          break;
      }
    })
  }
  addPackage() {
    this.zone.run(()=> {
      console.log('clicked');
      
      this.packstoEdit = {
        amount: null,
        code: null,
        name: null,
        number: null
      }
      // this.editPacks = true
      switch (this.segmentVal) {
        case 'code01':
            console.log('adding code1');
            this.editPacks = false;
          break;
          case 'code08':
            console.log('adding code8');
            this.editPacks = false;
          break;
          case 'code10':
            console.log('adding code10');
            this.editPacks = false;
          break;
          case 'code14':
            console.log('adding cod14');
            this.editPacks = false;
          break;
      
        default:
          break;
      }
    })
  }
  openPackEdit() {
    this.zone.run(()=> {
      this.editPacks = !this.editPacks;
    })
  }
  editPack(p) {
    this.zone.run(()=> {
      this.editPacks = !this.editPacks;
      console.log(p);
    })
    
  }
  segmentChanged(ev) {
    console.log(this.packsToDisplay);
    this.zone.run(()=> {
      
    // ev.detail.value
    switch (ev.detail.value) {
      case 'code01':
        this.packsToDisplay = []
       this.packsToDisplay =  this.packages[0].code01;
       this.singlePackAmount = this.packages[0].price
       console.log(this.packstoEdit);
       
        break;
        case 'code08':
          this.packsToDisplay = []
          this.packsToDisplay =  this.packages[1].code08
          this.singlePackAmount = this.packages[1].price
          console.log(this.packstoEdit);
          break;
          case 'code10':
            this.packsToDisplay = []
            this.packsToDisplay =  this.packages[2].code10
            this.singlePackAmount = this.packages[2].price
            console.log(this.packstoEdit);
            break;
            case 'code14':
              this.packsToDisplay = []
              this.packsToDisplay =  this.packages[3].code14
              this.singlePackAmount = this.packages[3].price
        break;
      default:
        break;
    }
    })
  }
toedit() {
  this.zone.run(()=> {
    console.log('Should navigate');
    this.NavCtrl.navigateForward('viewprofile')
    this.router.navigate(['viewprofile'])
  })
}

    }

    