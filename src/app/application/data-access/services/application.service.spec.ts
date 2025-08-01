import { TestBed } from '@angular/core/testing';

import { applicationService } from './application.service';

describe('ApplicationserviceService', () => {
  let service: applicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(applicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
