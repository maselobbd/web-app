import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInformationFormComponent } from './event-information-form.component';

describe('EventInformationFormComponent', () => {
  let component: EventInformationFormComponent;
  let fixture: ComponentFixture<EventInformationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventInformationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
