import { Component, OnInit } from '@angular/core';
import { IonPullUpFooterState } from 'ionic-pullup';
import {MapService} from '../../services/map.service';
import {IMapElementFeature} from '../../models/IMapElementFeature';
import {RouteService} from '../../services/route.service';
import {Router} from '@angular/router';

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
              private routeService: RouteService,
              private router: Router) {
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  ngOnInit() {
    this.mapService.getGeoData().subscribe( data => {
      this.geoDataForCommonMap = data;
      this.routes = data.features
        .filter((feature) => feature.properties.type === 'route').sort((a, b) => a.properties.order - b.properties.order);
    });
  }

  public toggleFooter() {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

  public routeSelected(route: IMapElementFeature): void {
    this.routeService.safeRoute(route);
    this.router.navigate(['route', route.properties.name]);
  }

}
