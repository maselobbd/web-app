import { TestBed } from '@angular/core/testing';

import { TotalAllocatedService } from './total-allocated.service';

describe('TotalAllocatedService', () => {
  let service: TotalAllocatedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TotalAllocatedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
