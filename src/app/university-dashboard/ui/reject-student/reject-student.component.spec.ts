import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectStudentComponent } from './reject-student.component';

describe('RejectStudentComponent', () => {
  let component: RejectStudentComponent;
  let fixture: ComponentFixture<RejectStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectStudentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RejectStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
