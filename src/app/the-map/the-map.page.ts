import { UserService } from './../user.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import * as firebase from 'firebase';
import { AuthService } from '../../app/user/auth.service';
import { LoginPage } from '../login/login.page';
import { Router, NavigationExtras } from '@angular/router';
import { DataSavedService } from '../data-saved.service';
// import undefined = require('firebase/empty-import');
import { AlertController, LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ToastController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-the-map',
  templateUrl: './the-map.page.html',
  styleUrls: ['./the-map.page.scss'],
  providers: [UserService]
})

export class TheMapPage implements OnInit {
  loaderAnimate = false;
  
  public unsubscribeBackEvent: any;
  // toggles the div, goes up if true, goes down if false
  display = false;
  SOUTH_AFRICAN_BOUNDS = {
    north: -21.914461,
    south: -35.800139,
    west: 15.905430,
    east: 34.899504
  }
  options : GeolocationOptions;
  currentPos : Geoposition;
  @ViewChild('map', {static: false}) mapElement: ElementRef;
  db = firebase.firestore();
  users = [];
  map: any;
  latitude: number;
  longitude: number;
  NewUseArray = {};
  schools = [];
  NewRequesteWithPictures = [];
  tempUsersArray = [];
  requests = [];
  NewRequeste = [];
  Data = [];
  NewData = [];
  dataDisplay = [];
  viewImage = {
    image: '',
    open: false
  }


  constructor(public loadingController:LoadingController, public toastCtrl:ToastController, private geolocation: Geolocation,private screenOrientation: ScreenOrientation, private platform: Platform, public alertController: AlertController, public AuthService: AuthService, public data: DataSavedService, public router: Router, private nativeGeocoder: NativeGeocoder, public elementref: ElementRef, public renderer: Renderer2, private localNot: LocalNotifications, private userService: UserService,
    public loadingCtrl: LoadingController,   public splashscreen: SplashScreen, public zone: NgZone){
    this.pushNotification();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    console.log('notification' ,this.pushNotification)
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

  ngOnInit() {

    this.zone.run(()=> {
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
        docid : null,
        placeid : null
      }

    this.db.collection('bookings').where('schooluid', '==', firebase.auth().currentUser.uid).onSnapshot(snapshot => {
      console.log('bookinga ', snapshot.size);
      this.NewRequesteWithPictures = []
      snapshot.forEach(bDoc => {
        if (bDoc.data().confirmed == 'waiting') {
          this.db.collection('users').doc(bDoc.data().uid).get().then(res=> {
            console.log('profile ', res.exists);

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
              docid : bDoc.id,
              placeid : bDoc.data().location.placeid
            }
             
           this.NewRequesteWithPictures.push(obj);

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
            docid : null,
            placeid : null
          }
          
          })
        }
          
          
      });
      console.log(this.NewRequesteWithPictures);
      setTimeout(() => {
        this.NewRequesteWithPictures.forEach(element => {
          this.addMarkersOnTheCustomersCurrentLocation(element.route, element)
        });
        
      }, 500);
      // this.fillArrayWithData();

    });
setTimeout(()=>{
      this.splashscreen.hide()
          },2000)

    this.getUserPosition();
    })


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

  checkBookingProfile(obj, i, docid) {
    this.zone.run(()=>{
          console.log("Muuuu", obj, i, docid);
    // this.data.SavedData.push({obj: obj, index:i, docid:docid});
    
    this.data.DeliveredData.push({obj: obj, index:i, docid:docid});

    console.log("DeliveredData", this.data.SavedData);
    
    this.userService.storeUserProfile(obj)
    this.router.navigateByUrl('viewdetails', {state:{booking:obj}});
    })
  }


  Accept(obj, i, docid) {
    this.zone.run(()=>{
       this.db.collection('bookings').doc(docid).set(
      { confirmed: 'accepted' }, { merge: true }
      );

      // this.data.SavedData.push({obj: obj, index:i, docid:docid});
      
      this.data.AcceptedData.push({obj: obj, index:i, docid:docid});
      this.data.NewRequesteWithPictures.splice(i, 1);

      console.log("rrrrrrrrrrrr",  this.data.SavedData);
    this.NewRequesteWithPictures.splice(i, 1);
    this.presentAlert();
    this.router.navigateByUrl('main/bookings')
    })
  }

  async Decline(docid, i) {
    this.zone.run(async ()=>{
          this.db.collection('bookings').doc(docid).set({ confirmed: 'rejected' }, { merge: true });
    // this.data.NewRequesteWithPictures.splice(i, 1); 

    const alert = await this.alertController.create({
      header: 'Declined Successfully.',
      subHeader: '',
      message: '',
      buttons: ['OK']
    });

    await alert.present();
    })

  }


  swipeUp() {
    this.zone.run(()=>{
      this.display = !this.display;
    })
    
    console.log('Clicked');
  }
    //addMarkers method adds the customer's location 
    addMarkersOnTheCustomersCurrentLocation(coords, object) {
      console.log('Called ', object);
      const icon = {
        url: 'https://cdn.mapmarker.io/api/v1/pin?size=50&background=%23373737&icon=fa-user&color=%23FFFFFF&voffset=0&hoffset=1&', // image url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };
  
      let marker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(coords.lat, coords.lng),
        icon: icon
      });
      let infoWindow = new google.maps.InfoWindow({
        content: `<h5 style="margin:0;padding:0;">${object.name} </h5>` + object.package.name+', '+object.package.code+', R'+object.package.amount+'.00, '+object.package.number+" lesson(s)."});
        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        })
    }


  showTab(){
    this.platform.ready().then(() => {
      console.log("Showtab method is called");
      const tabBar = document.getElementById('myTabBar');
      tabBar.style.display = 'flex';
    });
  }


  async getUserPosition() {
    this.zone.run(async ()=>{
         this.loaderAnimate = true;
    let count  = 0
    this.options = {
      enableHighAccuracy: false
    };
    

    const loading = await this.loadingController.create({
      message: '',
      cssClass:null,
      duration: 3000
    });
    await loading.present();



    this.geolocation.getCurrentPosition().then((pos: Geoposition) => {
      count = count + 1;
      console.log(count);
      
      this.currentPos = pos;
      // console.log(pos);
      this.addMap(pos.coords.latitude, pos.coords.longitude);
   
      // console.log('Current Location', pos);
      this.addMarker(pos.coords.latitude, pos.coords.longitude);
    }, (err: PositionError) => {
      this.addMap(-29.465306,-24.741967);
      // this.loadMap()
      console.log("error : " + err.message);
      this.addMap(-29.465306,-24.741967);
      // this.addMap(pos.coords.latitude, pos.coords.longitude);
    }).catch(err => {
      this.addMap(-29.465306,-24.741967);
    })

    })
 
   
  }

    //addMarker method adds the marker on the on the current location of the device
    addMarker(lat, lng) {
      this.zone.run(()=>{
              let myLatLng = { lat, lng };
      this.map.setCenter(myLatLng);

      let marker = new google.maps.Marker({
        map: this.map,
        position: myLatLng,
        icon: 'https://cdn.mapmarker.io/api/v1/pin?size=50&background=%23FFFFFF&icon=fa-car&color=%239F0500&voffset=0&hoffset=1&'
      });
  
      let content = "<p>You!</p>";
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
  
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });
      })

    }



  addMap(lat,lng) {
    this.zone.run(()=>{
          console.log('Map Loader');
    
    let latLng = new google.maps.LatLng(-26.1711459, 27.9002824);

    var grayStyles = [
      {
        featureType: "all",
        stylers: [
          { saturation: -5 },
          { lightness: 0 }
        ]
      },
    ];

    let mapOptions = {
      center: latLng,
      zoom: 10,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      restriction: {
        latLngBounds: this.SOUTH_AFRICAN_BOUNDS,
        strictBounds: true
      },
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [
            { visibility: "off" }
          ]
        },
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ]
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
     this.loaderAnimate = false;
    })

  }

  openImage(image, cmd) {
    this.zone.run(()=>{
          // console.log('Open triggerd');
    console.log(this.elementref);

    if (cmd == 'open') {
      this.viewImage.image = image;
      this.viewImage.open = true;

      let viewimage = this.elementref.nativeElement.children[0].children[1]
      console.log('ggg', viewimage);
      this.renderer.setStyle(viewimage, 'opacity', '1');
      this.renderer.setStyle(viewimage, 'transform', 'scale(1)');
    } else {

      this.viewImage.open = false;
      let viewimage = this.elementref.nativeElement.children[0].children[1]
      console.log('ggg', viewimage);
      this.renderer.setStyle(viewimage, 'opacity', '0');
      this.renderer.setStyle(viewimage, 'transform', 'scale(0)');
    }
    })

  }
  pushNotification() {
    let count =0;
    this.db.collection('bookings').where('schooluid', '==', firebase.auth().currentUser.uid).onSnapshot(res => {
      // this.db.collection('bookings').where('schooluid ', '==', this.user.uid).onSnapshot(res => {
      res.forEach(doc => {
        count += 1;
        if (doc.data().confirmed == 'waiting') {
          this.localNot.schedule({
            id: 1,
            title: 'StepDrive',
            text: 'You have booking request.'
            
          })
        }
      })
    })
  }
}
