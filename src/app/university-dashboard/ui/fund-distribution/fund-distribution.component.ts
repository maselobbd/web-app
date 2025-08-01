import { Component, Input, OnInit } from '@angular/core';
import { UniversityStudentDetails } from '../../data-access/models/student-details-model';

@Component({
  selector: 'app-fund-distribution',
  templateUrl: './fund-distribution.component.html',
  styleUrls: ['./fund-distribution.component.scss',]
})
export class FundDistributionComponent implements OnInit {
  @Input() student!: UniversityStudentDetails;

  constructor() { }

  ngOnInit(): void {}
}