import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityInformationComponent } from './university-information.component';

describe('UniversityInformationComponent', () => {
  let component: UniversityInformationComponent;
  let fixture: ComponentFixture<UniversityInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniversityInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UniversityInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
