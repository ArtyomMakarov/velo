import { Component, OnInit } from '@angular/core';
import {RouteService} from '../../services/route.service';
import {IonPullUpFooterState} from 'ionic-pullup';
import {MapService} from '../../services/map.service';
import {IMapElementFeature} from '../../models/IMapElementFeature';

@Component({
  selector: 'app-route-page',
  templateUrl: './route-page.component.html',
  styleUrls: ['./route-page.component.scss'],
})
export class RoutePageComponent implements OnInit {

  public footerState: IonPullUpFooterState;
  public geoDataForCommonMap: IMapElementFeature[];
  public route: IMapElementFeature;

  constructor(private mapService: MapService,
              private routeService: RouteService) {
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  ngOnInit() {
    this.mapService.getGeoData().subscribe( data => {
      this.geoDataForCommonMap = data;
    });
    this.route = this.routeService.getRoute();
  }

  public toggleFooter() {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
    console.log(this.footerState);
  }

}
