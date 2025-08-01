import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { functionsGuard } from './success.guard';

describe('functionsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => functionsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
