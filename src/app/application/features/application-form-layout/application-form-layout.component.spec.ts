import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFormLayoutComponent } from './application-form-layout.component';

describe('ApplicationFormLayoutComponent', () => {
  let component: ApplicationFormLayoutComponent;
  let fixture: ComponentFixture<ApplicationFormLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationFormLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationFormLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
