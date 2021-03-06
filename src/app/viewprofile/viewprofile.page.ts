import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { PopoverController, NavController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { TabsService } from '../core/tabs.service';
import { Platform } from '@ionic/angular';
import { NgZone } from '@angular/core';
// import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
// import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { LoadingController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.page.html',
  styleUrls: ['./viewprofile.page.scss'],
})
export class ViewprofilePage implements OnInit {
  public unsubscribeBackEvent: any;
  profileForm: FormGroup
  @ViewChild('mySlider', { static: false }) slides: IonSlides;
  @ViewChild('inputs', { static: true }) input: ElementRef;
  autocomplete: any;
  MyAddress: string;
  town_1: string;
  myLatitude: number;
  myLongitude: number;
  textInButton: string;
  formValid = true;


  disablePrevBtn = true;
  disableNextBtn = false;
  closeTime : string = "18:00"
  codes = [
    "Code1",
    "Code8",
    "Code10",
    "Code14"
  ]
  code1 = [];
  code8 = [];
  code10 = [];
  code14 = [];

  code: string = '';

  //============================
  // GoogleAutocomplete: google.maps.places.AutocompleteService;
  // autocomplete: { input: string; };
  // autocompleteItems: any[];
  // location: any;
  // placeid: any;
  // myLocation: string;
  // address : string = "Enter your address";
  //==============================
  options2 = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  }

  display = false;
  toastCtrl: any;

  option = {
    componentRestrictions: { country: 'ZA' }
  };

  users = {
    schoolname: '',
    registration: '',
    email: '',
    cellnumber: '',
    cost: '',
    desc: '',
    open: '',
    closed: '',
    allday: '',
    //  name:'',
    //  number: '',
    //  amount:''
  }
  options: GeolocationOptions;
  currentPos: Geoposition;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  amount: string = '';
  name: string = '';
  number: string = '';
  town: string;
  Address: string = '';
  longitude: string;
  latitude: string;
  Mylocation: string = "";
  pack = {
    amount: this.amount,
    name: this.name,
    number: this.number,
  }

  opened: boolean

  businessdata = {
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
    email: firebase.auth().currentUser.email,
    image: 'https://firebasestorage.googleapis.com/v0/b/step-drive-95bbe.appspot.com/o/1.png?alt=media&token=c023a9e6-a7a0-4af9-bd13-9778f2bea46d',
    open: null,
    packages:{
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
  }

  DrivingSchoolOwnerDetails = [];
  viewImage = {
    image: '',
    open: false
  }
  counter: number = 0;
  // now = moment().format('"hh-mm-A"');
  error_messages = {
    schoolname: [
      { type: 'required', message: 'School Name is required.' },
    ],
    cellnumber: [
      { type: 'required', message: 'Cell Number is required.' },
      { type: 'minlength', message: 'Cell Number must be 10 digits.' },
      { type: 'maxlength', message: 'Cell Number must be  10 digits.' },
    ],
    address: [
      { type: 'required', message: 'Address is required.' },
      { type: 'minlength', message: 'Too short.' },
    ],
    open: [
      { type: 'required', message: 'Opening is required.' },
    ],
    closed: [
      { type: 'required', message: 'Closing time is required.' },
    ],
    desc: [
      { type: 'required', message: 'This field is required' }
    ]
  }
  error = ""
  profileImage: string;
  userProv: any;
  uploadprogress = 0;
  isuploading = false;
  userProfile: any;
  isuploaded: boolean;
  imageSelected: boolean;
  tempData: string;
  showButton: boolean;
  showButton1: boolean;
  DisplayPackages = [];

  constructor(
    public toastController:ToastController,
    public zone: NgZone,
    private geolocation: Geolocation,
    public router: Router,
    public camera: Camera,
    public alertController: AlertController,
    public popoverController: PopoverController,
    public renderer: Renderer2,
    public tabs: TabsService,
    public platform: Platform,
    public elementref: ElementRef,
    public alert: LoadingController,
    public splashscreen: SplashScreen,
    public formBuilder: FormBuilder


  ) {
    this.platform.ready().then(() => {
      const tabBar = document.getElementById('myTabBar');
      tabBar.style.display = 'flex';
    });
  }
  ngOnInit() {
   
  }


  ionViewWillEnter() {

    this.zone.run(()=>{
      this.businessdata.schooluid = firebase.auth().currentUser.uid
      this.db.collection('drivingschools').doc(firebase.auth().currentUser.uid).get().then(res => {
        if (res.exists) {
          this.tempData = res.data().schoolname;
          this.businessdata = {
            address: res.data().address,
            allday: res.data().allday,
            avarage: 0,
            cellnumber: res.data().cellnumber,
            city: res.data().city,
            closed: res.data().closed,
            coords: res.data().coords,
            desc: res.data().desc,
            email: firebase.auth().currentUser.email,
            image: res.data().image,
            open: res.data().open,
            packages: res.data().packages,
            schoolname: res.data().schoolname,
            schooluid:firebase.auth().currentUser.uid,
            tokenId: res.data().tokenId,
          }
          console.log('document ',this.businessdata);
          
        } else {
          console.log('No Profile for this driving school')
        }
          
          console.log(this.businessdata);
          
        this.tempData = this.businessdata.schoolname;
        if (this.tempData === '') {
          this.showButton = true;
          this.textInButton = "Done";
          this.tempData = '';
        } else {
          this.showButton1 = true;
          this.textInButton = "Update";
          this.tempData = '';
        }
  
      }).catch(err => {
        console.log(err);
  
      })
      setTimeout(()=>{
        this.splashscreen.hide()
            },2000)
  
            
      this.splashscreen.hide()
      setTimeout(() => {
        let viewimage = this.elementref.nativeElement.children[0].children[0]
        console.log('ggg', viewimage);
        this.renderer.setStyle(viewimage, 'opacity', '0');
        this.renderer.setStyle(viewimage, 'transform', 'scale(0)');
      }, 200)
    })
    

    this.initAutocomplete();
    this.counter = 0;
    this.getUserPosition();


  }
  
  swipeUp() {
    this.display = !this.display;
  }
  ionViewDidLoad() {
    this.initializeBackButtonCustomHandler();
    this.tempData = this.businessdata.schoolname;
  }
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unsubscribeBackEvent && this.unsubscribeBackEvent();
  }


  async swipeNext(x) {
    
  console.log("Semi profile",x)

    // if (this.businessdata.schoolname != '' && this.businessdata.cellnumber != '' && this.businessdata.desc != '') {
    //   this.slides.slideNext();
    // } else {
    //   const alert = await this.alertController.create({
    //     message: 'Fields cannot be empty!',
    //     buttons: ['OK']
    //   });
    //   await alert.present();
    // }


    if(x.address==""||x.address==undefined)
    {
      const toast = await this.toastController.create({
        message: 'Enter your address.',
        duration: 3000
      });
      toast.present();
    }
    else if(x.schoolname==""||x.schoolname==undefined)
    {
      const toast = await this.toastController.create({
        message: 'Enter your school name.',
        duration: 3000
      });
      toast.present();
    }
    else if(x.cellnumber==""||x.cellnumber==undefined||x.cellnumber.length
    !=10)
    {

      
      const toast = await this.toastController.create({
        message: 'Enter a cellphone number with 10 digits.',
        duration: 3000
      });
      toast.present();
    }
    else if(x.desc==""||x.desc==undefined)
    {
      const toast = await this.toastController.create({
        message: 'Give us a description of your school.',
        duration: 3000
      });
      toast.present();
    }
else{
  this.slides.slideNext();
}
  }




  doCheck() {

    let prom1 = this.slides.isBeginning();
    let prom2 = this.slides.isEnd();

    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }


  doCheck1() {
    this.doCheck();
  }


  initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    this.autocomplete = new google.maps.places.Autocomplete(
      <HTMLInputElement>document.getElementById('autocomplete'), { types: ['geocode'] });


    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    // this.autocomplete.setFields(['address_component']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    this.autocomplete.addListener('place_changed', () => { this.fillInAddress() });
  }


  fillInAddress() {
    // Get the place details from the autocomplete object.
    let place = this.autocomplete.getPlace();
    this.businessdata.address = place.formatted_address;
    this.businessdata.city = place.address_components[3].long_name;
    this.businessdata.coords.lat = place.geometry.location.lat();
    this.businessdata.coords.lng = place.geometry.location.lng();
  }

  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  //============================

  async initializeBackButtonCustomHandler() {
    this.platform.backButton.subscribeWithPriority(1, async () => {
      const alert = await this.alertController.create({
        header: '',
        message: 'Do you want to exit the App/',
        buttons: [
          {
            text: 'No',
            role: '',
            cssClass: '',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Yes',
            handler: () => {
              navigator['app'].exitApp();
            }
          }
        ]
      });

      await alert.present();

    });
    
  }


  GoTo() {
    // return window.location.href = 'https://www.google.com/maps/place/?q=place_id:'+this.placeid;
    console.log("".toString() < "aA".toString());

  }
  //=========================================

  getUserPosition() {

    this.options = {
      enableHighAccuracy: true
    };
    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
      this.currentPos = pos;
    }, (err: PositionError) => {

    });

  }

  async CheckData() {


    if (this.businessdata.closed.slice(11, 16) === this.businessdata.open.slice(11, 16) || this.businessdata.closed.slice(11, 16) < this.businessdata.open.slice(11, 16)) {
      const alert = await this.alertController.create({
        // header: 'Alert',
        // subHeader: 'Subtitle',
        message: 'time canot not be the same .',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        // header: 'Alert',
        // subHeader: 'Subtitle',
        message: 'Well Done Buddy Way to Go!',
        buttons: ['OK']
      });
      await alert.present();
    }

  }

  async selectImage() {

    let option: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    await this.camera.getPicture(option).then(res => {
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;
      this.profileImage = image;
      // const UserImage = this.storage.child(this.userProv.getUser().uid+'.jpg');
      let imageRef = this.storage.child('image_'+this.businessdata.schoolname+'_'+this.businessdata.address)
      const upload = imageRef.putString(image, 'data_url');
      upload.on('state_changed', snapshot => {
        this.uploadprogress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
        this.isuploading = true;
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.businessdata.image = null
          this.businessdata.image = downUrl;
          console.log('Image downUrl', downUrl);
          this.isuploading = false;
          
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })
    this.imageSelected = true;
  }
  showTab() {
    this.platform.ready().then(() => {
      console.log('Core service init');
      const tabBar = document.getElementById('myTabBar');
      tabBar.style.display = 'flex';
    });

  }
  
  async  createMyAccount(x): Promise<void> {
    
    console.log("Profile = ",x)
    
    if (this.businessdata.open != '' && this.businessdata.closed != '') {

      if (this.businessdata.closed.slice(11, 16) != this.businessdata.open.slice(11, 16) && this.businessdata.closed.slice(11, 16) > this.businessdata.open.slice(11, 16)) {
        
        
        this.db.collection('drivingschools').doc(firebase.auth().currentUser.uid).set(this.businessdata).then(async (res) => {
          const alert = await this.alertController.create({
            message: 'Profile successfully created!',
            buttons: ['OK']
          });
          await alert.present();
  
          this.router.navigateByUrl('main/profile');
        }).catch(error => {
          
        });
        

      } else {
        const alert = await this.alertController.create({
          message: 'Please enter the correct time',
          buttons: ['OK']
        });
        await alert.present();
      }

    } else {


    }

  }

  // getProfile() {
  // }

  goToRev() {
    this.router.navigate(['/main/profile']);
  }

  // profile() {
  //   this.router.navigate(['the-map']);
  // }
  // view() {
  //   this.router.navigate(['viewprofile']);
  // }

  // openImage(image, cmd) {
  //   // console.log('Open triggerd');
  //   console.log(this.elementref);

  //   if (cmd == 'open') {
  //     this.viewImage.image = image;
  //     this.viewImage.open = true;

  //     let viewimage = this.elementref.nativeElement.children[0].children[0]
  //     console.log('ggg', viewimage);
  //     this.renderer.setStyle(viewimage, 'opacity', '1');
  //     this.renderer.setStyle(viewimage, 'transform', 'scale(1)');
  //     this.renderer.setStyle(viewimage, 'height', '100vh');
  //   } else {

  //     this.viewImage.open = false;
  //     let viewimage = this.elementref.nativeElement.children[0].children[0]
  //     console.log('ggg', viewimage);
  //     this.renderer.setStyle(viewimage, 'opacity', '0');
  //     this.renderer.setStyle(viewimage, 'transform', 'scale(0)');
  //     this.renderer.setStyle(viewimage, 'height', '0vh');
  //   }
  // }

  getProfile() {
  }
  // goToRev() {
  //   this.router.navigate(['/main/profile']);
  // }
  profile() {
    this.router.navigate(['the-map']);
  }
  
  view() {
    this.router.navigate(['viewprofile']);
  }

  openImage(image, cmd) {
    // console.log('Open triggerd');
    console.log(this.elementref);
    if (cmd == 'open') {
      this.viewImage.image = image;
      this.viewImage.open = true;
      let viewimage = this.elementref.nativeElement.children[0].children[0]
      console.log('ggg', viewimage);
      this.renderer.setStyle(viewimage, 'opacity', '1');
      this.renderer.setStyle(viewimage, 'transform', 'scale(1)');
      this.renderer.setStyle(viewimage, 'height', '100vh');
    } else {
      this.viewImage.open = false;
      let viewimage = this.elementref.nativeElement.children[0].children[0]
      console.log('ggg', viewimage);
      this.renderer.setStyle(viewimage, 'opacity', '0');
      this.renderer.setStyle(viewimage, 'transform', 'scale(0)');
      this.renderer.setStyle(viewimage, 'height', '0vh');
    }
  }
}