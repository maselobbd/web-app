import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailsHeaderComponent } from './student-details-header.component';

describe('StudentDetailsHeaderComponent', () => {
  let component: StudentDetailsHeaderComponent;
  let fixture: ComponentFixture<StudentDetailsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentDetailsHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentDetailsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
