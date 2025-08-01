import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundAllocationComponent } from './fund-allocation.component';

describe('FundAllocationComponent', () => {
  let component: FundAllocationComponent;
  let fixture: ComponentFixture<FundAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundAllocationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FundAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
