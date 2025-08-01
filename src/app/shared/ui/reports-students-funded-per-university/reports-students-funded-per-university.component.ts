import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { BarElement, Chart, ChartConfiguration } from 'chart.js/auto';
import { SimpleChanges } from '@angular/core';
import { updateChart } from '../../utils/functions/reports.function';
import { AmountData, BAR_OPTIONS } from '../../../admin/data-access/models/applications-report.model';
import { CategoryBreakdownTitles, Colours } from '../../enums/categories';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-reports-students-funded-per-university',
  templateUrl: './reports-students-funded-per-university.component.html',
  styleUrls: [
    './reports-students-funded-per-university.component.scss', 
    '../category-breakdown/category-breakdown.component.scss',
    '../category-breakdown-university/category-breakdown-university.component.scss'
  ]
})
export class ReportsStudentsFundedPerUniversityComponent implements AfterViewInit, OnChanges {

  @Input()
  reportsStudentsFundedPerUniversity!: { activeStudents: AmountData[] };
  fundedStudentsChart!: Chart;
  config!: ChartConfiguration
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const canvasRenderingContext: CanvasRenderingContext2D | null = canvas.getContext('2d');
    this.getChart(this.reportsStudentsFundedPerUniversity.activeStudents, canvasRenderingContext);
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes.hasOwnProperty("reportsStudentsFundedPerUniversity")) {
        if (!changes["reportsStudentsFundedPerUniversity"].firstChange) {
          this.reportsStudentsFundedPerUniversity = changes["reportsStudentsFundedPerUniversity"].currentValue;
          updateChart(this.fundedStudentsChart, this.reportsStudentsFundedPerUniversity);
        };
      }  
    }

  getChart(data: AmountData[], canvasRenderingContext: CanvasRenderingContext2D | null): void {;
       this.config = {
        type: CategoryBreakdownTitles.CHART_TYPE,
        data: {
          labels: data.flatMap((studentsData: AmountData) => Object.keys(studentsData)),
          datasets: [
            {
              label: CategoryBreakdownTitles.STUDENTS_LABEL,
              data: data.flatMap((studentsData: AmountData) => Object.values(studentsData)),
              backgroundColor: Colours.SHADE_3,
              barThickness: 20,
              datalabels: {
                anchor: 'end',
                align: 'start',
                color: 'white',
                offset: 4,
                font: {
                  weight: 'bold' 
                },
                display: (context) => {
                  const { chart, datasetIndex, dataIndex } = context;
                  let barElement: BarElement = chart.getDatasetMeta(datasetIndex).data[dataIndex] as BarElement;
                  const value: any = context.dataset.data[context.dataIndex];
                  const label: string = value.toString();
                  const { width } = barElement.getProps(['width'], true);
                  const labelWidth = label && canvasRenderingContext ? canvasRenderingContext.measureText(label).width : 0;
                  return labelWidth <= width;
                },
              formatter: (value: any) => value
            },
            }
          ]
        },
        plugins: [ChartDataLabels],
        options: {
          ...BAR_OPTIONS,
          plugins: {
            legend: {
              display: false,
            }
          }
        }
      }
      this.fundedStudentsChart= new Chart("fundedStudentsChartId", this.config);
  }
}
