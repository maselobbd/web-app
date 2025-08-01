import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const isWarmUp = new URLSearchParams(request.url.split('?')[1]).get('isWarmUp');
    const shouldShowLoader = !request.url.includes("/location");
    
    if (request.url.includes('/universityDepartments')|| isWarmUp === 'true' || request.url.includes('api/config?config=appInsights')) {
      return next.handle(request);
    }
  
    if (shouldShowLoader) {
      this.loaderService.showLoader();
    }
    return next.handle(request).pipe(
      finalize(() => {
        if (shouldShowLoader) {
          this.loaderService.hideLoader();
        }
      })
    );
  }
}
