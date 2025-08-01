import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BursaryInformationComponent } from './bursary-information.component';

describe('BursaryInformationComponent', () => {
  let component: BursaryInformationComponent;
  let fixture: ComponentFixture<BursaryInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BursaryInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BursaryInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
