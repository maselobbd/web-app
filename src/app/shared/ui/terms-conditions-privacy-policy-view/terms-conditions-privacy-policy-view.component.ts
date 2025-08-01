import { Component, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-terms-conditions-privacy-policy-view',
  templateUrl: './terms-conditions-privacy-policy-view.component.html',
  styleUrl: './terms-conditions-privacy-policy-view.component.scss',
})
export class TermsConditionsPrivacyPolicyViewComponent {
  pdfSource: string;
  previousUrl!: string;
  navigationEvents: any;

  constructor(private route: ActivatedRoute) {
    this.pdfSource = '';
  }

  ngOnInit(): void {
    switch (this.route.snapshot.paramMap.get('agreementType')) {
      case 'terms-conditions':
        this.pdfSource = '../../../assets/documents/Disclaimer.pdf';
        return;
      case 'privacy-policy':
        this.pdfSource = '../../../assets/documents/Privacy policy.pdf';
        return;
    }
  }
}
