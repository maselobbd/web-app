import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';
import { AuthService } from '../../../authentication/data-access/services/auth.service';

@Injectable()
export class AuthenticationHeaderInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  private skipUrlAuthHeader(request: any): boolean {
    // Endpoints that the public are allowed to GET/POST/PUT
    const skipUrlsAllMethods: string[] = [];
    for (const url of skipUrlsAllMethods) {
      if (request.url.includes(url)) {
        return true;
      }
    }
    // Endpoints that the public are ONLY allowed to GET
    const skipUrlsGetMethod: string[] = [];
    for (const url of skipUrlsGetMethod) {
      if (request.url.includes(url)) {
        if (request.method === 'GET') {
          return true;
        }
      }
    }

    return false;
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (this.skipUrlAuthHeader(request)) {
      return next.handle(request).pipe(
        catchError((error) => {
          throw this.checkError(error);
        }),
      );
    }
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getAccessToken()}`,
      },
    });

    return next.handle(request).pipe(
      catchError((error) => {
        throw this.checkError(error);
      }),
    );
  }

  checkError(error: any) {
    if (error.status === 401) {
      this.router.navigate(['/unauthorised']);
    }
    if (error.status === 403) {
      this.router.navigate(['/forbidden']);
    }
    return error;
  }
}
