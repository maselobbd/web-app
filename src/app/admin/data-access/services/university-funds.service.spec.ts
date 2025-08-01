import { TestBed } from '@angular/core/testing';

import { UniversityFundsService } from './university-funds.service';

describe('UniversityFundsService', () => {
  let service: UniversityFundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniversityFundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
