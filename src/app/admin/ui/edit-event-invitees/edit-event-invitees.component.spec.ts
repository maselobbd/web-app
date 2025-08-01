import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventInviteesComponent } from './edit-event-invitees.component';

describe('EditEventInviteesComponent', () => {
  let component: EditEventInviteesComponent;
  let fixture: ComponentFixture<EditEventInviteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEventInviteesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditEventInviteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
