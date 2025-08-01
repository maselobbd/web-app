import { TestBed } from '@angular/core/testing';

import { HodAccountsService } from './hod-accounts.service';

describe('HodAccountsService', () => {
  let service: HodAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HodAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
