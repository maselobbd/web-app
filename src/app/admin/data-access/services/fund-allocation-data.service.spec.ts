import { TestBed } from '@angular/core/testing';

import { FundAllocationDataService } from './fund-allocation-data.service';

describe('FundAllocationDataService', () => {
  let service: FundAllocationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundAllocationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
