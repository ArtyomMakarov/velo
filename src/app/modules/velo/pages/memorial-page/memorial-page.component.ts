import {Component, Input, OnInit} from '@angular/core';
import {IMapElementFeature} from '../../models/IMapElementFeature';
import {ModalController} from '@ionic/angular';
import {MemorialService} from '../../services/memorial.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-memorial-page',
  templateUrl: './memorial-page.component.html',
  styleUrls: ['./memorial-page.component.scss'],
})
export class MemorialPageComponent implements OnInit {
  public popUpFeature: IMapElementFeature;

  constructor(private modalController: ModalController,
              private memorialService: MemorialService,
              private router: Router) {
  }

  ngOnInit() {
    this.popUpFeature = this.memorialService.getPopUpFeature;
  }

  public dismiss() {
    this.router.navigate(['main']);
  }
}
