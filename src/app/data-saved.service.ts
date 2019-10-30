import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSavedService {

  constructor() { }

  NewRequesteWithPictures = []; 

  
  AcceptedData = [];
  SavedData = [];
  DeliveredData = [];

  Packages = [
    
    {code01: [ //3
    ],
  price: 0},

    {code08: [ //0
    ],
    price: 0},

    {code10: [ //1
    ],
    price: 0},

    
    {code14: [ //2
    ],
    price: 0}
  ];
}
