import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class MapService {

  constructor(private http: HttpClient) { }

  getGeoData(): Observable<any> {
    return this.http.get('/assets/data/geodata.json');
  }
}
