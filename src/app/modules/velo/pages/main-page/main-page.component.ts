import { Component, OnInit } from '@angular/core';
import { IonPullUpFooterState } from 'ionic-pullup';
import {MapService} from '../../services/map.service';
import {IMapElementFeature} from '../../models/IMapElementFeature';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {

  public footerState: IonPullUpFooterState;
  public geoDataForCommonMap: IMapElementFeature[];
  public routes: IMapElementFeature[];
  public footerTitle = 'Выбор Маршрута';

  constructor(private mapService: MapService,
              private router: Router,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;

    this.mapService.getGeoData().subscribe( data => {
      this.geoDataForCommonMap = data;
      this.routes = data.features
        .filter((feature) => feature.properties.type === 'route').sort((a, b) => a.properties.order - b.properties.order);
    });
  }

  public toggleFooter() {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
    console.log(this.footerState);
  }

  public routeSelected(route: IMapElementFeature): void {
    this.localStorageService.set(route.properties.name, route);
    this.router.navigate(['route', route.properties.name]);
  }

}
