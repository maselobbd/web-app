import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAllocationDialogComponent } from './add-allocation-dialog.component';

describe('AddAllocationDialogComponent', () => {
  let component: AddAllocationDialogComponent;
  let fixture: ComponentFixture<AddAllocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAllocationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAllocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
