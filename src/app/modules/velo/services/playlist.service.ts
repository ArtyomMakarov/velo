import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PlaylistService {

  constructor(private http: HttpClient) { }

  getPlaylistsData(): Observable<any> {
    return this.http.get('/assets/data/playlist.json');
  }
}
