import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationUsageComponent } from './allocation-usage.component';

describe('AllocationUsageComponent', () => {
  let component: AllocationUsageComponent;
  let fixture: ComponentFixture<AllocationUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllocationUsageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllocationUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
