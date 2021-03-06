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
      this.NewRequesteWithPictures = this.data.DeliveredData;
     

     }

     lll(){
      console.log("Data in the View details page",  this.NewRequesteWithPictures );
     }

  
     ionViewWillLeave(){
       console.log('Will leave');
       
      this.user = {}
     }

  ngOnInit() {
    
   this.zone.run(()=>{
    this.user = this.rounte.getCurrentNavigation().extras.state.booking
    console.log('Booking currintly viewed ', this.user);
    
    this.userService.getUserProfile().then(res => {
    })
    this.rounte.paramsInheritanceStrategy = 'always';
   })
  }


 

  
  Displaydata(){
  }



  Accept(docid) {

    this.db.collection('bookings').doc(docid).set({ confirmed: 'accepted' }, { merge: true }).then(async res=>{
      const alert = await this.alertController.create({
     header: 'Accepted Successfully.',
     subHeader: '',
     message: '',
     buttons: ['OK']
   });

   await alert.present();
   this.router.navigateByUrl('main/the-map');
   })

  }


  async Decline(docid) {

    this.db.collection('bookings').doc(docid).set({ confirmed: 'rejected' }, { merge: true }).then(async res=>{
       const alert = await this.alertController.create({
      header: 'Declined Successfully.',
      subHeader: '',
      message: '',
      buttons: ['OK']
    });

    await alert.present();
    this.router.navigateByUrl('main/the-map');
    })
   
    
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
