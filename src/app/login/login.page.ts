import { Component, OnInit, Renderer2, NgZone } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../app/user/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Directive, HostListener, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
@Directive({
  selector: '[br-data-dependency]' // Attribute selector
})
export class LoginPage implements OnInit {

  loaderAnimate = false;
  public onSubmit(): void {
    // ...
    // ... // ...
    // ...
  }
  db = firebase.firestore()
  public signinForm: FormGroup;
  loginError = {
    code: '',
    message: ''
  }

  public signupForm: FormGroup;
  public loading: HTMLIonLoadingElement;
  formSwitcher = 'signin';
  // form containers
  signUpForm = document.getElementsByClassName('signup')
  signInForm = document.getElementsByClassName('login')
  // switcher buttons
  signUpB = document.getElementsByClassName('bReg')
  signInB = document.getElementsByClassName('bSign')
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private FormsModule: FormsModule,
    private zone: NgZone,
    public splashscreen: SplashScreen
  ) {


    this.signinForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });


    this.signupForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
    if (this.formSwitcher=='signin') {
      
      setTimeout(()=> {
        // console.log(this.signInB[0].children[0]);
        this.renderer.setStyle(this.signInB[0].children[0], 'background', '#480B0B');
        this.renderer.setStyle(this.signInB[0].children[0], 'color', 'white');
        this.renderer.setStyle(this.signUpB[0].children[0], 'background', 'gray');
        this.renderer.setStyle(this.signUpB[0].children[0], 'color', '#480B0B');

        this.renderer.setStyle(this.signInForm[0], 'transform', 'translateX(0)');
      this.renderer.setStyle(this.signUpForm[0], 'transform', 'translateX(100vw)');
      }, 500)
    } else {
      this.renderer.setStyle(this.signInB[0].children[0], 'background', 'gray');
      this.renderer.setStyle(this.signInB[0].children[0], 'color', '#480B0B');
        this.renderer.setStyle(this.signUpB[0].children[0], 'background', '#480B0B');
        this.renderer.setStyle(this.signUpB[0].children[0], 'color', 'white');

      this.renderer.setStyle(this.signInForm[0], 'transform', 'translateX(100vw)');
      this.renderer.setStyle(this.signUpForm[0], 'transform', 'translateX(0vw)');
    }
    
  }

  async ngOnInit() {
    setTimeout(()=>{
      this.splashscreen.hide()
          },2000)
    this.splashscreen.hide()
  }

  async loginUser(signinForm) {
    

    this.zone.run(()=> {
      this.loaderAnimate = true;
    console.log(signinForm);
    firebase.auth().signInWithEmailAndPassword(signinForm.email, signinForm.password).then(res => {
      this.loaderAnimate = false;
      this.db.collection('drivingschools').doc(firebase.auth().currentUser.uid).get().then(res => {
        if (res.exists) {
        
          this.router.navigateByUrl('/main/the-map')    
        } else {
          this.router.navigate(['viewprofile'])
        }
  
      }).catch(err => {
        console.log(err);
  
      })
     
    }).catch( async (err) => {

      
        const alert = await this.alertCtrl.create({
          message: err.message,
          buttons: [{ text: 'Ok', role: 'cancel' }]
        });
        await alert.present();
        this.loaderAnimate = false;
      
      
      this.loaderAnimate = false;
      this.loginError.code = err.code,
      this.loginError.message = err.message;
    })
    })

  }

  async signupUser(signupForm: FormGroup): Promise<void> {
    
    console.log('Method is called');

    if (!signupForm.valid) {
      
      console.log(
        'Need to complete the form, current value: ',
        signupForm.value
      );
    } else {
      this.loaderAnimate = true;
      const email: string = signupForm.value.email;
      const password: string = signupForm.value.password;

      this.authService.signupUser(email, password).then(
        () => {
          this.loading.dismiss()
          this.loaderAnimate = false;
          this.router.navigateByUrl('viewprofile');
        }
      ).catch(error =>{
         this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            await alert.present();
            this.loaderAnimate = false;
          });
      })
      this.loading = await this.loadingCtrl.create();
      // await this.loading.present();
      this.loaderAnimate = true;
    }
  }

   async forgetpassword() {

    // this.router.navigate(['reset-password']);

    const alert = await this.alertCtrl.create({
      header: 'Please enter your E-mail',
      inputs: [
        
        {
          name: 'name',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            firebase.auth().sendPasswordResetEmail(data.name).then(
              async () => {
                const alert = await this.alertCtrl.create({
                  message: 'Check your email for a password reset link',
                  buttons: [
                    {
                      text: 'Ok',
                      role: 'cancel',
                      handler: () => {
                        this.router.navigateByUrl('login');
                      }
                    }
                  ]
                });
                await alert.present();
              },
              async error => {
                const errorAlert = await this.alertCtrl.create({
                  message: error.message,
                  buttons: [{ text: 'Ok', role: 'cancel' }]
                });
                await errorAlert.present();
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }



  async goToRegister(){
    this.router.navigate(['register']);
  }


  handleLogin() {
    // Do your stuff here
}

switchForms(cmd) {
  
 
  
  this.formSwitcher = cmd;
  console.log('clicked', this.formSwitcher);
  if (this.formSwitcher=='signin') {
    
    setTimeout(()=> {
      this.renderer.setStyle(this.signInB[0].children[0], 'background', '#480B0B');
        this.renderer.setStyle(this.signInB[0].children[0], 'color', 'white');
        this.renderer.setStyle(this.signUpB[0].children[0], 'background', 'gray');
        this.renderer.setStyle(this.signUpB[0].children[0], 'color', '#480B0B');

      // console.log(this.signInForm[0]);
      this.renderer.setStyle(this.signInForm[0], 'transform', 'translateX(0)');
    this.renderer.setStyle(this.signUpForm[0], 'transform', 'translateX(100vw)');
    })
  } else {
    this.renderer.setStyle(this.signInB[0].children[0], 'background', 'gray');
        this.renderer.setStyle(this.signInB[0].children[0], 'color', '#480B0B');
        this.renderer.setStyle(this.signUpB[0].children[0], 'background', '#480B0B');
        this.renderer.setStyle(this.signUpB[0].children[0], 'color', 'white');
    // console.log(this.signUpForm);
    this.renderer.setStyle(this.signInForm[0], 'transform', 'translateX(100vw)');
    this.renderer.setStyle(this.signUpForm[0], 'transform', 'translateX(0vw)');
  }


}


}
