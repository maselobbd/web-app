import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToTotalFundAllocationComponent } from './add-to-total-fund-allocation.component';

describe('AddToTotalFundAllocationComponent', () => {
  let component: AddToTotalFundAllocationComponent;
  let fixture: ComponentFixture<AddToTotalFundAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddToTotalFundAllocationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddToTotalFundAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
