import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsConditionsPrivacyPolicyViewComponent } from './terms-conditions-privacy-policy-view.component';

describe('TermsConditionsPrivacyPolicyViewComponent', () => {
  let component: TermsConditionsPrivacyPolicyViewComponent;
  let fixture: ComponentFixture<TermsConditionsPrivacyPolicyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermsConditionsPrivacyPolicyViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      TermsConditionsPrivacyPolicyViewComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
