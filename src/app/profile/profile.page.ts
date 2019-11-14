import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { Router, NavigationEnd } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { PopoverController, IonItemSliding, NavController, ActionSheetController } from '@ionic/angular';
import { PopOverComponent } from '../pop-over/pop-over.component';
import { AlertController } from '@ionic/angular';
import { TabsService } from '../core/tabs.service';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { FormGroup, Validators, FormControl, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
// import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
// import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { LoadingController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { ViewprofilePage } from "../viewprofile/viewprofile.page";
import { DataSavedService } from '../../app/data-saved.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

// NativeGeocoderResult

export class ProfilePage implements OnInit {
  loaderAnimate = true;
  average = 0;
  ratingTotal = 0
  db = firebase.firestore()
  schoolDetails = {
    address: null,
    allday: null,
    avarage: null,
    cellnumber: null,
    city: null,
    closed: null,
    coords: {
      lat: null,
      lng: null
    },
    desc: null,
    email: null,
    image: 'https://firebasestorage.googleapis.com/v0/b/step-drive-95bbe.appspot.com/o/1.png?alt=media&token=c023a9e6-a7a0-4af9-bd13-9778f2bea46d',
    open: null,
    packages: {
      code01: new Array,
      code01Price: 0,
      code08: new Array,
      code08Price: 0,
      code10: new Array,
      code10Price: 0,
      code14: new Array,
      code14Price: 0
    },
    schoolname: null,
    schooluid: null,
    tokenId: null,
  }
  packsToDisplay = []
  editPacks = false;

  boolean: boolean = true;

  myValue: boolean = false;

  // average = 0;
  // ratingTotal = 0
  DrivingSchoolOwnerDetails = [];
  segmentVal: string;
  singlePackAmount = null;
  packstoEditIndex = null;
  packstoEdit = {
    amount: null,
    code: null,
    name: null,
    number: null
  }
  user = {
    uid: '',
    email: ''
  }
  counter: number = 0;
  showPrice: boolean = false;
  formState = ''; // addPack, editPack
  constructor(
    public zone: NgZone, public formBuilder: FormBuilder, private geolocation: Geolocation, public forms: FormBuilder, public router: Router, public toastController: ToastController, public splashscreen: SplashScreen, public camera: Camera, public alertController: AlertController, public popoverController: PopoverController, public renderer: Renderer2, public tabs: TabsService, public platform: Platform, public elementref: ElementRef, public alert: LoadingController, public NavCtrl: NavController, public actionSteetCtrl: ActionSheetController, public Mypackages: DataSavedService
  ) { 
    this.singlePackAmount = 0;
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => { 
      this.user.uid = user.uid;
      this.user.email = user.email
    })
    setTimeout(() => {
      this.splashscreen.hide()
    }, 2000);

    this.packsToDisplay = [];
    this.zone.run(() => {

      this.calculateAverage()

    })
  }

  ionViewWillEnter() {
    this.zone.run(() => {
      
        this.db.collection('drivingschools').doc(this.user.uid).onSnapshot(res => {
          if (res.exists) {
            this.schoolDetails.address = res.data().address
            this.schoolDetails.allday = res.data().allday
            this.schoolDetails.avarage = res.data().avarage
            this.schoolDetails.cellnumber = res.data().cellnumber
            this.schoolDetails.city = res.data().city
            this.schoolDetails.closed = res.data().closed
            this.schoolDetails.coords = res.data().coords
            this.schoolDetails.desc = res.data().desc
            this.schoolDetails.email = res.data().email
            this.schoolDetails.image = res.data().image
            this.schoolDetails.open = res.data().open
            this.schoolDetails.packages = res.data().packages
            this.schoolDetails.schoolname = res.data().schoolname
            this.schoolDetails.schooluid = res.data().schooluid
            this.schoolDetails.tokenId = res.data().tokenId
            this.packsToDisplay = res.data().packages.code01

            this.segmentVal = 'code01';
            console.log(this.schoolDetails.packages);

          } else {
          }
          setTimeout(() => {
            this.loaderAnimate = false;
          }, 1000);
        })
      
    })
  }

  async Logout() {





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

            this.schoolDetails = {
              address: null,
              allday: null,
              avarage: null,
              cellnumber: null,
              city: null,
              closed: null,
              coords: {
                lat: null,
                lng: null
              },
              desc: null,
              email: null,
              image: null,
              open: null,
              packages: {
                code01: [],
                code01Price: 0,
                code08: [],
                code08Price: 0,
                code10: [],
                code10Price: 0,
                code14: [],
                code14Price: 0
              },
              schoolname: null,
              schooluid: null,
              tokenId: null,
            };

            firebase.auth().signOut().then((res) => {

             
              this.router.navigateByUrl('/login');
            })
          }
        }
      ]
    });

    await alert.present();

    // this.packsToDisplay = [];




  }

  goToReviews() {
    this.router.navigateByUrl('past-b')
  }

  async presentActionSheet(i, p) {
    this.zone.run(async () => {
      let packageIndex = i
      let packge = p
      const actionSheet = await this.actionSteetCtrl.create({
        header: p.name,
        buttons: [{
          text: 'Delete',
          icon: 'trash',
          handler: async () => {
            let alerter = await this.alertController.create({
              header: 'Delete Package',
              message: 'Are you sure you want to delete this package?',
              buttons: [
                {
                  text: 'No',
                  role: 'cancel'
                },
                {
                  text: 'Sure',
                  // active function for deleting packages
                  handler: async () => {
                    switch (this.segmentVal) {
                      case 'code01':
                        // set the active code to delete
                        let pack = this.schoolDetails.packages.code01.filter(
                          pack => pack.name !== p.name)
                        this.schoolDetails.packages.code01 = pack

                        firebase.auth().onAuthStateChanged(user => {
                          this.db.collection('drivingschools').doc(user.uid).update(
                            { packages: this.schoolDetails.packages }).then(res => {
                              this.packsToDisplay = this.schoolDetails.packages.code01
                              this.segmentVal = 'code01';
                            })
                        })
                        break;
                      case 'code08':
                        let code08 = this.schoolDetails.packages.code08.filter(
                          code08 => code08.name !== p.name)

                        this.schoolDetails.packages.code08 = code08


                        firebase.auth().onAuthStateChanged(user => {
                          this.db.collection('drivingschools').doc(user.uid).update(
                            { packages: this.schoolDetails.packages }).then(res => {
                              this.packsToDisplay = this.schoolDetails.packages.code08
                              this.segmentVal = 'code08';
                            })
                        })
                        break;
                      case 'code10':

                        let code10 = this.schoolDetails.packages.code10.filter(
                          code10 => code10.name !== p.name)
                        this.schoolDetails.packages.code10 = code10

                        firebase.auth().onAuthStateChanged(user => {
                          this.db.collection('drivingschools').doc(user.uid).update(
                            { packages: this.schoolDetails.packages }).then(res => {
                              this.packsToDisplay = this.schoolDetails.packages.code10
                              this.segmentVal = 'code10';
                            })
                        })
                        break;
                      case 'code14':
                        let code14 = this.schoolDetails.packages.code14.filter(
                          code14 => code14.name !== p.name)
                        this.schoolDetails.packages.code14 = code14

                        firebase.auth().onAuthStateChanged(user => {
                          this.db.collection('drivingschools').doc(user.uid).update(
                            { packages: this.schoolDetails.packages }).then(res => {
                              this.packsToDisplay = this.schoolDetails.packages.code14
                              this.segmentVal = 'code14';
                            })
                        })
                        break;
                    }

                  }
                }]
            })
            alerter.present()
          }
        }, {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            this.formState = 'editPack'; // sets the form state from add to edit
            this.zone.run(() => {
              this.editPacks = true;
              this.packstoEditIndex = packageIndex
              this.packstoEdit = packge


            });
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }]
      });
      await actionSheet.present();
    })
  }

  closeEdit() {

    // this.addPackage()
    this.zone.run(async () => {
      this.editPacks = false;

      this.packstoEdit = {
        amount: null,
        code: null,
        name: null,
        number: null
      }
      firebase.auth().onAuthStateChanged(user => {
        this.db.collection('drivingschools').doc(user.uid).get().then(res => {
          switch (this.segmentVal) {
            case 'code01':
              this.packsToDisplay = res.data().packages.code01
              break;
            case 'code08':
              this.packsToDisplay = res.data().packages.code08
              break;
            case 'code10':
              this.packsToDisplay = res.data().packages.code10

              break;
            case 'code14':
              this.packsToDisplay = res.data().packages.code14
              break;
          }

        })
      })
    })
  }
  // active function for editing packs
  async editPackage() {


    // take the selected pack and add it to the packs to edit (done in the action sheet)
    // when the user cancels edit, just clear the object (done)
    // when they edit, splice the selected pack from the packages array (1), then push the just edited object in the package array (2), update the packstodisplay array with the updated package array (3), update the field in firebase with the array that just got modified (4).
    // have two buttons in the html they will switch depending on the formstate value (value set by the action sheet)
    if (this.singlePackAmount == '' || this.singlePackAmount == 0 || this.singlePackAmount == null) {
      const alert = await this.alertController.create({
        message: "Can't leave single amount empty.",
        buttons: ['OK']
      });
      await alert.present();
    } else {
      if (!this.packstoEdit.amount || !this.packstoEdit.name || !this.packstoEdit.number) {
        const alert = await this.alertController.create({
          message: "Fields can't be empty!",
          buttons: ['OK']
        });
        await alert.present();
      } else {
        switch (this.segmentVal) {
          case 'code01':
            this.schoolDetails.packages.code01.splice(this.packstoEditIndex, 1) // (1)
            this.schoolDetails.packages.code01.unshift(this.packstoEdit)// (2)
            setTimeout(() => {
              this.packsToDisplay = this.schoolDetails.packages.code01; // (3)
            }, 500);
            this.db.collection('drivingschools').doc(this.schoolDetails.schooluid).update({ 'packages.code01': this.schoolDetails.packages.code01 }).then(res => { // (4)
              this.segmentVal = 'code01';
              this.editPacks = false;
              this.packstoEdit = {
                amount: null,
                code: null,
                name: null,
                number: null
              }
            })
            break;
          case 'code08':
            this.schoolDetails.packages.code08.splice(this.packstoEditIndex, 1)
            this.schoolDetails.packages.code08.unshift(this.packstoEdit)
            setTimeout(() => {
              this.packsToDisplay = this.schoolDetails.packages.code08
            }, 500);
            this.db.collection('drivingschools').doc(this.schoolDetails.schooluid).update({ 'packages.code08': this.schoolDetails.packages.code08 }).then(res => {
              this.segmentVal = 'code08'
              this.editPacks = false;
              this.packstoEdit = {
                amount: null,
                code: null,
                name: null,
                number: null
              }
            })
            break;
          case 'code10':
            this.schoolDetails.packages.code10.splice(this.packstoEditIndex, 1)
            this.schoolDetails.packages.code10.unshift(this.packstoEdit)
            setTimeout(() => {
              this.packsToDisplay = this.schoolDetails.packages.code10;
            }, 500);
            this.db.collection('drivingschools').doc(this.schoolDetails.schooluid).update({ 'packages.code10': this.schoolDetails.packages.code10 }).then(res => {
              this.segmentVal = 'code10'
              this.editPacks = false;
              this.packstoEdit = {
                amount: null,
                code: null,
                name: null,
                number: null
              }
            })
            break;
          case 'code14':
            this.schoolDetails.packages.code14.splice(this.packstoEditIndex, 1)
            this.schoolDetails.packages.code14.unshift(this.packstoEdit)
            setTimeout(() => {
              this.packsToDisplay = this.schoolDetails.packages.code14;
            }, 500);
            this.db.collection('drivingschools').doc(this.schoolDetails.schooluid).update({ 'packages.code14': this.schoolDetails.packages.code14 }).then(res => {
              this.segmentVal = 'code14';
              this.editPacks = false;
              this.packstoEdit = {
                amount: null,
                code: null,
                name: null,
                number: null
              }
            })
            break;
        }
      }
    }

  }
  // active function for adding packs
  async PackageAdding() {
    console.log('called method', this.schoolDetails.packages)
    if (this.formState == 'addPack') {
      this.zone.run(async () => {

        // checking what code is being added
        // check if the amount is provided
        if (this.singlePackAmount == '' || this.singlePackAmount == 0 || this.singlePackAmount == null) {
          const alert = await this.alertController.create({
            message: 'Please provide an amount for 1 lesson.',
            buttons: ['OK']
          });
          await alert.present();
        } else {
          if (this.packstoEdit.amount == null || this.packstoEdit.name == null || this.packstoEdit.number == null) {
            const alert = await this.alertController.create({
              message: "Fields can't be empty!",
              buttons: ['OK']
            });
            await alert.present();
          } else {
            switch (this.segmentVal) {
              case 'code01':
                // set the active code to add
                this.packstoEdit.code = 'code01';
                if (this.schoolDetails.packages.code01.length == 4) {
                  let alerter = await this.alertController.create({
                    message: 'Can only add 4 packages per code.',
                    buttons: [{
                      text: 'Okay',
                      role: 'cancel'
                    }]
                  })
                  alerter.present()
                  this.packstoEdit = {
                    amount: '',
                    code: '',
                    name: '',
                    number: ''
                  }

                  this.editPacks = false;
                } else {
                  this.schoolDetails.packages.code01Price = this.singlePackAmount;

                  this.schoolDetails.packages.code01.push(this.packstoEdit)

                  if (this.formState == 'addPack') {
                    this.db.collection('drivingschools').doc(this.user.uid).update(
                      { packages: this.schoolDetails.packages }).then(async res => {
                        console.log('after then method', this.schoolDetails.packages)
                        this.segmentVal = 'code01';
                        this.packsToDisplay = this.schoolDetails.packages.code01
                        this.packstoEdit = {
                          amount: '',
                          code: '',
                          name: '',
                          number: ''
                        }
                        const toast = await this.toastController.create({
                          message: 'Package added successfully under ' + this.segmentVal,
                          duration: 2000
                        });
                        this.formState = ''
                        console.log('called method , form state ', this.formState)
                        toast.present();
                      })
                  }
                }


                break;
              case 'code08':
                // set the active code to edit
                this.packstoEdit.code = 'code08';
                // check if the amount is provided
                if (this.schoolDetails.packages.code08.length == 4) {
                  let alerter = await this.alertController.create({
                    message: 'Can only add 4 packages per code.',
                    buttons: [{
                      text: 'Okay',
                      role: 'cancel'
                    }]
                  })
                  alerter.present()
                  this.packstoEdit = {
                    amount: '',
                    code: '',
                    name: '',
                    number: ''
                  }

                  this.editPacks = false;
                } else {
                  this.schoolDetails.packages.code08Price = this.singlePackAmount;
                  this.schoolDetails.packages.code08.push(this.packstoEdit);

                  firebase.auth().onAuthStateChanged(user => {
                    this.db.collection('drivingschools').doc(user.uid).update(
                      { packages: this.schoolDetails.packages }).then(re => {
                        this.packsToDisplay = this.schoolDetails.packages.code08
                        this.segmentVal = 'code08';
                        this.packstoEdit = {
                          amount: '',
                          code: '',
                          name: '',
                          number: ''
                        }
                      })
                  })
                  const toast = await this.toastController.create({
                    message: 'Package added successfully under ' + this.segmentVal,
                    duration: 2000
                  });
                  this.formState = ''
                  toast.present();
                }

                break;
              case 'code10':
                this.packstoEdit.code = 'code10';
                if (this.schoolDetails.packages.code10.length == 4) {
                  let alerter = await this.alertController.create({
                    message: 'Can only add 4 packages per code.',
                    buttons: [{
                      text: 'Okay',
                      role: 'cancel'
                    }]
                  })
                  alerter.present()
                  this.packstoEdit = {
                    amount: '',
                    code: '',
                    name: '',
                    number: ''
                  }

                  this.editPacks = false;
                } else {
                  this.schoolDetails.packages.code10Price = this.singlePackAmount;
                  this.schoolDetails.packages.code10.push(this.packstoEdit)

                  firebase.auth().onAuthStateChanged(user => {
                    this.db.collection('drivingschools').doc(user.uid).update(
                      { packages: this.schoolDetails.packages }).then(res => {
                        this.packsToDisplay = this.schoolDetails.packages.code10
                        this.segmentVal = 'code10';
                        this.packstoEdit = {
                          amount: '',
                          code: '',
                          name: '',
                          number: ''
                        }
                      })
                  })

                  let toaster = await this.toastController.create({
                    message: 'Package added successfully under ' + this.segmentVal,
                    duration: 2000
                  });
                  this.formState = ''
                  toaster.present();
                }


                break;
              case 'code14':
                this.packstoEdit.code = 'code14';
                if (this.schoolDetails.packages.code14.length == 4) {
                  let alerter = await this.alertController.create({
                    message: 'Can only add 4 packages per code.',
                    buttons: [{
                      text: 'Okay',
                      role: 'cancel'
                    }]
                  })
                  alerter.present()
                  this.packstoEdit = {
                    amount: '',
                    code: '',
                    name: '',
                    number: ''
                  }

                  this.editPacks = false;
                } else {
                  this.schoolDetails.packages.code14Price = this.singlePackAmount;
                  this.schoolDetails.packages.code14.push(this.packstoEdit)

                  firebase.auth().onAuthStateChanged(user => {
                    this.db.collection('drivingschools').doc(user.uid).update(
                      { packages: this.schoolDetails.packages }).then(res => {
                        this.packsToDisplay = this.schoolDetails.packages.code14
                        this.segmentVal = 'code14';
                        this.packstoEdit = {
                          amount: '',
                          code: '',
                          name: '',
                          number: ''
                        }
                      })
                  })

                  const toaster4 = await this.toastController.create({
                    message: 'Package added successfully under ' + this.segmentVal,
                    duration: 2000
                  });
                  toaster4.present();
                  this.formState = ''
                }

                break;
            }
            this.packstoEdit = {
              amount: '',
              code: '',
              name: '',
              number: ''
            }

            this.editPacks = false;
          }
        }

      })
    }

  }
  openPackEdit(state) {
    // sets the form state from edit to add

    this.zone.run(() => {
      this.formState = state;
      this.editPacks = !this.editPacks;
    })
  }
  editPack(p) {
    this.zone.run(() => {
      this.editPacks = !this.editPacks;
    })
  }

  // switches the segments to change active packs
  segmentChanged(ev) {
    this.zone.run(() => {

      // ev.detail.value
      switch (ev.detail.value) {
        case 'code01':
          this.packsToDisplay = []
          this.packsToDisplay = this.schoolDetails.packages.code01
          this.singlePackAmount = this.schoolDetails.packages.code01Price

          break;
        case 'code08':
          this.packsToDisplay = []
          this.packsToDisplay = this.schoolDetails.packages.code08
          this.singlePackAmount = this.schoolDetails.packages.code08Price

          break;
        case 'code10':
          this.packsToDisplay = []
          this.packsToDisplay = this.schoolDetails.packages.code10
          this.singlePackAmount = this.schoolDetails.packages.code10Price

          break;
        case 'code14':
          this.packsToDisplay = []
          this.packsToDisplay = this.schoolDetails.packages.code14
          this.singlePackAmount = this.schoolDetails.packages.code14Price
          break;
        default:
          break;
      }

    }
    )

  }

  // takes us to viewprofile page
  toedit() {
    this.zone.run(() => {

      this.NavCtrl.navigateForward('viewprofile')
      this.router.navigate(['viewprofile'])
    })
  }
  // active function for calculating average
  calculateAverage() {
    firebase.auth().onAuthStateChanged(user => {
      this.db.collection('reviews').where('schooluid', '==', user.uid).onSnapshot(snap => {
        this.ratingTotal = 0
        snap.forEach(doc => {
          this.ratingTotal = this.ratingTotal + doc.data().rating
        })
        let avg = this.ratingTotal / snap.size;


        if (isNaN(avg)) {
          this.schoolDetails.avarage = 0

        } else {
          this.schoolDetails.avarage = avg

        }


      })
    })
  }

}
