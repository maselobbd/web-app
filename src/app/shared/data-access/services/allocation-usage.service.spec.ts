import { TestBed } from '@angular/core/testing';

import { AllocationUsageService } from './allocation-usage.service';

describe('AllocationUsageService', () => {
  let service: AllocationUsageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllocationUsageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
