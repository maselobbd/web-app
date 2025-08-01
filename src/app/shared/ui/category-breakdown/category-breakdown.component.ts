import { Component, Input, OnInit } from '@angular/core';
import { RatioPerRace, ReportsCategoryBreakDown } from '../../../admin/data-access/models/applications-report.model';
import { Races, CategoryBreakdownTitles } from '../../enums/categories';

@Component({
  selector: 'app-category-breakdown',
  templateUrl: './category-breakdown.component.html',
  styleUrls: ['./category-breakdown.component.scss']
})
export class CategoryBreakdownComponent implements OnInit {

  @Input()
  reportsCategoryBreakDown!: ReportsCategoryBreakDown;
  races = Races;
  categoryBreakdownTitles = CategoryBreakdownTitles;
  showCategoryBreakdown: boolean = false;

  ngOnInit(): void {
    if (this.reportsCategoryBreakDown.totalPerRace) { 
      this.showCategoryBreakdown = this.reportsCategoryBreakDown.totalPerRace.length > 0 
    };
  }
  
  ngOnChanges(): void {
    if (this.reportsCategoryBreakDown.totalPerRace) { 
      this.showCategoryBreakdown = this.reportsCategoryBreakDown.totalPerRace.length > 0 
    };
  }

  getDividerWidth(race: string, raceDetail: RatioPerRace): string {
    if(this.reportsCategoryBreakDown.totalPerRace)  {
        switch (race.toLowerCase()) {
        case Races.BLACK:
          return `${raceDetail.ratio <= 100 ? raceDetail.ratio : 100}%`
        case Races.COLOURED:
          return `${this.getTotalRatio(this.reportsCategoryBreakDown.totalPerRace, [Races.BLACK], raceDetail)}%`
        case Races.INDIAN:
          return `${this.getTotalRatio(this.reportsCategoryBreakDown.totalPerRace, [Races.BLACK, Races.COLOURED], raceDetail)}%`
        case Races.WHITE:
          return `${this.getTotalRatio(this.reportsCategoryBreakDown.totalPerRace, [Races.BLACK, Races.COLOURED, Races.INDIAN], raceDetail)}%`
      }
    }
    return "0%"
  }

  getDividerIndexAndTop(index: number): { index: number; top?: string } {
    switch (index) {
      case 0:
        return {
          index: 4
        }
      case 1:
        return {
          index: 3,
          top: "-1.45rem"
        }
      case 2:
        return {
          index: 2,
          top: "-2.9rem",
        }
        case 3:
          return {
            index: 1,
            top: "-4.328rem",
          }
    }
    return {
      index: 0,
      top: "0"
    };
  }

  getTotalRatio(data: RatioPerRace[], races: string[], raceDetail: RatioPerRace): number {
    const totalRatio: number = data.filter((raceDetail: RatioPerRace) => races.includes(raceDetail.race.toLowerCase())).map(raceDetail => raceDetail.ratio).reduce((total, ratio) => total + ratio, 0) + raceDetail.ratio
    return totalRatio <= 100 ? totalRatio : 100;
  }
}