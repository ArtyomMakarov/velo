import {Component, OnInit, Input} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../../../environments/environment';
import {IMapElementFeature} from '../../models/IMapElementFeature';
import {Router} from '@angular/router';
import {MemorialService} from '../../services/memorial.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements  OnInit {

  private viewBox = {
    lng: 23.6913,
    lat: 52.0878
  };

  public map: mapboxgl.Map;
  public points = [];
  public polygons = [];

  @Input() geodata: {
    type: string;
    features: IMapElementFeature[];
  };

  @Input() route: IMapElementFeature;

  constructor(private router: Router,
              private memorialService: MemorialService) {}

  ngOnInit() {
    this.filterGeoData();
    this.loadMap();
  }

  private createLineString() {
    this.map.addSource('route', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': this.route.geometry.coordinates
        }
      }
    });

   this.map.addLayer({
      'id': 'route',
      'type': 'line',
      'source': 'route',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': 'rgb(189, 32, 49)',
        'line-width': 10
      }
    });
  }

  private filterGeoData() {

    this.geodata.features.forEach( feature => {
      switch (feature.geometry.type) {
        case 'Point':
          this.points.push(feature);
          break;
        case 'Polygon':
          this.polygons.push(feature);
      }
    });

    if (this.route) {
      this.points = [];

      this.route.properties.locations.forEach( location => {

        this.geodata.features.forEach( feature => {

          if (location[0] === feature.id) {
            feature.markerNumber = location[1];
            this.points.push(feature);
          }

        });

      });

    }
    console.log(this.polygons, this.points);
  }

  public loadMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10?optimize=true',
      zoom: 13,
      center: [this.viewBox.lng, this.viewBox.lat],
      attributionControl: false
    });

    this.map.on('load', () => {
      this.map.resize();
      this.createMarkers();
      this.createPolygons();
      if (this.route) this.createLineString();
    });
  }

  public createMarkers() {

    this.points.forEach( point => {
      const el = document.createElement('div');
      let markerImageHTML: string;

      if (point.markerNumber) {
        markerImageHTML = `<div style="background-image: url(/assets/icon/pointer-1.png);
                                                      width: 50px;
                                                      height: 53px;
                                                      background-size: 100%;
                                                      color: white;
                                                      font-size: 18px;
                                                      padding: 14px;
                                                      text-align: center;
                                                      cursor = pointer;">
                            ${point.markerNumber}</div>`;
      } else {
        markerImageHTML = `<div style="background-image: url(/assets/icon/pointer.png);
                                                       width: 50px;
                                                       height: 53px;
                                                       background-size: 100%;
                                                       cursor = pointer;"></div>`;
      }

      el.innerHTML = markerImageHTML;

      const div = this.createDOMDivForPopup(point);

      const popup = new mapboxgl.Popup().setDOMContent(div);

      const marker = new mapboxgl.Marker({element: el})
        .setLngLat([point.geometry.coordinates[0], point.geometry.coordinates[1]])
        .setPopup(popup)
        .addTo(this.map);
    });
  }

  public createPolygons() {
    this.polygons.forEach( (polygon, index) => {
      this.map.addSource(polygon.properties.name, {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': polygon.geometry.coordinates
          }
        }
      });

      this.map.addLayer({
        'id': polygon.properties.name,
        'type': 'fill',
        'source': polygon.properties.name, // reference the data source
        'layout': {},
        'paint': {
          'fill-color': '#5fbbff', // blue color fill
          'fill-opacity': 0.5
        }
      });
      // Add a blue outline around the polygon.
      this.map.addLayer({
        'id': 'outline' + index,
        'type': 'line',
        'source': polygon.properties.name,
        'layout': {},
        'paint': {
          'line-color': '#5fbbff',
          'line-width': 3
        }
      });

      this.createPopUp(polygon);
    });
  }

  public createPopUp(popUpFeature: IMapElementFeature) {

    this.map.on('click', popUpFeature.properties.name, (e) => {

      const coordinates = e.lngLat;

      const div = this.createDOMDivForPopup(popUpFeature);

      if (e.originalEvent.target.classList.contains('marker')) return;

      new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setDOMContent(div)
          .addTo(this.map);
    });

    this.map.on('mouseenter', popUpFeature.properties.name, () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', popUpFeature.properties.name, () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  public createDOMDivForPopup(popUpFeature: IMapElementFeature): HTMLDivElement {
    let innerHtmlContent: string;

    if(!popUpFeature.properties.image) {
      innerHtmlContent = `<div class="detail">
                             <p class="title">${popUpFeature.properties.name}</p>
                          </div>`;
    } else {
      innerHtmlContent = `<div class="image">
                                  <img src="/assets/img/memorial/${popUpFeature.properties.image}" alt="${popUpFeature.properties.image_alt}">
                          </div>
                          <div class="detail">
                            <p class="title">${popUpFeature.properties.name}</p>
                          </div>`;
    }

    const divElement = document.createElement('div');
    const assignBtn = document.createElement('div');

    assignBtn.innerHTML = `<span class="show-more"><a>Подробнее</a></span>`;
    assignBtn.style.cursor = 'pointer';
    divElement.innerHTML = innerHtmlContent;
    divElement.appendChild(assignBtn);

    assignBtn.addEventListener('click', (e) => {
      this.memorialService.safePopupFeature(popUpFeature);
      this.router.navigate(['memorial', popUpFeature.properties.name]);
    });

    return divElement;
  }

}
