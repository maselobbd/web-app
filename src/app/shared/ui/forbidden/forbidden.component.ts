import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../authentication/data-access/services/auth.service';
import { BackgroundImageService } from '../../data-access/services/background-image.service';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: [
    '../landing-screen/landing-screen.component.scss',
    '../unauthorised/unauthorised.component.scss',
    './forbidden.component.scss',
  ],
})
export class ForbiddenComponent implements OnInit{
  @Input() backgroundImageUrl: string = '';

  constructor(private authService: AuthService,
    private backgroundImageService: BackgroundImageService
  ) {}

  ngOnInit(): void {
    this.backgroundImageUrl = this.backgroundImageService.getRandomBackgroundImage();
  }

  login(): void {
    this.authService.login();
  }
}
