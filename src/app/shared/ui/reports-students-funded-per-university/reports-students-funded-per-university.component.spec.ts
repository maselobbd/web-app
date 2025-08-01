import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsStudentsFundedPerUniversityComponent } from './reports-students-funded-per-university.component';

describe('ReportsStudentsFundedPerUniversityComponent', () => {
  let component: ReportsStudentsFundedPerUniversityComponent;
  let fixture: ComponentFixture<ReportsStudentsFundedPerUniversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsStudentsFundedPerUniversityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsStudentsFundedPerUniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
