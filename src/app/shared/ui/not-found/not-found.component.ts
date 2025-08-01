import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../authentication/data-access/services/auth.service';
import { BackgroundImageService } from '../../data-access/services/background-image.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: [
    '../landing-screen/landing-screen.component.scss',
    '../unauthorised/unauthorised.component.scss',
    './not-found.component.scss',
  ],
})
export class NotFoundComponent implements OnInit {
  @Input() backgroundImageUrl: string = '';
  constructor(private authService: AuthService,
    private backgroundImageService: BackgroundImageService
  ) {}

  login(): void {
    this.authService.login();
  }

  ngOnInit(): void {
    this.backgroundImageUrl = this.backgroundImageService.getRandomBackgroundImage();
  }

}
