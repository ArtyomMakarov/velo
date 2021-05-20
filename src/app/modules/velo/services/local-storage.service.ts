import {Injectable} from '@angular/core';
import {IMapElementFeature} from '../models/IMapElementFeature';

@Injectable()
export class LocalStorageService {
  constructor() { }

  public set(key: string, data: IMapElementFeature): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }
  public get(str: string): IMapElementFeature {
    return JSON.parse(localStorage.getItem(str));
  }
  public clear(): void {
    localStorage.clear();
  }
}
