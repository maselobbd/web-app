import { BarElement, Chart, ChartDataset, ChartOptions } from "chart.js/auto";

export interface ApplicationsReport {
  'First Name': string;
  Surname: string;
  Title: string;
  Email: string;
  'ID Number': string;
  Race: string;
  Gender: string;
  'ID Url': string;
  'Contact Number': string;
  'Street Address': string;
  Suburb: string;
  City: string;
  'Postal Code': string;
  Amount: number;
  'Average Grade': number;
  Degree: string;
  'Year of Funding': number;
  'Application Motivation': null | string;
  'Date of Application': Date;
  University: string;
  Faculty: string;
  Department: string;
  'Year of Study': number | null;
  'Academic Transcript Url': string;
'Matric Certificate Url': string;
  'Financial Statement Url': string;
  Citizenship: string;
  'Agreed to Terms and Conditions': string;
  'Read Privacy Policy': boolean | null;
  Status: string;
  'BBD Description': string;
  'University Description': string;
  'Status Date': Date;
  Reason: string | null;
  'Declined Reason Motivation': string | null;
}

export interface ReportsData {
  allocationStudentRace: AllocationStudentRaceReportsDataItems;
  universitiesAllocationSpentData: UniversitiesAllocationSpentData;
  universitiesActiveStudents: UniversitiesActiveStudents;
  universitiesActiveRaces: UniversitiesActiveRaces;
  distinctYears: number[];
  distinctRaces: string[];
  predictedSpending: PredictedSpending;
}

export interface AllocationStudentRaceReportsDataItems {
  allAllocationStudentAndRace: AllAllocationStudentRaceData;
  byYearAllocationStudentRace: ByYearAllocationStudentRaceData;
}

export interface AllAllocationStudentRaceData {
  totalAllocations: number;
  totalNumberOfActiveStudents: number;
  totalPerRace: RatioPerRace[];
}

export interface ByYearAllocationStudentRaceData {
  allocationByYear: AmountData[];
  studentsByYear: AmountData[];
  raceByYear: RaceDataObject
}

export interface RaceDataObject {
  [key: string]: RatioPerRace[];
}

interface ItemsDataObject {
  [key: string]: ItemsData[];
}

export interface AmountDataObject {
  [key: string]: AmountData[];
}

export interface UniversitiesAllocationSpentData {
  allAllocationAndSpending: AllAllocationAndSpending;
  byYearAllocationAndSpending: ByYearAllocationAndSpending;
}

export interface AllAllocationAndSpending {
  totalAllocationByUniversity: ItemsData[];
  totalAmountUsedByUniversity: ItemsData[];
  activeStudents?: AmountData[];
}

export interface ByYearAllocationAndSpending {
  allocationByYear: ItemsDataObject;
  usedByYear: ItemsDataObject;
}

export interface UniversitiesActiveStudents {
  allActiveStudents: AllActiveStudents;
  byYearAcitveStudents: ByYearActiveStudents;
}

export interface AllActiveStudents {
  totalActiveStudents: AmountData[];
}

export interface ByYearActiveStudents {
  totalActiveStudentsByYear: AmountDataObject[];
}

export interface UniversitiesActiveRaces {
  allUniversitiesActiveRaces: TotalActiveRaces;
  byYearUniversitiesActiveRaces: ByYearUniversitiesActiveRaces 
}

export interface TotalActiveRaces {
  totalActiveRaces: RatioPerRace[];
}

export interface ByYearUniversitiesActiveRaces {
  activeRacesByYear: RaceDataObject;
}


export interface RatioPerRace {
  race: string;
  ratio: number;
  count: number;
  universityName: string;
}

export interface ItemsData {
  label: string;
  amount: number;
}

export interface AmountData {
  [item: string]: number;
}

export interface ReportsCategoryBreakDown {
  heading: string,
  year: number | string,
  totalAllocations?: number;
  totalNumberOfActiveStudents?: number;
  totalPerRace?: RatioPerRace[];
  subHeading: string,
}

export interface UpdateChartData {
  totalAllocationByUniversity?: ItemsData[];
  totalAmountUsedByUniversity?: ItemsData[];
  activeStudents?: AmountData[];
  activeRaces?: RatioPerRace[];
}

export const BAR_OPTIONS: ChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
      indexAxis: 'y',
      scales: {
        x: {
          grid: { display: false, },
          ticks: {
            callback: () => { return "" }
          },
          display: false,
          beginAtZero: true,
        },
        y: {
          grid: { display: false, },
          beginAtZero: true,
          ticks: {
              font: { size: 10 }
          }
        }
      },
      plugins: {
        legend: { 
          labels: {
            usePointStyle: true,
            pointStyle: 'rectRounded',
            font: { size: 10 }
          }  
        },
        datalabels: {
          anchor: 'end',
          align: 'start',
          color: 'white',
          offset: 4,
          font: {
          weight: 'bold' 
        },
      }
    },
}

export interface PredictedSpending {
  applicationsData: ApplicationData[];
  predictionYears: number[];
}

export interface PredictedValues {
  [key: string]: number
}

export interface ApplicationData {
  applicationId: number;
  amount: number;
  degreeDuration: number;
  yearOfStudy: string;
  year: number;
  race: string | number;
  name: string;
  surname: string;
  email: string;
  universityName: string;
  bursaryType: string;
  predictedValues: PredictedValues;
}