import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../app/user/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Directive, HostListener, Output, EventEmitter, ElementRef, Input } from '@angular/core';
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

    let loader = await this.loadingCtrl.create({
      message: '<ion-img src="../../assets/StepLogo.svg" alt="loading..."></ion-img>',
      cssClass: 'scale-down-center',
      translucent: true,
      showBackdrop: false,
      spinner: null,
      duration: 2000
    })
    // loader.present()
    firebase.auth().onAuthStateChanged(user => {
      if (user) {

        console.log("The current user id is", user.uid);

        loader.dismiss()
        this.db.collection('drivingschools').where('schooluid', '==', user.uid).get().then(res => {
          if (res.empty) {
            
            this.router.navigateByUrl('profile');
          } else {
            
            this.router.navigate(['main']);
          }
        })
      } else {
loader.dismiss()
      }
    })
  }

  async loginUser(signinForm: FormGroup): Promise<void> {
    this.loaderAnimate = true;
    if (!signinForm.valid) {
      console.log('Form is not valid yet, current value:', signinForm.value);
      this.loaderAnimate = false;
    } else {
      
      let loading = await this.loadingCtrl.create({

        
      });
      // await loading.present();
      setTimeout(() => {
        // loading.dismiss();
      }, 4000)


      const email = signinForm.value.email;
      const password = signinForm.value.password;

      this.authService.loginUser(email, password).then(
        (user) => {
          // this.loading.dismiss().then(() => {
          //   this.router.navigateByUrl('main');
          // });
          firebase.auth().onAuthStateChanged(user => {
            if (user.uid) {
              this.db.collection('drivingschools').where('schooluid', '==', user.uid).get().then(res => {
                if (res.empty) {
                  // this.loading.dismiss();\
                  this.loaderAnimate = false;
                  this.router.navigate(['profile']);
                  
                } else {
                  // this.loading.dismiss()
                  this.loaderAnimate = false;
                  this.router.navigate(['main/the-map']);
                }
              })
            }
          })
        },
        async (error) => {
          // this.loading.dismiss().then(async () => {
          //   const alert = await this.alertCtrl.create({
          //     message: error.message,
          //     buttons: [{ text: 'Ok', role: 'cancel' }]
          //   });
          //   await alert.present();
          // });
          this.loaderAnimate = false;
          const alert = await this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: 'Ok', role: 'cancel' }]
          });
          await alert.present();
        }
      );
    }
  }
  async signupUser(signupForm: FormGroup): Promise<void> {
    this.loaderAnimate = true;
    console.log('Method is called');

    if (!signupForm.valid) {
      console.log(
        'Need to complete the form, current value: ',
        signupForm.value
      );
      this.loaderAnimate = false;
    } else {
      const email: string = signupForm.value.email;
      const password: string = signupForm.value.password;

      this.authService.signupUser(email, password).then(
        () => {
          this.loading.dismiss().then(() => {
            this.loaderAnimate = false;
            // this.router.navigateByUrl('profile');
            this.router.navigateByUrl('profile');
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            this.loaderAnimate = false;
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            // await alert.present();
          });
        }
      );
      this.loading = await this.loadingCtrl.create();
      // await this.loading.present();
      
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
