import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDocumentationManagementComponent } from './student-documentation-management.component';

describe('StudentDocumentationManagementComponent', () => {
  let component: StudentDocumentationManagementComponent;
  let fixture: ComponentFixture<StudentDocumentationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentDocumentationManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentDocumentationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
