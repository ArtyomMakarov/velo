import { NgModule } from '@angular/core';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {AboutPageComponent} from './pages/about-page/about-page.component';
import {InstructionsPageComponent} from './pages/instructions-page/instructions-page.component';
import {SharedModule} from '../shared/shared.module';
import {MapComponent} from './components/map/map.component';



@NgModule({
  declarations: [
    MainPageComponent,
    AboutPageComponent,
    InstructionsPageComponent,
    MapComponent
  ],
  imports: [
    SharedModule
  ]
})
export class VeloModule { }
