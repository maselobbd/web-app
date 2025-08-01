import { ChangeDetectionStrategy, signal, Component, Input } from '@angular/core';
import { PredictedSpending } from '../../data-access/models/applications-report.model';

@Component({
  selector: 'app-predicted-spending-expansion',
  templateUrl: './predicted-spending-expansion.component.html',
  styleUrls: [
    './predicted-spending-expansion.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PredictedSpendingExpansionComponent {

  @Input({ required: true })
  predictedSpending!: PredictedSpending;
  predictedSpendingHeading: string = "Predicted spending:";

  readonly panelOpenState = signal(false);

  constructor() { }
}
