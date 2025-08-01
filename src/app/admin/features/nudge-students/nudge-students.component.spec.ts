import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NudgeStudentsComponent } from './nudge-students.component';

describe('NudgeStudentsComponent', () => {
  let component: NudgeStudentsComponent;
  let fixture: ComponentFixture<NudgeStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NudgeStudentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NudgeStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
