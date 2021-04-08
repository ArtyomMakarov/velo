import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { YagaModule } from '@yaga/leaflet-ng2';



@NgModule({
  declarations: [],
  imports: [CommonModule, IonicModule, YagaModule],
  exports: [CommonModule, IonicModule, YagaModule]
})
export class SharedModule { }
