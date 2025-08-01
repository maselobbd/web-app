import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryBreakdownUniversityComponent } from './category-breakdown-university.component';

describe('CategoryBreakdownUniversityComponent', () => {
  let component: CategoryBreakdownUniversityComponent;
  let fixture: ComponentFixture<CategoryBreakdownUniversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryBreakdownUniversityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryBreakdownUniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
