import { Injectable } from '@angular/core';
import {IMapElementFeature} from '../models/IMapElementFeature';

@Injectable()
export class MemorialService {

  private _popUpFeature: IMapElementFeature;

  constructor() { }

  public safePopupFeature(popUpFeature: IMapElementFeature) {
    this._popUpFeature = popUpFeature;
  }

  public get getPopUpFeature(): IMapElementFeature {
    return this._popUpFeature;
  }
}
