import { Component, OnInit, NgZone } from '@angular/core';
import * as firebase from 'firebase';
import { DataSavedService } from '../data-saved.service';
import { Platform, ToastController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';




@Component({
  selector: 'app-pastbookings',
  templateUrl: './pastbookings.page.html',
  styleUrls: ['./pastbookings.page.scss'],
})
export class PastbookingsPage implements OnInit {
  
  db = firebase.firestore();
  storage = firebase.firestore();
  
 Booking = [];
 NewBooking = [];
 user = [];
 Customer = [];
 SortedBookings = [];
 userss = [];
 newusers = [];
 pic : string;
 public unsubscribeBackEvent: any;
 value : string = '';
 placeid : string = 'https://www.google.com/maps/place/?q=place_id:ChIJz61BHrUJlR4RieDxkSG75mE';
 dataDisplay = [];
geocoder = new google.maps.Geocoder()
  constructor(public data : DataSavedService, public alertController: AlertController, public platform : Platform, public toastCtrl:ToastController, public zone: NgZone ) { 
console.log("DATA IN THE PAST", this.data.SavedData);
    this.SortedBookings = [];
  }

  
 ionViewDidEnter(){
  this.zone.run(()=>{
        console.log('Core service init');
    const tabBar = document.getElementById('myTabBar');
     tabBar.style.display = 'flex';
     this.zone.run(()=>{
      setTimeout(() => {
        this.dataDisplay.length = 0
        this.getBooking()
      }, 1000);
       })
     
  })

 }
 GoTo(booking){
   this.zone.run(()=>{
        console.log('destination ', booking);
   firebase.auth().onAuthStateChanged(user => {
    this.db.collection('drivingschools').doc(user.uid).get().then(res => {
      console.log('origin, ',res.data());
      let bLat = booking.route.lat
      let bLng = booking.route.lng
     let sLat =  res.data().coords.lat
     let sLng =  res.data().coords.lng
return window.location.href = `https://www.google.com/maps/dir/?api=1&origin=${sLat},${sLng}&destination=${bLat},${bLng}&travelmode=driving`;
    })
  })
   })

}


 ngOnInit() {

}

async DeleteItem(i){
  this.zone.run(async ()=>{
    let toaster = await this.alertController.create({
  header: 'Remove Booking',
  message: "Delete only if you're done with teaching this person. Continue?",
  buttons: [{
    text: 'No',
    role: 'cancel'
  },
  {
    text:"Yes",
    handler: ()=>{
      this.db.collection('bookings').doc(i.docid).delete().then(async res=>{
        let toast = await this.toastCtrl.create({
          message: 'Booking Removed',
          duration: 2000
        })
        toast.present()
        this.getBooking()
      })
    }
  }
]
})
toaster.present()
  })

}

async presentAlert() {
  this.zone.run(async ()=>{
      const alert = await this.alertController.create({
    header: 'Deleted Successfully.',
    subHeader: '',
    message: '',
    buttons: ['OK']
  });

  await alert.present();
  })

}

showTab(){
  this.zone.run(()=>{
      this.platform.ready().then(() => {
    console.log('Core service init');
    const tabBar = document.getElementById('myTabBar');
    tabBar.style.display = 'flex';
  }); 
  })

}

async getBooking(){
  this.zone.run(()=>{
      console.log('Getting bookings');
  
  let obj = {
    image : null,
    name : null,
    phone : null,
    datein : null,
    dateout :null,
    book :  null,
    location : null,
    route: null,
    time : null,
    packageName : null,
    package: null,
    docid : null,
    placeid : null,
    notified: null
  }
  
    this.db.collection('bookings').where('schooluid', '==', firebase.auth().currentUser.uid).get().then(snapshot => {
      this.dataDisplay.length = 0
      snapshot.forEach(bDoc => {
        if (bDoc.data().confirmed == 'accepted') {
          this.db.collection('users').doc(bDoc.data().uid).get().then(res=> {
            obj = {
              image : res.data().image,
              name : res.data().name,
              phone : res.data().phone,
              datein : bDoc.data().datein,
              dateout : bDoc.data().dateout,
              book :  bDoc.data().book,
              location :  bDoc.data().location.address,
              route: bDoc.data().location,
              time : bDoc.data().time,
              packageName : bDoc.data().package.name,
              package: bDoc.data().package,
              docid : bDoc.id,
              placeid : bDoc.data().location.placeid,
              notified: res.data().notified
            }
             
           this.dataDisplay.push(obj);
           obj = {
            image : null,
            name : null,
            phone : null,
            datein : null,
            dateout :null,
            book :  null,
            location : null,
            route: null,
            time : null,
            packageName : null,
            package: null,
            docid : null,
            placeid : null,
            notified: null
          }
          })
        }
          
          
      });
     
    });
  })

  }
}
