import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundAllocationIndividualUniversityComponent } from './fund-allocation-individual-university.component';

describe('FundAllocationIndividualUniversityComponent', () => {
  let component: FundAllocationIndividualUniversityComponent;
  let fixture: ComponentFixture<FundAllocationIndividualUniversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundAllocationIndividualUniversityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundAllocationIndividualUniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
