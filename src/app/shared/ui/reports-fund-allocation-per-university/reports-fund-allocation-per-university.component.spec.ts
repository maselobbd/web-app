import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsFundAllocationPerUniversityComponent } from './reports-fund-allocation-per-university.component';

describe('ReportsFundAllocationPerUniversityComponent', () => {
  let component: ReportsFundAllocationPerUniversityComponent;
  let fixture: ComponentFixture<ReportsFundAllocationPerUniversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsFundAllocationPerUniversityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsFundAllocationPerUniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
