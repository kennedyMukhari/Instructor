import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from './../user.service';
import { Component, OnInit, NgZone } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-viewdetails',
  templateUrl: './viewdetails.page.html',
  styleUrls: ['./viewdetails.page.scss'],
  providers: [UserService]
})
export class ViewdetailsPage implements OnInit {
  db = firebase.firestore()
  user = {
    book: null,
datein: "",
dateout: "",
docid: "",
image: "",
location: "",
name: "",
packageName: "",
phone: "",
placeid: null,
time: ""
  }
  constructor(private userService: UserService, public zone:NgZone, private rounte: Router, public alertController: AlertController, private toastCtrl: ToastController) { }

  ngOnInit() {
    
   this.zone.run(()=>{
    this.user = this.rounte.getCurrentNavigation().extras.state.booking

    this.userService.getUserProfile().then(res => {
      
     
    })
    this.rounte.paramsInheritanceStrategy = 'always'
    console.log(this.rounte.getCurrentNavigation().extras.state.booking);

    
   })
  }
  back() {
    this.rounte.navigateByUrl('/main/the-map')
  }
  Accept(docid) {
    this.db.collection('bookings').doc(docid).set(
      { confirmed: 'accepted' }, { merge: true }
      ).then(async res=> {
        let toaster = await this.toastCtrl.create({
          message: 'Booking Accepted.',
          duration: 2000
        })
        toaster.present()
      }).catch(async err => {
        let toaster = await this.toastCtrl.create({
          message: 'Oops! Something went wrong.',
          duration: 2000
        })
        toaster.present()
      })
  }

  async Decline(docid) {
    const alert = await this.alertController.create({
      header: 'Decline this booking?',
      subHeader: '',
      message: '',
      buttons: [{
        text: 'No',
        role: 'cancel'
      }, {
        text: 'Yes',
        handler: ()=> {
          this.db.collection('bookings').doc(docid).set({ confirmed: 'rejected' }, { merge: true }).then(async res => {
            let toaster = await this.toastCtrl.create({
              message: 'Booking Declined',
              duration: 2000
            })
            toaster.present()
          })
        } 
      }]
    });
    await alert.present();
  }
}
