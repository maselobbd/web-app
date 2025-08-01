import { Component, Input } from '@angular/core';
import { FundSpending, UniversitySpending } from '../../../admin/data-access/services/BursaryService';

@Component({
  selector: 'app-bursary-reporting',
  templateUrl: './bursary-reporting.component.html',
  styleUrls: ['./bursary-reporting.component.scss'],
})
export class BursaryReportingComponent {
  @Input() fundSpending: FundSpending[] = [];
  @Input() universitySpending: UniversitySpending[] = [];
  @Input() fundSpendingTotal: number = 0;
  @Input() universitySpendingTotal: number = 0;

  getFundSpendingBarWidth(amount: number): string {
    if (!this.fundSpending.length) return '0%';
    const max = Math.max(...this.fundSpending.map(f => f.amount));
    if (max === 0) return '0%';
    return ((amount / max) * 100).toFixed(2) + '%';
  }

  getUniversitySpendingBarWidth(amount: number): string {
    if (!this.universitySpending.length) return '0%';
    const max = Math.max(...this.universitySpending.map(u => u.amount));
    if (max === 0) return '0%';
    return ((amount / max) * 100).toFixed(2) + '%';
  }
} 