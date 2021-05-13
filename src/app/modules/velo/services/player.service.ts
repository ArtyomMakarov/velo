import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media/ngx';

const PATH_TO_AUDIO = 'https://breststories.com/audio/';

interface PlayerState {
  audioData: any;
  trackName: string;
  status: 'play' | 'pause';
  position?: number;
}

@Injectable()
export class PlayerService {

  private state$ = new BehaviorSubject<PlayerState>(null);

  private audioFile: MediaObject;
  private playlists = [];
  private currentPlaylist;
  private currentTrackId = 0;

  private onStatusUpdateSubscription;
  constructor(private media: Media, private http: HttpClient) {
    this.http.get('/assets/data/playlist.json').subscribe((data: any) => {
      this.playlists = data.playlists;
      console.log(this.playlists);
    });
  }

  getState() {
    return this.state$;
  }

  setCurrentPlaylist(routeId): object | undefined {
    const playlist = this.playlists.find( playlist => playlist.routeId === routeId);
    this.currentPlaylist = playlist && playlist.audioList;

    this.currentTrackId = 0;
    let audioData = this.currentPlaylist[this.currentTrackId];

    this.state$.next({
      trackName: audioData && audioData.name,
      status: 'pause',
      audioData
    });

    return this.currentPlaylist;
  }

  play(trackId = null) {

    let audioData;

    // play after pause
    if (trackId === null) {
      const state = this.state$.getValue();
      audioData = state.audioData;

      if(!this.audioFile) { // first turning on
        this.audioFile = this.media.create(PATH_TO_AUDIO + audioData.source);
      }

    } else {
      this.currentTrackId = trackId;
      audioData = this.currentPlaylist[trackId];

      this.stop();  // previous track remove

      this.audioFile = this.media.create(PATH_TO_AUDIO + audioData.source);
    }

    this.audioFile.play();

    this.state$.next({
      trackName: audioData.name,
      status: 'play',
      audioData
    });

    this.onStatusUpdateSubscription = this.audioFile.onStatusUpdate.subscribe(state => {
      if (state === MEDIA_STATUS.STOPPED) {
        // alert('STOPPED audio');

        if (this.playlists.length > this.currentTrackId + 1) {
          this.play(this.currentTrackId + 1)
        } else {
          this.currentTrackId = 0;
        }
        // this.onStatusUpdateSubscription.unsubscribe();
      }
    });
  }

  pause() {
    const state = this.state$.getValue();
    this.state$.next({
      ...state,
      status: 'pause',
    });
    this.audioFile.pause();
  }

  stop() {
    if (this.audioFile) {
      this.onStatusUpdateSubscription.unsubscribe();
      this.audioFile.stop();
      this.audioFile.release();
    }
  }

  getPosition() {
    return this.audioFile.getCurrentPosition();
  }

  getAudioDuration() {
    return this.audioFile.getDuration();
  }

  seekTo(seconds) {
    this.audioFile.seekTo(seconds * 1000);
  }
}
