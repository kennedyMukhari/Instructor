import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewprofilePage } from './viewprofile.page';

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
  declarations: [ViewprofilePage],
  providers: [FormBuilder]
})
export class ViewprofilePageModule {}
