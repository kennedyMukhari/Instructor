import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
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
  viewImage = {
    image: '',
    open: false
  }


  constructor(public loadingController:LoadingController,private geolocation: Geolocation,private screenOrientation: ScreenOrientation, private platform: Platform, public alertController: AlertController, public AuthService: AuthService, public data: DataSavedService, public router: Router, private nativeGeocoder: NativeGeocoder, public elementref: ElementRef, public renderer: Renderer2, private localNot: LocalNotifications, private userService: UserService,
    public loadingCtrl: LoadingController){
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
  
    this.getUserPosition();
   
   
  
    // this.initializeBackButtonCustomHandler();
  }

  // ionViewWillLeave() {
  //   // Unregister the custom back button action for this page
  //   this.unsubscribeBackEvent && this.unsubscribeBackEvent();
  // }

//   initializeBackButtonCustomHandler(): void {

//     this.platform.backButton.subscribeWithPriority(1, () => {
//       alert("Do you want to exit the App");
//       navigator['app'].exitApp();
// });
  

//   // this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(999999,  () => {
//   //     // alert("back pressed home" + this.constructor.name);
     
//   // });
//   /* here priority 101 will be greater then 100 
//   if we have registerBackButtonAction in app.component.ts */
// }




  async ionViewDidEnter() {
    
    //  let loading = await this.loadingCtrl.create();
    // await loading.present();
    // setTimeout(() => {
    //   loading.dismiss();
    // }, 1000)

    this.platform.ready().then(() => {
      console.log('Core service init');
      const tabBar = document.getElementById('myTabBar');
      tabBar.style.display = 'flex';
    });
    this.db.collection('drivingschools').onSnapshot(snapshot => {
      this.Data = [];
      snapshot.forEach(Element => {
        this.Data.push(Element.data());
      });
      this.Data.forEach(item => {
        if (item.schooluid === firebase.auth().currentUser.uid) {
          this.NewData.push(item);
          console.log('NewDrivingschool', this.NewData);
        }
      })
    });
    // this.platform.ready().then(() => {
    //   console.log('Core service init');
    //   const tabBar = document.getElementById('myTabBar');
    //    tabBar.style.display = 'none';
    // });
    

    this.db.collection('bookings').onSnapshot(snapshot => {

      this.NewRequeste = [];
      snapshot.forEach(doc => {
        if (doc.data().schooluid === firebase.auth().currentUser.uid && doc.data().confirmed === 'waiting') {
          this.NewRequeste.push({ docid: doc.id, doc: doc.data()});  
        }
      });
      // this.loaderAnimate = false;

      this.NewRequeste.forEach(Customers => {
        console.log('Owners UID logged in', firebase.auth().currentUser.uid);
        if (Customers.doc.schooluid === firebase.auth().currentUser.uid  ) {

          this.addMarkersOnTheCustomersCurrentLocation(Customers.doc.location.lat, Customers.doc.location.lng, Customers.doc.location.address);
        }
      })

      
      this.fillArrayWithData();

    });

  
   

    // this.NewRequeste.forEach(element => {
    //   console.log("My temporary array", element);
    // })

    // this.db.collection('users').onSnapshot(snapshot => {
    //   snapshot.forEach(item => {
    //     this.NewRequeste.forEach(Element => {
    //       if(item.data().doc.uid === Element.data().doc.uid){
    //         this.NewRequesteWithPictures.push({Customer : Element, image : item.data().image});
    //         console.log("this is my new Array with images", this.NewRequesteWithPictures);
            
    //       }
    //     })
    //   })
    // })

  }

  checkBookingProfile(obj, i, docid) {

    console.log("Muuuu", obj, i, docid);
    // this.data.SavedData.push({obj: obj, index:i, docid:docid});
    
    this.data.DeliveredData.push({obj: obj, index:i, docid:docid});

    console.log("DeliveredData", this.data.SavedData);
    
    this.userService.storeUserProfile(obj)
    this.router.navigateByUrl('viewdetails', {state:{booking:obj}});

  }


  Accept(obj, i, docid) {
  
    this.db.collection('bookings').doc(docid).set(
      { confirmed: 'accepted' }, { merge: true }
      );

      // this.data.SavedData.push({obj: obj, index:i, docid:docid});
      
      this.data.AcceptedData.push({obj: obj, index:i, docid:docid});
      this.data.NewRequesteWithPictures.splice(i, 1);

      console.log("rrrrrrrrrrrr",  this.data.SavedData);
    this.NewRequesteWithPictures.splice(i, 1);
    this.presentAlert();
    
  }

  async Decline(docid, i) {

    this.db.collection('bookings').doc(docid).set({ confirmed: 'rejected' }, { merge: true });
    this.data.NewRequesteWithPictures.splice(i, 1);

    const alert = await this.alertController.create({
      header: 'Declined Successfully.',
      subHeader: '',
      message: '',
      buttons: ['OK']
    });

    await alert.present();
  }


  swipeUp() {
    this.display = !this.display;
    console.log('Clicked');
  }

  fillArrayWithData(){

    this.db.collection('users').onSnapshot(snapshots => {
      snapshots.forEach(data => {
        
        this.tempUsersArray.push(data.data());

        this.NewRequeste.forEach(element => {
         
      if( element.doc.uid === data.data().uid ){
        
        let obj = {
          image : data.data().image,
          name : data.data().name,
          phone : data.data().phone,
          datein : element.doc.datein,
          dateout : element.doc.dateout,
          book :  element.doc.book,
          location :  element.doc.location.address,
          route: element.doc.location,
          time : element.doc.time,
          packageName : element.doc.package.name,
          docid : element.docid,
          placeid : data.data().placeid
        }
        this.data.NewRequesteWithPictures = []
       this.data.NewRequesteWithPictures.push(obj);
       this.NewRequesteWithPictures = this.data.NewRequesteWithPictures
       console.log("This is my array ", this.data.NewRequesteWithPictures );
      }
    })
      
      })
    })

    
  }



 

    //addMarkers method adds the customer's location 
    addMarkersOnTheCustomersCurrentLocation(lat, lng, address) {
      console.log('Called ');
      // let marker = new google.maps.Marker({
      //   map: this.map,
      //   animation: google.maps.Animation.DROP,
      //   position: this.map.getCenter()
  
      // });
  
      // -26.260901, 27.949600699999998
      //here
      const icon = {
        url: 'https://cdn.mapmarker.io/api/v1/pin?size=50&background=%23373737&icon=fa-user&color=%23FFFFFF&voffset=0&hoffset=1&', // image url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };
  
      let marker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(lat, lng),
        icon: icon
      });
  
  
      // let content = "<p>Customer's Location!</p>";
      // let content: `<h5 style="margin:0;padding:0;">${} </h5>`+address
  
      this.addInfoWindow(marker, address);
  
    }


  showTab(){
    this.platform.ready().then(() => {
      console.log("Showtab method is called");
      const tabBar = document.getElementById('myTabBar');
      tabBar.style.display = 'flex';
    });
  }






  add() {

    let userid = firebase.auth().currentUser.uid;
    let schools = []
    this.db.collection("request").where("schooluid", "==", userid)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          console.log(doc.data());
          schools.push(doc.data())
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    this.schools = schools;
    console.log('Request', this.schools);
    console.log('The add method called');

    //  schools.forEach(Customers => {
    //   this.addMarkersOnTheCustomersCurrentLocation(Customers.coords.lat, Customers.coords.lng);
    // })

  }


  takeData() {
    this.db.collection("users").where("name", "==", 'Nkwe')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log('The data', doc.id, " => ", doc.data());
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }


  async getUserPosition() {

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

   
  }





    //addMarker method adds the marker on the on the current location of the device
    addMarker(lat, lng) {

      // let marker = new google.maps.Marker({
      //   map: this.map,
      //   position: new google.maps.LatLng(lat, lng),
      //   icon: icon
      // });
  
      let myLatLng = { lat, lng };
      this.map.setCenter(myLatLng);
      // position: new google.maps.LatLng(lat, lng),
      //here
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
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
      //Add a radius on the map
      // new google.maps.Circle({
      //   strokeColor: '#FF0000',
      //   strokeOpacity: 0.8,
      //   strokeWeight: 2,
      //   fillColor: '#FF0000',
      //   fillOpacity: 0.35,
      //   map: this.map,
      //   center: new google.maps.LatLng(-26.2601316, 27.9495796),
      //   radius: 25000
      // });
  
  
    }



  addMap(lat,lng) {
    console.log('Map Loader');
    
    let latLng = new google.maps.LatLng(-26.1711459, 27.9002824);

    var grayStyles = [
      {
        featureType: "all",
        stylers: [
          { saturation: -10 },
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
  }

  //=====================

  loadMap() {
    console.log('Map loader');
    let latLng = new google.maps.LatLng(-29.465306,-24.741967);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    var locations = [
      ['Bondi Beach', -33.890542, 151.274856, 4],
      ['Coogee Beach', -33.923036, 151.259052, 5],
      ['Cronulla Beach', -34.028249, 151.157507, 3],
      ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
      ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: this.map
      });

      google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
          infowindow.setContent(locations[i][0]);
          infowindow.open(this.map, marker);
        }
      })(marker, i));
    }
  }

  //==============================



  //getGeolocation method gets the surrent location of the device
  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // this.geoLatitude = resp.coords.latitude;
      // this.geoLongitude = resp.coords.longitude; 
      // this.geoAccuracy = resp.coords.accuracy; 
      // this.getGeoencoder(this.geoLatitude,this.geoLongitude);
    }).catch((error) => {
      this.loadMap()
      alert('Error getting location' + JSON.stringify(error));
    });
  }

  // //  //geocoder method to fetch address from coordinates passed as arguments
  //  getGeoencoder(latitude,longitude){
  //   this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
  //   .then((result: NativeGeocoderReverseResult[])  => {
  //     this.geoAddress = this.generateAddress(result[0]);
  //   })
  //   .catch((error: any) => {
  //     alert('Error getting location'+ JSON.stringify(error));
  //   });
  // }


  addInfoWindow(marker, address) {

    let infoWindow = new google.maps.InfoWindow({
      content: `<h5 style="margin:0;padding:0;">${address} </h5>`

    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }




  openImage(image, cmd) {
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
