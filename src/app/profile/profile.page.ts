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
import { DataSavedService } from '../../app/data-saved.service'


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

// NativeGeocoderResult

export class ProfilePage implements OnInit {

  average = 0;
 ratingTotal = 0
  db = firebase.firestore()
  schoolDetails: any = {}
  packsToDisplay = []
  editPacks = false;
  // average = 0;
  // ratingTotal = 0
  DrivingSchoolOwnerDetails = [];
  
  packstoEdit = {
    amount: '',
    code: '',
    name: '',
    number: ''
  }
  
  singlePackAmount = 0;
  segmentVal = 'code01';

   packages = [

    {code01: [
       //3
     
    ],
  price: 0
},

    {code08: [ //0
     
    ],
    price: 0
  },

    {code10: [ //1

     
    ],
    price: 0
  },

    
    {code14: [ //2

     
    ],
    price: 0
  }

];

counter : number = 0;
  showPrice : boolean = false;


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
      public actionSteetCtrl: ActionSheetController,
      public Mypackages : DataSavedService
     ) 

     {
      
  }


  ngOnInit() {
    this.packsToDisplay = [];
    this.zone.run(()=> {
      this.calculateAverage()
      // firebase.auth().onAuthStateChanged(user => {
      //   this.db.collection('drivingschools').doc(user.uid).get().then(res => {
      //     this.schoolDetails = res.data();
      //     this.packages = res.data().packages
      //     this.packsToDisplay = []
      //     this.packsToDisplay =  this.packages[0].code01
      //     this.singlePackAmount = this.packages[0].price
      //     console.log(this.packages);
      //     console.log('Driving school details', res.data());
          
      //   })
      // })
    })

    // this.db.collection('drivingschools').onSnapshot(snapshot => {
    //   this.DrivingSchoolOwnerDetails = [];
    //   snapshot.forEach(doc => {
    
       
    //     if (doc.data().schooluid === firebase.auth().currentUser.uid) {
    //       console.log("Data data", doc.data());
    //       this.DrivingSchoolOwnerDetails.push({ docid: doc.id, doc: doc.data() });
    //     }
    //   });
    // });

  }

 
  ionViewWillEnter(){
     
    firebase.auth().onAuthStateChanged(user => {
      this.db.collection('drivingschools').doc(user.uid).get().then(res => {
        // this.schoolDetails = res.data();
        this.packages = res.data().packages
        this.packsToDisplay = []
        this.packsToDisplay =  this.packages[0].code01
        this.singlePackAmount = this.packages[0].price
        console.log(this.packages);
        console.log('Driving school details', res.data());
        
      })
    })
  

  this.db.collection('drivingschools').onSnapshot(snapshot => {
    this.schoolDetails = {};
    snapshot.forEach(doc => {
  
     
      if (doc.data().schooluid === firebase.auth().currentUser.uid) {
        console.log("Data data", doc.data());
        // this.DrivingSchoolOwnerDetails.push({ docid: doc.id, doc: doc.data() });
        this.schoolDetails = doc.data();
      }
    });
  });

  }

  // calculateAverage(){
  //   firebase.auth().onAuthStateChanged(user => {
  //     this.db.collection('reviews').where('schooluid','==',user.uid).onSnapshot(snap => {
  //       this.ratingTotal = 0
  //       snap.forEach(doc => {
  //         this.ratingTotal = this.ratingTotal + doc.data().rating
  //       })
  //       this.average = this.ratingTotal / snap.size;
  //     })
  //   })
  // }


  async Logout() {

  
    console.log('My value from the profile is ');
            const alert = await this.alertController.create({
              header: '',
              message: 'Do you want to Logout?',
              buttons: [
                {
                  text: 'No',
                  role: '',
                  cssClass: '',
                  handler: (blah) => {
                    
                  }
                }, {
                  text: 'Yes',
                  handler: () => {
                    console.log('You are logged out');
                    firebase.auth().signOut().then((res) => {
                     console.log(res);
                     this.schoolDetails = {};
                      this.router.navigateByUrl('/login');
                    })
                  }
                }
              ]
            });
        
            await alert.present();

            // this.packsToDisplay = [];
          
}


goToReviews(){
this.router.navigateByUrl('past-b')
}


  async presentActionSheet(i, p) {


    let packageIndex = i
    let packge = p
    const actionSheet = await this.actionSteetCtrl.create({
      header: p.name,
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
                handler: async()=> {
                  console.log('deleted package , ', i, 'pack', p);
                
                    this.packsToDisplay.splice(i, 1);
                      const alert = await this.alertController.create({
                        header: 'Deleted Successfully.',
                        subHeader: '',
                        message: '',
                        buttons: ['OK']
                      });
                    
                      await alert.present();

                      this.db.collection('drivingschools').doc(firebase.auth().currentUser.uid).set({        
                        packages : this.packages,                    
                      }, { merge: true }).then(res => {           
                       console.log(res);
                      }).catch(error => {
                        console.log('Error');
                      });
                    
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
           
            this.packsToDisplay[i] = this.packstoEdit;
            this.packsToDisplay.splice(i, 1); 
            // this.packages[0].code01.push(this.packstoEdit);
            console.log('rrrrrrrrrrrr', this.packsToDisplay[i]);
            
            this.editCodePack()
          });
  
          // this.db.collection('drivingschools').doc(firebase.auth().currentUser.uid).set({        
          //   packages : this.packages,                    
          // }, { merge: true }).then(res => {           
          //  console.log(res);
          // }).catch(error => {
          //   console.log('Error');
          // });
          
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

  closeEdit(){
    this.addPackage();
    this.editPacks = false;
  }

  addPackage() {

  
 
    this.zone.run(async()=> {
      // checking what code is being added
      switch (this.segmentVal) {
        case 'code01':
          // set the active code to edit
            this.packstoEdit.code = 'code01';
            // check if the amount is provided
            if(this.singlePackAmount != 0){
              // check if package details are provided
              if(this.packstoEdit.name != '' && this.packstoEdit.amount != '' && this.packstoEdit.number != ''){
                // check if length of array is full
                   if(this.packages[0].code01.length < 4) {
                    this.packages[0].code01.push(this.packstoEdit);
                    this.packages[0].price = this.singlePackAmount ;
    
                  this.db.collection('drivingschools').doc(firebase.auth().currentUser.uid).set({
                    packages : this.packages,  
                                    
                  }, { merge: true }).then(res => {           
                   console.log(res);
                  }).catch(error => {
                    console.log('Error');
                  });
      
                  this.editPacks = false;
                  console.log('adding code1');
                   }else{
                    const alert = await this.alertController.create({
                      message: 'Only 4 packages allowed',
                      buttons: ['OK']
                    });
                    await alert.present();
                   }    
              }else{
                const alert = await this.alertController.create({
                  message: 'Fields cannot be empty!',
                  buttons: ['OK']
                });
                // await alert.present();
              }

            }else{
              const alert = await this.alertController.create({
                message: 'Please enter the price.',
                buttons: ['OK']
              });
              await alert.present();
            }
           
          break;
          case 'code08':

              this.packstoEdit.code = 'code08';

              if(this.singlePackAmount != 0){

                if(this.packstoEdit.name != '' && this.packstoEdit.amount != '' && this.packstoEdit.number != ''){
                  
                  if(this.packages[1].code08.length < 4){
                    this.packages[1].code08.push(this.packstoEdit);
                    this.packages[1].price = this.singlePackAmount ;
  
                this.db.collection('drivingschools').doc(firebase.auth().currentUser.uid).set({        
                  packages : this.packages
                                  
                }, { merge: true }).then(res => {           
                 console.log(res);
                }).catch(error => {
                  console.log('Error');
                });
              this.editPacks = false;
                    
                  }else{
                    const alert = await this.alertController.create({
                      message: 'Only 4 packages allowed',
                      buttons: ['OK']
                    });
                    await alert.present();
                  }

                  

                }else{
                  const alert = await this.alertController.create({
                    message: 'Fields cannot be empty!',
                    buttons: ['OK']
                  });
                  await alert.present();
                }
  
              }else{
                const alert = await this.alertController.create({
                  message: 'Please enter the price.',
                  buttons: ['OK']
                });
                await alert.present();
              }
           
          break;
          case 'code10':
              this.packstoEdit.code = 'code10';

              if(this.singlePackAmount != 0){

                if(this.packstoEdit.name != '' && this.packstoEdit.amount != '' && this.packstoEdit.number != ''){

                  if(this.packages[2].code10.length < 4){
                    this.packages[2].code10.push(this.packstoEdit);
                    this.packages[2].price = this.singlePackAmount ;
  
                    this.db.collection('drivingschools').doc(firebase.auth().currentUser.uid).set({        
                      packages : this.packages
                                    
                    }, { merge: true }).then(res => {           
                     console.log(res);
                    }).catch(error => {
                      console.log('Error');
                    });
      
      
                  console.log('adding code10');
                  this.editPacks = false;
                    
                  }else{
                    const alert = await this.alertController.create({
                      message: 'Only 4 packages allowed',
                      buttons: ['OK']
                    });
                    await alert.present();
                  }
              
                  
            
                }else{
                  const alert = await this.alertController.create({
                    message: 'Fields cannot be empty!',
                    buttons: ['OK']
                  });
                  await alert.present();
                }
  
              }else{
                const alert = await this.alertController.create({
                  message: 'Please enter the price.',
                  buttons: ['OK']
                });
                await alert.present();
              }

              
          break;
          case 'code14':
              this.packstoEdit.code = 'code14';

              if(this.singlePackAmount != 0){

                if(this.packstoEdit.name != '' && this.packstoEdit.amount != '' && this.packstoEdit.number != ''){
              

                  if(this.packages[3].code14.length < 4){
                    this.packages[3].code14.push(this.packstoEdit);
                    this.packages[3].price = this.singlePackAmount ;
  
                
                    this.db.collection('drivingschools').doc(firebase.auth().currentUser.uid).set({        
                     packages : this.packages
                                 
                   }, { merge: true }).then(res => {           
                    console.log(res);
                   }).catch(error => {
                     console.log('Error');
                   });
     
     
                 console.log('adding cod14');
                 this.editPacks = false;
                  }else{
                    const alert = await this.alertController.create({
                      message: 'Only 4 packages allowed',
                      buttons: ['OK']
                    });
                    await alert.present();
                  }
                }else{
                  const alert = await this.alertController.create({
                    message: 'Fields cannot be empty!',
                    buttons: ['OK']
                  });
                  await alert.present();
                }
  
              }else{
                const alert = await this.alertController.create({
                  message: 'Please enter the price.',
                  buttons: ['OK']
                });
                await alert.present();
              }

            
          break;
      
          default:
          break;
      }
    })

    console.log("Data added",  this.packages);
    this. packstoEdit = {
      amount: '',
      code: '',
      name: '',
      number: ''
    }

 
    
  }


  openPackEdit() {  

    if(this.packsToDisplay.length > 0){
      console.log("Length is > 0 i Hide price");
      
      this.showPrice = false;
    }else{
      console.log("Length is < 0 i show price");
      this.showPrice = true
    }
    
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
        this.packsToDisplay = this.packages
        if(this.packages[1].code01.length>0) {
                 this.packsToDisplay =  this.packages[0].code01;
       this.singlePackAmount = this.packages[0].price
        }

       console.log(this.packstoEdit);
       
        break;
        case 'code08':
          this.packsToDisplay = []
          if(this.packages[1].code08.length>0) {
            console.log('pac');
            
            this.packsToDisplay =  this.packages[1].code08
          this.singlePackAmount = this.packages[1].price
          } else {
            console.log('pack undefined');
            
          }
          console.log(this.packstoEdit);
          break;
          case 'code10':
            this.packsToDisplay = []
            if(this.packages[1].code10.length>0) {
              this.packsToDisplay =  this.packages[2].code10
            this.singlePackAmount = this.packages[2].price
            }
            
            console.log(this.packstoEdit);
            break;
            case 'code14':
              this.packsToDisplay = []
              if(this.packages[1].code14.length>0) {
                this.packsToDisplay =  this.packages[3].code14
              this.singlePackAmount = this.packages[3].price
              }
              
        break;
      default:
        break;
    }
    
    }
    )   

}


toedit() {
  this.zone.run(()=> {
    console.log('Should navigate');
    this.NavCtrl.navigateForward('viewprofile')
    this.router.navigate(['viewprofile'])
  })
}
calculateAverage(){
  firebase.auth().onAuthStateChanged(user => {
    this.db.collection('reviews').where('schooluid','==',user.uid).onSnapshot(snap => {
      this.ratingTotal = 0
      snap.forEach(doc => {
        this.ratingTotal = this.ratingTotal + doc.data().rating
      })
      this.average = this.ratingTotal / snap.size;
    })
  })
}

}
