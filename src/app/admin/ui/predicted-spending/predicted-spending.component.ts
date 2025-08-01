import { Component, Input, OnInit } from '@angular/core';
import { PredictedSpending } from '../../data-access/models/applications-report.model';

@Component({
  selector: 'app-predicted-spending',
  templateUrl: './predicted-spending.component.html',
  styleUrl: './predicted-spending.component.scss'
})
export class PredictedSpendingComponent implements OnInit {

  @Input({ required: true })
  predictedSpending!: PredictedSpending;

  ngOnInit(): void {

  }
}
