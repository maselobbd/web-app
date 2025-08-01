import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteesComponent } from './invitees.component';

describe('InviteesComponent', () => {
  let component: InviteesComponent;
  let fixture: ComponentFixture<InviteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InviteesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InviteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
