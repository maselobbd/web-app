import { ChangeDetectionStrategy, Component, Input, Predicate } from '@angular/core';
import { ApplicationData, PredictedSpending } from '../../data-access/models/applications-report.model';

@Component({
  selector: 'app-university-spending-expansion',
  templateUrl: './university-spending-expansion.component.html',
  styleUrls: [
    './university-spending-expansion.component.scss',
    '../predicted-spending-expansion/predicted-spending-expansion.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversitySpendingExpansionComponent {

  @Input({required: true})
  predictedSpending!: PredictedSpending;
  universities: string[] = [];

  constructor() {
    
   }

  getDistinctUniversities(applicationsData: ApplicationData[]): string[] {
    return [ ...new Set(applicationsData.map(applicationData => applicationData.universityName)) ];
  }

  applicationsDataByYear(year: number, applicationsData: ApplicationData[]): ApplicationData[] {
    return applicationsData.filter(applicationData => applicationData.year === year);
  }

  applicationsDataByUniversity(universityName: string, applicationsData: ApplicationData[]): ApplicationData[] {
    return applicationsData.filter(applicationData => applicationData.universityName === universityName);
  }

  getTotalPredictionForYear(applicationsData: ApplicationData[], year: number): number {
    return applicationsData.map(applicationData => applicationData.predictedValues[`${year}`] ? applicationData.predictedValues[`${year}`] : 0).reduce((accumulator, amount) => accumulator + amount, 0);
  }

  getYearOfStudy(applicationData: ApplicationData): string {
    let yearOfStudy = '';
    switch(applicationData.yearOfStudy.trim()) {
      case '1':
        yearOfStudy = '1st Year';
        break;
      case '2':
        yearOfStudy = '2nd Year';
        break;
      case '3':
        yearOfStudy = '3rd Year';
        break;
      case '4':
        yearOfStudy = '4th Year';
        break; 
    }
    return yearOfStudy
  }
}
