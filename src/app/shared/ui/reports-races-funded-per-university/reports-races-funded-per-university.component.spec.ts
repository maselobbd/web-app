import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsRacesFundedPerUniversityComponent } from './reports-races-funded-per-university.component';

describe('ReportsRacesFundedPerUniversityComponent', () => {
  let component: ReportsRacesFundedPerUniversityComponent;
  let fixture: ComponentFixture<ReportsRacesFundedPerUniversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsRacesFundedPerUniversityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsRacesFundedPerUniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
