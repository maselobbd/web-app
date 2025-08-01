import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundAllocationFilterComponent } from './fund-allocation-filter.component';

describe('FundAllocationFilterComponent', () => {
  let component: FundAllocationFilterComponent;
  let fixture: ComponentFixture<FundAllocationFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundAllocationFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundAllocationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
