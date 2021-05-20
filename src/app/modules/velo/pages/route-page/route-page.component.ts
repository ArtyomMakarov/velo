import {Component, OnDestroy, OnInit} from '@angular/core';
import {IonPullUpFooterState} from 'ionic-pullup';
import {MapService} from '../../services/map.service';
import {IMapElementFeature} from '../../models/IMapElementFeature';
import {PlayerService} from '../../services/player.service';
import {Subscription} from 'rxjs';
import {PlaylistService} from '../../services/playlist.service';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-route-page',
  templateUrl: './route-page.component.html',
  styleUrls: ['./route-page.component.scss'],
})
export class RoutePageComponent implements OnInit, OnDestroy {

  public footerState: IonPullUpFooterState;
  public geoDataForCommonMap: IMapElementFeature[];
  public route: IMapElementFeature;
  public playlist;
  public position;
  private playerState;

  private playerSubscription: Subscription;

  constructor(private mapService: MapService,
              private localStorageService: LocalStorageService,
              private playerService: PlayerService,
              private playlistService: PlaylistService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.mapService.getGeoData().subscribe( data => {
      this.geoDataForCommonMap = data;
    });

    this.activatedRoute.params.pipe(take(1))
        .subscribe( params => {
          this.route = this.localStorageService.get(params['id']);
    });

    this.footerState = IonPullUpFooterState.Collapsed;

    this.playlistService.getPlaylistsData().subscribe( data => {
      this.playerService.savePlaylistsData(data);
      this.playlist = this.playerService.setCurrentPlaylist(this.route.properties.id);
    });

    this.playerSubscription = this.playerService.getState().subscribe(state => {
      this.playerState = state;
    });
  }

  ngOnDestroy() {
    this.localStorageService.clear();
  }

  public seekTo(e: any) {
    this.playerService.seekTo(e.target.value);
  }

  public playAudio(trackId) {
    this.playerService.play(trackId);
  }

  public pauseAudio() {
    this.playerService.pause();
  }

  public changeTrack(direction: string) {
    this.playerService.changeTrack(direction);
  }

  public toggleFooter() {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

}
