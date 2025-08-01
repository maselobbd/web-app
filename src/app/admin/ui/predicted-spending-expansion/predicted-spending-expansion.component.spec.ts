import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictedSpendingExpansionComponent } from './predicted-spending-expansion.component';

describe('PredictedSpendingExpansionComponent', () => {
  let component: PredictedSpendingExpansionComponent;
  let fixture: ComponentFixture<PredictedSpendingExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PredictedSpendingExpansionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PredictedSpendingExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
