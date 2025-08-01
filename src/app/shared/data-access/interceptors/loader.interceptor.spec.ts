import { TestBed } from '@angular/core/testing';
import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

describe('loaderInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => loaderInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
function loaderInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): any {
  throw new Error('Function not implemented.');
}
