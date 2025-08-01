import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewApplicationDialogComponent } from './renew-application-dialog.component';

describe('RenewApplicationDialogComponent', () => {
  let component: RenewApplicationDialogComponent;
  let fixture: ComponentFixture<RenewApplicationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenewApplicationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RenewApplicationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
