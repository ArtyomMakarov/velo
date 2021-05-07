import { NgModule } from '@angular/core';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {AboutPageComponent} from './pages/about-page/about-page.component';
import {InstructionsPageComponent} from './pages/instructions-page/instructions-page.component';
import {SharedModule} from '../shared/shared.module';
import {MapComponent} from './components/map/map.component';
import {MapService} from './services/map.service';
import {MemorialPageComponent} from './pages/memorial-page/memorial-page.component';
import {RouteService} from './services/route.service';
import {RoutePageComponent} from './pages/route-page/route-page.component';
import {MemorialService} from './services/memorial.service';


@NgModule({
  declarations: [
    MainPageComponent,
    AboutPageComponent,
    InstructionsPageComponent,
    MapComponent,
    MemorialPageComponent,
    RoutePageComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    MapService,
    RouteService,
    MemorialService
  ]
})
export class VeloModule { }
