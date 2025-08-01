import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BursarTiersComponent } from './bursar-tiers.component';

describe('BursarTiersComponent', () => {
  let component: BursarTiersComponent;
  let fixture: ComponentFixture<BursarTiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BursarTiersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BursarTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
