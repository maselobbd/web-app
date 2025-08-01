import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFormBursaryYearComponent } from './application-form-bursary-year.component';

describe('ApplicationFormBursaryYearComponent', () => {
  let component: ApplicationFormBursaryYearComponent;
  let fixture: ComponentFixture<ApplicationFormBursaryYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationFormBursaryYearComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationFormBursaryYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
