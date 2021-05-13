import { Component, OnInit } from '@angular/core';
import {RouteService} from '../../services/route.service';
import {IonPullUpFooterState} from 'ionic-pullup';
import {MapService} from '../../services/map.service';
import {IMapElementFeature} from '../../models/IMapElementFeature';
import {PlayerService} from '../../services/player.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-route-page',
  templateUrl: './route-page.component.html',
  styleUrls: ['./route-page.component.scss'],
})
export class RoutePageComponent implements OnInit {

  public footerState: IonPullUpFooterState;
  public geoDataForCommonMap: IMapElementFeature[];
  public route: IMapElementFeature;
  public playlist;
  private playerState;

  private playerSubscription: Subscription;

  constructor(private mapService: MapService,
              private routeService: RouteService,
              private playerService: PlayerService) {
  }

  ngOnInit() {
    this.mapService.getGeoData().subscribe( data => {
      this.geoDataForCommonMap = data;
    });
    this.route = this.routeService.getRoute();
    this.footerState = IonPullUpFooterState.Collapsed;
    this.playlist = this.playerService.setCurrentPlaylist(this.route.properties.id);

    this.playerSubscription = this.playerService.getState().subscribe(state => {
      this.playerState = state;
    });
  }

  public playAudio(trackId) {
    this.playerService.play(trackId);
  }

  public pauseAudio() {
    this.playerService.pause();
  }

  public toggleFooter() {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
    console.log(this.footerState);
  }

}
