import { ChangeDetectorRef, Component, ContentChild, ElementRef, OnInit } from '@angular/core';
import { BursaryService} from '../../../admin/data-access/services/BursaryService';

import { UserStore } from '../../data-access/stores/user.store';
import { Roles } from '../../../authentication/data-access/models/auth.model';
import { AdminLandingReport, FinalSummary } from '../../../admin/data-access/models/admin-landing-report.model';
import { bursaryTypes } from '../../enums/bursaryTypesEnum';
import { barColor } from '../../enums/barColorsEnum';
import { BackgroundImageService } from '../../data-access/services/background-image.service';

@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.scss'],
})
export class AdminLandingComponent implements OnInit {

  @ContentChild('adminContentProjection') adminContent: ElementRef | undefined;
  bursaryFunds!: FinalSummary[];
  fundSpending: { name: string; amount: number; color: string }[] = [];
  universitySpending: { name: string; amount: number; color: string }[] = [];
  hasAdminContent: boolean = false;
  isLoggedIn: boolean = false;
  userRole!: Roles;
  rolesEnum: typeof Roles = Roles;
  fundSpendingTotal: number = 0;
  universitySpendingTotal: number = 0;
  userStoreSub: any;
  backgroundImageUrl: string = '';

  constructor(
    private bursaryService: BursaryService,
    private userStore: UserStore,
    private cdr: ChangeDetectorRef,
    private backgroundImageService: BackgroundImageService
  ) {}

  ngOnInit(): void {
    this.userStoreSub = this.userStore.get()
      .subscribe((user) => {
        this.isLoggedIn = user.isLoggedIn;
        this.userRole = Roles[user.role as keyof typeof Roles];
      });
    this.bursaryService.getBursaries().subscribe((data: AdminLandingReport) => {
      
      if (data) {
        const enrichedBursaries = data.finalSummary.map((bursary: FinalSummary) => ({
          ...bursary,
          logo: this.getImage(bursary.id.toLowerCase())
        }));
        this.bursaryFunds = enrichedBursaries;

        this.fundSpending = data.finalSummary.map((bursary: FinalSummary) => ({
          name: bursary.name,
          amount: bursary.fundSpendingTotal?.total,
          color: bursary.id.toLowerCase() === bursaryTypes.UKUKHULA ?barColor.UKUKHULA: barColor.BBD
        }));
        const fundTotal = data.finalSummary.reduce((sum: number, bursary: FinalSummary) => sum + (bursary.fundSpendingTotal?.total || 0), 0);
        this.fundSpendingTotal = fundTotal;

        const universityMap: { [label: string]: number } = {};
        data.finalSummary.forEach((bursary: FinalSummary) => {
          bursary.fundSpending.forEach((spending) => {
            if (!universityMap[spending.label]) {
              universityMap[spending.label] = 0;
            }
            universityMap[spending.label] += spending.amount;
          });
        });
        this.universitySpending = Object.entries(universityMap).map(([label, amount]) => ({
          name: label,
          amount: amount,
          color: barColor.UNIVERSITY
        })).sort((a, b) => b.amount - a.amount);
        const universityTotal = Object.values(universityMap).reduce((sum, amount) => sum + amount, 0);
        this.universitySpendingTotal = universityTotal;

        this.cdr.detectChanges();
      }
    });
      this.backgroundImageUrl = this.backgroundImageService.getRandomBackgroundImage();
  }

  getImage(bursaryName: string): string {
    switch (bursaryName.toLowerCase()) {
      case bursaryTypes.UKUKHULA:
        return '/assets/nav-bar-logo-white.svg';
      case bursaryTypes.BBDBURSARY:
        return '/assets/bbd-bursary-logo-light.svg';
      default:
        return '';
    }
  }
  ngAfterContentInit(): void {
    this.hasAdminContent = !!this.adminContent;
  }
}
