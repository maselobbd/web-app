import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundSpreadDetailsComponent } from './fund-spread-details.component';

describe('FundSpreadDetailsComponent', () => {
  let component: FundSpreadDetailsComponent;
  let fixture: ComponentFixture<FundSpreadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundSpreadDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundSpreadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
