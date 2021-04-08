import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  private viewBox = {
    lng: 23.6913,
    lat: 52.0878
  }

  public tileLayerUrl = '//api.mapbox.com/styles/v1/dima555/cj2t5dadn000d2smwuxcj06m9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGltYTU1NSIsImEiOiJjajJ0NTJnYjcwMGFrMnBxY3dxZG9zeTdhIn0.cezOb6cZVpHFWz1UF37sFg'; // OSM_TILE_LAYER_URL;

  constructor() {
    let map: Map<string, number> = new Map();

  }

  ngOnInit() {}

}
