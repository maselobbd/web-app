import { Component, SimpleChanges, Input, OnChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {  BarElement } from 'chart.js/auto';
import { ChartConfiguration, Chart } from 'chart.js/auto';
import { RatioPerRace, BAR_OPTIONS } from '../../../admin/data-access/models/applications-report.model';
import { Races, Colours, CategoryBreakdownTitles } from '../../enums/categories';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-reports-races-funded-per-university',
  templateUrl: './reports-races-funded-per-university.component.html',
  styleUrls: [
    './reports-races-funded-per-university.component.scss', 
    '../category-breakdown/category-breakdown.component.scss',
    '../category-breakdown-university/category-breakdown-university.component.scss'
  ]
})
export class ReportsRacesFundedPerUniversityComponent implements AfterViewInit, OnChanges {

  @Input()
  reportsRacesFundedPerUniversity!: { activeRaces: RatioPerRace[] };
  @Input()
  distinctRaces!: string[];
  fundedRacesChart!: Chart;
  config!: ChartConfiguration;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const canvasRenderingContext: CanvasRenderingContext2D | null = canvas.getContext('2d');
    this.getChart(this.reportsRacesFundedPerUniversity.activeRaces, canvasRenderingContext);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.hasOwnProperty("reportsRacesFundedPerUniversity")) {
      if (!changes["reportsRacesFundedPerUniversity"].firstChange) {
        this.reportsRacesFundedPerUniversity = changes["reportsRacesFundedPerUniversity"].currentValue;
        this.fundedRacesChart.destroy();
        const canvas = this.canvasRef.nativeElement;
        const canvasRenderingContext: CanvasRenderingContext2D | null = canvas.getContext('2d');
        this.getChart(this.reportsRacesFundedPerUniversity.activeRaces, canvasRenderingContext);
        
      };
    } 
  }

  getBackgroundColour(race: string): string {
    switch(race) {
      case Races.BLACK:
        return Colours.SHADE_1
      case Races.COLOURED:
        return Colours.SHADE_2
      case Races.INDIAN:
        return Colours.SHADE_3
      case Races.WHITE:
        return Colours.SHADE_4
    }
    return Colours.DEFAULT
  }

  getChart(data: RatioPerRace[], canvasRenderingContext: CanvasRenderingContext2D | null): void {
    const races: string[] = this.getDistinctRaces(data);
    const datasets: any = {
      labels: this.getDistinctUniversities(data),
      datasets: races.map(race => ({
            label: race,
            data: data.filter((dataDetail: RatioPerRace) => dataDetail.race === race).map((dataDetail: RatioPerRace) => ({ amount: dataDetail.count, label: dataDetail.universityName })),
            parsing: {
              xAxisKey: 'amount',
              yAxisKey: 'label',
            },
            datalabels: {
              display: (context: Context) => {
                const { chart, datasetIndex, dataIndex } = context;
                let barElement: BarElement = chart.getDatasetMeta(datasetIndex).data[dataIndex] as BarElement;
                const value: any = context.dataset.data[context.dataIndex];
                const label: string = value.amount.toString();
                const { width } = barElement.getProps(['width'], true);
                const labelWidth = label && canvasRenderingContext ? canvasRenderingContext.measureText(label).width : 0;
                return labelWidth <= width;
              },
              formatter: (value: any) => value.amount
            },
            borderWidth: 1,
            backgroundColor: this.getBackgroundColour(race.toLowerCase()),
            barThickness: 20,
            stack: "Funded races"
          }))
        }
    this.config = {
      type: CategoryBreakdownTitles.CHART_TYPE,
      data: datasets,
    plugins: [ChartDataLabels],
    options: {
      ...BAR_OPTIONS
    },
  }
  this.fundedRacesChart = new Chart("fundedRacesChartId", this.config);
  }

  getDistinctRaces(data: RatioPerRace[]): string[] {
    return data ? Array.from(new Set(data.map((activeRaceData: RatioPerRace) => activeRaceData.race))): [];
  }

  getDistinctUniversities(data: RatioPerRace[]) : string[] {
    return data ? Array.from(new Set(data.map((activeRaceData: RatioPerRace) => activeRaceData.universityName))): [];
  }
}
