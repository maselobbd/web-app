import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackgroundImageService {

  private backgroundImages: string[] = [
    '../../../../assets/images/backgroundImage-1.jpg',
    '../../../../assets/images/backgroundImage-2.jpg',
    '../../../../assets/images/backgroundImage-3.jpg',
    '../../../../assets/images/backgroundImage-4.jpg',
    '../../../../assets/images/backgroundImage-5.jpg',
    '../../../../assets/images/backgroundImage-6.jpg',
    '../../../../assets/images/backgroundImage-7.jpg',
    '../../../../assets/images/backgroundImage-8.jpg',
    '../../../../assets/images/backgroundImage-9.jpg',
    '../../../../assets/images/backgroundImage-10.jpg',
    '../../../../assets/images/backgroundImage-11.jpg',
    '../../../../assets/images/backgroundImage-12.jpg',
    '../../../../assets/images/backgroundImage-13.jpg',
    '../../../../assets/images/backgroundImage-14.jpg',
  ];

  getRandomBackgroundImage(): string {
    const randomIndex = Math.floor(Math.random() * this.backgroundImages.length);
    return this.backgroundImages[randomIndex];
  }
}
