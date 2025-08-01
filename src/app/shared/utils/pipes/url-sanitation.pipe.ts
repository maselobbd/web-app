import { Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';

@Pipe({
  name: 'urlSanitation',
})
export class UrlSanitationPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string, type: string): SafeResourceUrl | SafeUrl {
    switch (type) {
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(url);
      default:
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
}
