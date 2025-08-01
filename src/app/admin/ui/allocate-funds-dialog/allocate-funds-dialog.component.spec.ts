import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateFundsDialogComponent } from './allocate-funds-dialog.component';

describe('AllocateFundsDialogComponent', () => {
  let component: AllocateFundsDialogComponent;
  let fixture: ComponentFixture<AllocateFundsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllocateFundsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllocateFundsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
