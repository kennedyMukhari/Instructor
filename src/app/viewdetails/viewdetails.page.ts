import { Router } from '@angular/router';
import { UserService } from './../user.service';
import { Component, OnInit, NgZone } from '@angular/core';


@Component({
  selector: 'app-viewdetails',
  templateUrl: './viewdetails.page.html',
  styleUrls: ['./viewdetails.page.scss'],
  providers: [UserService]
})
export class ViewdetailsPage implements OnInit {
  user = {}
  constructor(private userService: UserService, public zone:NgZone, private rounte: Router) { }

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
}
