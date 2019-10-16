import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.page.html',
  styleUrls: ['./viewprofile.page.scss'],
})
export class ViewprofilePage implements OnInit {
  school = {}
  db = firebase.firestore();
  constructor() {
    firebase.auth().onAuthStateChanged(user =>{
      if (user) {
        this.db.collection('drivingschools').where('schooluid','==',user.uid).onSnapshot(snapshot => {
     
     snapshot.forEach(doc =>{
      console.log(doc.data());
      
     })
    });
      }
    })
    


  }

  ngOnInit() {
  }

}
