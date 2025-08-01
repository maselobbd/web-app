import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityAdminProfilesComponent } from './university-admin-profiles.component';

describe('UniversityAdminProfilesComponent', () => {
  let component: UniversityAdminProfilesComponent;
  let fixture: ComponentFixture<UniversityAdminProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniversityAdminProfilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UniversityAdminProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
