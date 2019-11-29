import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as Chart from 'chart.js';
import { Platform } from '@ionic/angular';
import { DataSavedService } from '../../app/data-saved.service'

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {

viewImage = {
    image: '',
    open: false
  }
  @ViewChild('barChart', {static: false}) barChart;
//database 

public unsubscribeBackEvent: any;

db = firebase.firestore();
user = {
  uid: ''
}

Data = [];
NewData = [];
accepted = {
  mon: [],
tue:[],
wed: [],
thu: [],
fri: [],
sat: [],
sun: [],
}
rejected = {
  mon: [],
tue:[],
wed: [],
thu: [],
fri: [],
sat: [],
sun: [],
}

AcceptedData = 0
RejectedData = 0

//array from database
// charts =[];
NewDrivingschool=[];
Drivingschool=[];

charts: any;
  colorArray: any;
  constructor(private router: Router,
     private platform: Platform,
     public renderer: Renderer2, 
     public elementref: ElementRef, 
     public data : DataSavedService
     ) {

    
     


    this.db.collection('drivingschools').onSnapshot(snapshot => {
      this.NewDrivingschool = [];
     
      snapshot.forEach(Element => {
       
            this.Drivingschool.push(Element.data());
      });
      this.Drivingschool.forEach(item => {
      
        if(item.schooluid === firebase.auth().currentUser.uid){
           this.NewDrivingschool.push(item);
             
                 
              }
      })
      
      console.log('NewDrivingschool', this.NewDrivingschool);
    
    }); 

    
   }

  ngOnInit() {
   this.openImage('', 'close');
    firebase.auth().onAuthStateChanged(res => {
      this.user.uid = res.uid;
    })
    this.getRequests();
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

  ionViewWillEnter() {
    
    this.platform.ready().then(() => {
      console.log('Core service init');
      const tabBar = document.getElementById('myTabBar');
       tabBar.style.display = 'flex';
    });

    this.db.collection('drivingschools').onSnapshot(snapshot => {
      this.Data = [];
      this.NewData = [];
     
      snapshot.forEach(Element => {
       
            this.Data.push(Element.data());
  
      });


      this.Data.forEach(item => {
      
        if(item.schooluid === firebase.auth().currentUser.uid){
                 this.NewData.push(item);
                 console.log('NewDrivingschool', this.NewData);  
              }
      })
  
  }); 

  
//  this.openImage('', 'close');
  this.getRequests();
  console.log('accpeted data', this.AcceptedData);
}

  


  getRequests() {

    this.db.collection('bookings').where('schooluid', '==',firebase.auth().currentUser.uid).onSnapshot(res => {
      this.AcceptedData = 0;
      this.RejectedData = 0;
      this.rejected.mon = []
      this.rejected.tue = []
      this.rejected.wed = []
      this.rejected.thu = []
      this.rejected.fri = []
      this.rejected.sat = []
      this.rejected.sun = []

      this.accepted.mon = []
      this.accepted.tue = []
      this.accepted.wed = []
      this.accepted.thu = []
      this.accepted.fri = []
      this.accepted.sat = []
      this.accepted.sun = []
    console.log(res);
      res.forEach(doc => {
        if (doc.data().confirmed == 'rejected') {

          let date = doc.data().datecreated
        let newDate = date.split(" ")
       
        
        if (newDate[0] == "Mon") {
          this.rejected.mon.push(doc.data())
          this.RejectedData = this.RejectedData + 1;
        } else if (newDate[0] == "Tue") {
          this.rejected.tue.push(doc.data())
          this.RejectedData = this.RejectedData + 1;
        }else if (newDate[0] == "Wed") {

          this.rejected.wed.push(doc.data())
          this.RejectedData = this.RejectedData + 1;
        }
        else if (newDate[0] == "Thu") {
          this.rejected.thu.push(doc.data())
          this.RejectedData = this.RejectedData + 1;
        }
        else if (newDate[0] == "Fri") {
          this.rejected.fri.push(doc.data())
          this.RejectedData = this.RejectedData + 1;
        }
        else if (newDate[0] == "Sat") {
          this.rejected.sat.push(doc.data())
          this.RejectedData = this.RejectedData + 1;
        }
        else if (newDate[0] == "Sun") {
          this.rejected.sun.push(doc.data())
          this.RejectedData = this.RejectedData + 1;
        }

     
        
        } else {
          let date = doc.data().datecreated
        let newDate = date.split(" ")
       
        
        if (newDate[0] == "Mon") {
          this.accepted.mon.push(doc.data())
          this.AcceptedData = this.AcceptedData + 1;
        } else if (newDate[0] == "Tue") {
          this.accepted.tue.push(doc.data())
          this.AcceptedData = this.AcceptedData + 1;
        }else if (newDate[0] == "Wed") {
          this.accepted.wed.push(doc.data())
          this.AcceptedData = this.AcceptedData + 1;
        }
        else if (newDate[0] == "Thu") {
          this.accepted.thu.push(doc.data())
          this.AcceptedData = this.AcceptedData + 1;
        }
        else if (newDate[0] == "Fri") {
          this.accepted.fri.push(doc.data())
          this.AcceptedData = this.AcceptedData + 1;
        }
        else if (newDate[0] == "Sat") {
          this.accepted.sat.push(doc.data())
          this.AcceptedData = this.AcceptedData + 1;
        }
        else if (newDate[0] == "Sun") {
          this.accepted.sun.push(doc.data())
          this.AcceptedData = this.AcceptedData + 1;
        }
        }
      });
      this.createBarChart();
      console.log('rejected' ,this.rejected);
      console.log('accepted' ,this.accepted);
    })

  }

//   createBarChart() {

//     this.charts = new Chart(this.barChart.nativeElement, {
//       type: 'line',
//       data: {
//         labels: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
//         datasets: [{
//           label: 'Lessons offered per day',
//           // data: [this.mon.length, this.tue.length, this.wed.length, this.thu.length, this.fri.length, this.sat.length, this.sun.length],
//            data: [this.mon.length, this.tue.length, this.wed.length, this.thu.length, this.fri.length, this.sat.length, this.sun.length],
//           backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
//           borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
//           borderWidth: 1
//         }]
//       },
      

//       options: {
//         scales: {
//           yAxes: [{
//             ticks: {
//               beginAtZero: true
//             }
//           }]
//         }
//       }
//     });
// }


createBarChart() {
  
  this.charts = new Chart(this.barChart.nativeElement,  {
    type: 'line',
    data: {
      labels: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      datasets: [{
        
        label: 'accepted' ,
        data: [this.accepted.mon.length, this.accepted.tue.length,this.accepted.wed.length,this.accepted.thu.length, this.accepted.fri.length, this.accepted.sat.length, this.accepted.sun.length],
        backgroundColor: 'rgba(77, 209, 0, 0.534)',// array should have same number of elements as number of dataset
        borderColor: 'rgb(156, 255, 98)',// array should have same number of elements as number of dataset
        borderWidth: 1
      },
      {
        
        label: 'declined',
        data: [this.rejected.mon.length, this.rejected.tue.length,this.rejected.wed.length,this.rejected.thu.length,this.rejected.fri.length,this.rejected.sat.length,this.rejected.sun.length],
        backgroundColor: 'rgba(204, 0, 0, 0.657)', // array should have same number of elements as number of dataset
        borderColor: '#FF0000',// array should have same number of elements as number of dataset
        borderWidth: 1
      }]
    },
  });
}

showTab(){
  this.platform.ready().then(() => {
    console.log('Core service init');
    const tabBar = document.getElementById('myTabBar');
    tabBar.style.display = 'flex';
  });   
}


  goToPastB() {
    this.router.navigate(['past-b']);
  }


  openImage(image, cmd) {
    if (cmd == 'open') {
      this.viewImage.image = image;
      this.viewImage.open = true
    } else {
      this.viewImage.image = image;
      this.viewImage.open = false
    }
    
  } 


}
