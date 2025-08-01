import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedUniversityBursaryDetailsComponent } from './consolidated-university-bursary-details.component';

describe('ConsolidatedUniversityBursaryDetailsComponent', () => {
  let component: ConsolidatedUniversityBursaryDetailsComponent;
  let fixture: ComponentFixture<ConsolidatedUniversityBursaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsolidatedUniversityBursaryDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsolidatedUniversityBursaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
