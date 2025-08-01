import { TestBed } from '@angular/core/testing';

import { StepperDataService } from './stepper-data.service';

describe('StepperDataService', () => {
  let service: StepperDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepperDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
