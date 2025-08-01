import { TestBed } from '@angular/core/testing';

import { AllocateFundsService } from './allocate-funds.service';

describe('AllocateFundsService', () => {
  let service: AllocateFundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllocateFundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
