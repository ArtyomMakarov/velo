import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from './modules/velo/pages/main-page/main-page.component';
import {AboutPageComponent} from './modules/velo/pages/about-page/about-page.component';
import {InstructionsPageComponent} from './modules/velo/pages/instructions-page/instructions-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'about',
    component: AboutPageComponent
  },
  {
    path: 'instructions',
    component: InstructionsPageComponent
  },
  {
    path: 'main',
    component: MainPageComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
