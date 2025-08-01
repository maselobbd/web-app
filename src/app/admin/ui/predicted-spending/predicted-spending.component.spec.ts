import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictedSpendingComponent } from './predicted-spending.component';

describe('PredictedSpendingComponent', () => {
  let component: PredictedSpendingComponent;
  let fixture: ComponentFixture<PredictedSpendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PredictedSpendingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PredictedSpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
