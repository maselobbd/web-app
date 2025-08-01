import { Component, Input, OnDestroy } from '@angular/core';
import { BursaryFund } from '../../../admin/data-access/services/BursaryService';
import { Store } from '@ngrx/store';
import { AppState } from '../../../states/app.state';
import {setViewType } from '../../../states/dashboard/dashboard.action';
import { Router } from '@angular/router';
import { currentFiscalYear } from '../../utils/functions/dateUtils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bursary-fund-card',
  templateUrl: './bursary-fund-card.component.html',
  styleUrls: ['./bursary-fund-card.component.scss'],
})
export class BursaryFundCardComponent implements OnDestroy {
  private subscription = new Subscription();
  currentYear = currentFiscalYear();

  constructor(
    private store: Store<AppState>, 
    private router: Router
  ) {}

  @Input() fund!: BursaryFund;

  onCardClick(bursary: string): void {
     this.store.dispatch(setViewType({ viewType: bursary }));
    this.router.navigate(['/admin/dashboard'], { 
      queryParams: { viewType: bursary + " Bursary Fund" }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}