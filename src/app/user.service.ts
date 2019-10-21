
import {Injectable} from '@angular/core'

interface user{
username: string,
uid: string
}

@Injectable()
export class UserService {
  public userProfile: Object = {
      book: null,
datein: "",
dateout: "",
docid: "",
image: "",
location: "",
name: "",
packageName: "",
phone: "",
placeid: null,
time: "",
   }
private user:user
constructor (){

}
setUser(user: user){
 this.user = user  
}
getUID(){
   return this.user.uid 
}
storeUserProfile(profile: Object) {
   this.userProfile = profile;
   // console.log('got profile',this.userProfile);
   
}
async getUserProfile() {
   // console.log('return bookig', this.userProfile);
   
   return this.userProfile
}
}