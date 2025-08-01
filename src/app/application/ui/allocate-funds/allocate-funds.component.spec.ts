import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateFundsComponent } from './allocate-funds.component';

describe('AllocateFundsComponent', () => {
  let component: AllocateFundsComponent;
  let fixture: ComponentFixture<AllocateFundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllocateFundsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllocateFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
