import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityDepartmentFundingComponent } from './university-department-funding.component';

describe('UniversityDepartmentFundingComponent', () => {
  let component: UniversityDepartmentFundingComponent;
  let fixture: ComponentFixture<UniversityDepartmentFundingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniversityDepartmentFundingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UniversityDepartmentFundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
