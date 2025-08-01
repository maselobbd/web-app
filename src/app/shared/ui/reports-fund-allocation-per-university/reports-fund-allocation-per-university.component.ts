import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BarElement, Chart, ChartConfiguration } from 'chart.js/auto';
import { updateChart } from '../../utils/functions/reports.function';
import { AllAllocationAndSpending, ItemsData, BAR_OPTIONS } from '../../../admin/data-access/models/applications-report.model';
import { CategoryBreakdownTitles, Colours } from '../../enums/categories';
import ChartDataLabels  from 'chartjs-plugin-datalabels';
import { CustomCurrencyPipe } from '../../utils/pipes/custom-currency-pipe.pipe';

@Component({
  selector: 'app-reports-fund-allocation-per-university',
  templateUrl: './reports-fund-allocation-per-university.component.html',
  styleUrls: [
    './reports-fund-allocation-per-university.component.scss', 
    '../category-breakdown/category-breakdown.component.scss',
    '../category-breakdown-university/category-breakdown-university.component.scss'
  ]
})
export class ReportsFundAllocationPerUniversityComponent implements OnChanges, AfterViewInit {
  @Input()
  reportsCategoryBreakdownUniversity!: AllAllocationAndSpending;
  universityCategoryChart!: Chart;
  config!: ChartConfiguration;
  customCurrencyPipe: CustomCurrencyPipe;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() {
    this.customCurrencyPipe = new CustomCurrencyPipe();
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const canvasRenderingContext: CanvasRenderingContext2D | null = canvas.getContext('2d');
    this.getChart(this.reportsCategoryBreakdownUniversity, canvasRenderingContext);
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.hasOwnProperty("reportsCategoryBreakdownUniversity")) {
      if (!changes["reportsCategoryBreakdownUniversity"].firstChange) {
        this.reportsCategoryBreakdownUniversity = changes["reportsCategoryBreakdownUniversity"].currentValue;
        updateChart(this.universityCategoryChart, this.reportsCategoryBreakdownUniversity);
      };
    }  
  }

  getChart(data: any, canvasRenderingContext: CanvasRenderingContext2D | null): void {
    this.config = {
    type: CategoryBreakdownTitles.CHART_TYPE,
    data: {
      labels: data.totalAllocationByUniversity.map((allocationData: ItemsData) => allocationData.label),
      datasets: [
        {
          label: CategoryBreakdownTitles.USED,
          data: data.totalAmountUsedByUniversity.map(((usedAmountData: ItemsData) => ({ amount: usedAmountData.amount, label: usedAmountData.label }))),
          borderWidth: 1,
          backgroundColor: Colours.SHADE_2,
          datalabels: {
            display: (context) => {
              const { chart, datasetIndex, dataIndex } = context;
              let barElement: BarElement = chart.getDatasetMeta(datasetIndex).data[dataIndex] as BarElement;
              const value: any = context.dataset.data[context.dataIndex];
              const label: string = this.customCurrencyPipe.transform(value.amount.toString());
              const { width } = barElement.getProps(['width'], true);
              const labelWidth = label && canvasRenderingContext ? canvasRenderingContext.measureText(label).width : 0;
              return labelWidth <= width;
            },
            formatter: (value: ItemsData) => this.customCurrencyPipe.transform(value.amount)
          },
          barThickness: 15,
        },
        {
          label: CategoryBreakdownTitles.FUND_ALLOCATION,
          data: data.totalAllocationByUniversity.map(((allocationData: ItemsData) => ({ amount: allocationData.amount, label: allocationData.label }))),
          borderWidth: 1,
          datalabels: {
            display: (context) => {
              const { chart, datasetIndex, dataIndex } = context;
              const barElement: BarElement = chart.getDatasetMeta(datasetIndex).data[dataIndex] as BarElement;
              const value: any = context.dataset.data[context.dataIndex];
              const label: string = this.customCurrencyPipe.transform(value.amount.toString());
              const { width } = barElement.getProps(['width'], true);
              const labelWidth = label && canvasRenderingContext ? canvasRenderingContext.measureText(label).width : 0;
              return labelWidth <= width;
            },
            formatter: (value: ItemsData) => this.customCurrencyPipe.transform(value.amount)
          },
          backgroundColor: Colours.SHADE_1,
          barThickness: 15,
        },
      ]
    },
    plugins: [ChartDataLabels],
    options: {
      parsing: {
        xAxisKey: 'amount',
        yAxisKey: 'label',
      },
      aspectRatio: 1,
      ...BAR_OPTIONS
    }
  }
  this.universityCategoryChart = new Chart('universityCategoryChartId', this.config);
  }
}
