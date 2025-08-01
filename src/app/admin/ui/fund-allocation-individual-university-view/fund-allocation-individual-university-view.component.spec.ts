import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundAllocationIndividualUniversityViewComponent } from './fund-allocation-individual-university-view.component';

describe('FundAllocationIndividualUniversityViewComponent', () => {
  let component: FundAllocationIndividualUniversityViewComponent;
  let fixture: ComponentFixture<FundAllocationIndividualUniversityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundAllocationIndividualUniversityViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundAllocationIndividualUniversityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
