import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityBursaryDetailsComponent } from './university-bursary-details.component';

describe('UniversityBursaryDetailsComponent', () => {
  let component: UniversityBursaryDetailsComponent;
  let fixture: ComponentFixture<UniversityBursaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniversityBursaryDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityBursaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
