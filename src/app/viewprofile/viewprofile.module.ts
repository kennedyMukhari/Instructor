import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewprofilePage } from './viewprofile.page';
import { ReactiveFormsModule }   from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ViewprofilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewprofilePage]
})
export class ViewprofilePageModule {}
