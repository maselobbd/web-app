import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterDetailsDialogComponent } from './alter-details-dialog.component';

describe('AlterDetailsDialogComponent', () => {
  let component: AlterDetailsDialogComponent;
  let fixture: ComponentFixture<AlterDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlterDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlterDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
