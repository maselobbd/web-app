import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinedApplicationsComponent } from './declined-applications.component';

describe('DeclinedApplicationsComponent', () => {
  let component: DeclinedApplicationsComponent;
  let fixture: ComponentFixture<DeclinedApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeclinedApplicationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeclinedApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
