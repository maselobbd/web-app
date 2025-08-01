import { Injectable } from '@angular/core';
import { ImagePaths } from '../../../admin/enums/imagePaths';

@Injectable({
  providedIn: 'root'
})
export class ImagePreloadService {
  private preloadedImages = new Set<string>();

  constructor() {
    this.preloadUniversityImages();
  }

  private preloadUniversityImages(): void {
    const imageUrls = [
      ImagePaths.WITS,
      ImagePaths.NMU,
      ImagePaths.UFS,
      ImagePaths.UJ,
      ImagePaths.UP,
      ImagePaths.CT,
      ImagePaths.CPU,
      ImagePaths.RUR,
      ImagePaths.BCU,
      ImagePaths.UNISA,
      ImagePaths.UKZN,
      ImagePaths.DEFAULT
    ];

    imageUrls.forEach(url => this.preloadImage(url));
  }

  private preloadImage(url: string): void {
    if (this.preloadedImages.has(url)) return;

    const img = new Image();
    img.src = url;
    this.preloadedImages.add(url);
  }

  preloadImageIfNeeded(url: string): void {
    if (!this.preloadedImages.has(url)) {
      this.preloadImage(url);
    }
  }
}