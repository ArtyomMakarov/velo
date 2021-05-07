import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { NavController, ModalController } from '@ionic/angular';
import { environment } from '../../../../../environments/environment';
import {IMapElementFeature} from '../../models/IMapElementFeature';
import {MemorialPageComponent} from '../../pages/memorial-page/memorial-page.component';
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

  constructor(public modalController: ModalController,
              private router: Router,
              private memorialService: MemorialService) {}

  ngOnInit() {
    this.filterGeoData();
    this.loadMap();
  }

  private filterGeoData() {
    this.points = this.geodata.features.filter( feature => feature.geometry.type === 'Point');
    this.geodata.features.forEach( feature => {
      switch (feature.geometry.type) {
        case 'Point':
          this.points.push(feature);
          break;
        case 'Polygon':
          this.polygons.push(feature);
      }
    });
    console.log(this.polygons, this.points);
  }

  public loadMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/navigation-guidance-night-v4?optimize=true',
      zoom: 13,
      center: [this.viewBox.lng, this.viewBox.lat],
      attributionControl: false
    });

    this.map.on('load', () => {
      this.map.resize();
      this.createMarkers();
      this.createPolygons();
    });
  }

  public createMarkers() {

    this.points.forEach( point => {
      const el = document.createElement('div');

      el.className = 'marker';
      el.style.backgroundImage =
        'url(/assets/icon/pointer.png)';
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.cursor = 'pointer';
      el.style.backgroundSize = '100%';

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
    const innerHtmlContent = `<div class="image">
                                  <img src="/assets/img/memorial/${popUpFeature.properties.image}" alt="${popUpFeature.properties.image_alt}">
                                </div>
                                <div class="detail">
                                  <p class="title">${popUpFeature.properties.name}</p>
                                </div>`;

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

  public async openDetailModal(feature: IMapElementFeature) {
    const modal = await this.modalController.create({
      component: MemorialPageComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'popUpFeature': feature
      }
    });
    return await modal.present();
  }

}
