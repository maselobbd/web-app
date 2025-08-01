import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardStudentComponent } from './onboard-student.component';

describe('OnboardStudentComponent', () => {
  let component: OnboardStudentComponent;
  let fixture: ComponentFixture<OnboardStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnboardStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnboardStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
