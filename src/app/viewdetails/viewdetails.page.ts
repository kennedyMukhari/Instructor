import { Router } from '@angular/router';
import { UserService } from './../user.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { DataSavedService } from '../data-saved.service';
import { AlertController } from '@ionic/angular';
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
      this.NewRequesteWithPictures = this.data.DeliveredData;
      console.log("Data in the View details page", this.data.SavedData);
      
     }

  
     ionViewWillLeave(){
     
     }

  ngOnInit() {
   this.zone.run(()=>{
    this.user =  this.userService.getUserProfile()
    this.userService.getUserProfile().then(res => {
      console.log('response', res);
      
    })
    
   })
  }


  back() {
    this.rounte.navigateByUrl('/main/the-map')
  }

  
  Displaydata(){
  
  }



  Accept(obj, i, docid) {

    // console.log("rrrrrrrrrrrr", Customer);
    this.db.collection('bookings').doc(docid).set(
      { confirmed: 'accepted' }, { merge: true }
      );

      this.data.SavedData.push({obj: obj, index:i, docid:docid});
      console.log("ddddddddsdsdsdsd", this.data.SavedData);
      
    this.presentAlert();
    this.router.navigateByUrl('pastbookings');

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
