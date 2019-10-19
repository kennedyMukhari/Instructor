import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TheMapPage } from './the-map.page';
import { UserService } from '../user.service';

const routes: Routes = [
  {
    path: '',
    component: TheMapPage
  }
];
@Component ({
  providers: [
    UserService
  ]
})
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TheMapPage]
})
export class TheMapPageModule {}
