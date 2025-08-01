import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReallocateFundsComponent } from './reallocate-funds.component';

describe('ReallocateFundsComponent', () => {
  let component: ReallocateFundsComponent;
  let fixture: ComponentFixture<ReallocateFundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReallocateFundsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReallocateFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
