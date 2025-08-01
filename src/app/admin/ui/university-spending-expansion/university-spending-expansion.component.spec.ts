import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversitySpendingExpansionComponent } from './university-spending-expansion.component';

describe('UniversitySpendingExpansionComponent', () => {
  let component: UniversitySpendingExpansionComponent;
  let fixture: ComponentFixture<UniversitySpendingExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniversitySpendingExpansionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UniversitySpendingExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
