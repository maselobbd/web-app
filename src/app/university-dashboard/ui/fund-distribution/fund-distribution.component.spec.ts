import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundDistributionComponent } from './fund-distribution.component';

describe('FundDistributionComponent', () => {
  let component: FundDistributionComponent;
  let fixture: ComponentFixture<FundDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundDistributionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
