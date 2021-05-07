import { Injectable } from '@angular/core';
import {IMapElementFeature} from '../models/IMapElementFeature';

@Injectable()
export class RouteService {
  private _route: IMapElementFeature;

  constructor() { }

  public safeRoute(route: IMapElementFeature): void {
    this._route = route;
  }

  public getRoute(): IMapElementFeature {
    return this._route;
  }
}
