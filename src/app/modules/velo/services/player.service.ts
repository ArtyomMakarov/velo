import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media/ngx';

const PATH_TO_AUDIO = 'https://breststories.com/audio/';

interface PlayerState {
  audioData: any;
  trackName: string;
  duration?: number;
  timerCount?: number;
  position?: number;
  status: 'play' | 'pause';
}

@Injectable()
export class PlayerService {

  private state$ = new BehaviorSubject<PlayerState>(null);

  private audioFile: MediaObject;
  private playlists = [];
  private currentPlaylist;
  private currentTrackId = 0;
  private duration: number;
  private isPause = false;
  private timerCount = 0;
  private timer;
  private progressBarTimer;
  private onStatusUpdateSubscription;

  constructor(private media: Media) {}

  public getState() {
    return this.state$;
  }

  public savePlaylistsData(data: any) {
    this.playlists = data.playlists;
  }

  public setCurrentPlaylist(routeId): object | undefined {
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

  public async play(trackId = null) {

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

    await this.getDuration();
    this.controlPosition();
    this.audioFile.play();
    this.isPause = false;
    this.setTimer();

    const state = this.state$.getValue();
    this.state$.next({
      ...state,
      trackName: audioData.name,
      status: 'play',
      duration: this.duration,
      audioData
    });


    this.onStatusUpdateSubscription = this.audioFile.onStatusUpdate.subscribe(state => {
      if (state === MEDIA_STATUS.STOPPED) {
        // alert('STOPPED audio');

        if (this.currentPlaylist.length > this.currentTrackId + 1) {
          this.play(this.currentTrackId + 1);
        } else {
          this.currentTrackId = 0;
        }
      }
    });
  }

  public controlPosition() {
    this.progressBarTimer = setInterval(() => {
      this.audioFile.getCurrentPosition().then((pos) => {
        const state = this.state$.getValue();
        this.state$.next({
          ...state,
          position: pos,
        });
        if (pos >= this.duration) {
          clearInterval(this.progressBarTimer);
        }
      });
    }, 100);
  }

  public seekTo(progress: number) {
    this.audioFile.seekTo(progress * 1000);
    this.play();
    this.timerCount = progress;
    const state = this.state$.getValue();
    this.state$.next({
      ...state,
      timerCount: progress,
      position: progress,
    });
  }

  public async getDuration(): Promise<any> {
    // without setInterval, duration = -1
    let counter = 0;
    let promise = new Promise((resolve) => {
      let timerDur = setInterval(() => {
        counter = counter + 100;
        if (counter > 2000) {
          clearInterval(timerDur);
        }
        this.duration = this.audioFile.getDuration();
        if (this.duration > 0) {
          resolve(this.duration);
          clearInterval(timerDur);
        }
      }, 100);
    });
    return promise;
  }

  public setTimer() {
    this.timer = setInterval( () => {
      if (!this.isPause) {
        const state = this.state$.getValue();
        if (this.timerCount >= state.duration) {
          this.timerCount = 0;
        }
        this.state$.next({
          ...state,
          timerCount: this.timerCount++,
        });
      }
    }, 1000);
  }

  public pause() {
    this.isPause = true;
    clearInterval(this.timer);
    clearInterval(this.progressBarTimer);
    const state = this.state$.getValue();
    this.state$.next({
      ...state,
      status: 'pause',
    });
    this.audioFile.pause();
  }

  public stop() {
    this.isPause = true;
    this.timerCount = 0;
    clearInterval(this.timer);
    clearInterval(this.progressBarTimer);

    if (this.audioFile) {
      this.onStatusUpdateSubscription.unsubscribe();
      this.audioFile.stop();
      this.audioFile.release();
    }
  }

  public changeTrack(direction: string) {
    clearInterval(this.timer);
    if (direction === 'forward') {
      if (this.currentPlaylist.length > this.currentTrackId + 1) {
        this.play(this.currentTrackId + 1);
      } else {
        this.currentTrackId = 0;
      }
    } else {
        if (this.currentTrackId - 1 >= 0) {
          this.play(this.currentTrackId - 1);
        } else {
          this.currentTrackId = this.currentPlaylist.length - 1;
        }
    }
  }
}
