import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../authentication/data-access/services/auth.service';
import { BackgroundImageService } from '../../data-access/services/background-image.service';

@Component({
  selector: 'app-unauthorised',
  templateUrl: './unauthorised.component.html',
  styleUrls: [
    '../landing-screen/landing-screen.component.scss',
    './unauthorised.component.scss',
  ],
})
export class UnauthorisedComponent implements OnInit {
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
