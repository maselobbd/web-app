import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailTableComponent } from './users-detail-table.component';

describe('UsersDetailTableComponent', () => {
  let component: UsersDetailTableComponent;
  let fixture: ComponentFixture<UsersDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersDetailTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
