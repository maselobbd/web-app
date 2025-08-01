import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveFundsComponent } from './move-funds.component';

describe('MoveFundsComponent', () => {
  let component: MoveFundsComponent;
  let fixture: ComponentFixture<MoveFundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveFundsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoveFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
