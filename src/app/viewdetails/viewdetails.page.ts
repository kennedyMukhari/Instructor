import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from './../user.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { DataSavedService } from '../data-saved.service';
import * as firebase from 'firebase';


@Component({
  selector: 'app-viewdetails',
  templateUrl: './viewdetails.page.html',
  styleUrls: ['./viewdetails.page.scss'],
  providers: [UserService]
})
export class ViewdetailsPage implements OnInit {

  user = {}
  NewRequesteWithPictures = [];
  db = firebase.firestore();

  constructor( public router: Router, public data: DataSavedService,
    public alertController: AlertController, private userService: UserService, public zone:NgZone, private rounte: Router) {

      this.NewRequesteWithPictures = [];
      this.NewRequesteWithPictures = this.data.SavedData;
      console.log("Data in the View details page",  this.NewRequesteWithPictures );

     }

  
     ionViewWillLeave(){
     
     }

  ngOnInit() {
    
   this.zone.run(()=>{
    this.user = this.rounte.getCurrentNavigation().extras.state.booking
    this.userService.getUserProfile().then(res => {
    })
    this.rounte.paramsInheritanceStrategy = 'always'
    console.log(this.rounte.getCurrentNavigation().extras.state.booking);

    
   })
  }


 

  
  Displaydata(){
  
  }



  Accept(obj, i, docid) {

    // console.log("rrrrrrrrrrrr", Customer);
    this.db.collection('bookings').doc(docid).set(
      { confirmed: 'accepted' }, { merge: true }
      );

      //  this.data.SavedData.push({obj: obj, index:i, docid:docid});
      console.log("ddddddddsdsdsdsd", this.data.SavedData);
      
    this.presentAlert();
    // this.router.navigateByUrl('pastbookings');
    this.router.navigateByUrl('main/the-map');

  }

  async Decline(docid, i, x) {

    this.db.collection('bookings').doc(docid).set({ confirmed: 'rejected' }, { merge: true });
    this.NewRequesteWithPictures.splice(x, 1)

    this.data.SavedData.splice(i, 1)
    const alert = await this.alertController.create({
      header: 'Declined Successfully.',
      subHeader: '',
      message: '',
      buttons: ['OK']
    });

    await alert.present();
    this.router.navigateByUrl('main/the-map');
    
  }

  back() {
    this.rounte.navigateByUrl('/main/the-map')
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Added to booking list.',
      subHeader: '',
      message: '',
      buttons: ['OK']
    });

    await alert.present();
  }

}
