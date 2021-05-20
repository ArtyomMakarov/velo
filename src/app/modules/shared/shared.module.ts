import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IonicPullupModule } from 'ionic-pullup';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [CommonModule, IonicModule, IonicPullupModule, FormsModule],
  exports: [CommonModule, IonicModule, IonicPullupModule, FormsModule]
})
export class SharedModule { }
