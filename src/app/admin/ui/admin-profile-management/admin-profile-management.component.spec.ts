import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfileManagementComponent } from './admin-profile-management.component';

describe('AdminProfileManagementComponent', () => {
  let component: AdminProfileManagementComponent;
  let fixture: ComponentFixture<AdminProfileManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminProfileManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminProfileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
