import { Component, Input, OnInit } from '@angular/core';
import { BackgroundImageService } from '../../data-access/services/background-image.service';
import { AdditionaInfoMessageType } from '../../enums/messages';
import { getLogo } from '../../utils/functions/getLogo';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-maintenance-page',
  templateUrl: './maintenance-page.component.html',
  styleUrls: [
    './maintenance-page.component.scss',
    '../unauthorised/unauthorised.component.scss',
    '../landing-screen/landing-screen.component.scss'
  ]
})
export class MaintenancePageComponent implements OnInit {
  @Input() backgroundImageUrl: string = '';
  messageHeading: string = AdditionaInfoMessageType.MAINTENANCE_HEADING;
  messageSub: string = AdditionaInfoMessageType.MAINTENANCE_SUBHEADING;
  logoUrl: string = getLogo();

  constructor(
    private backgroundImageService: BackgroundImageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}
  
  ngOnInit():void {
    this.backgroundImageUrl = this.backgroundImageService.getRandomBackgroundImage();
    this.activatedRoute.data.subscribe(data => {
        if(!data['maintenance'].results) {
          this.router.navigate(['/']);
        };
    })
  }
}
