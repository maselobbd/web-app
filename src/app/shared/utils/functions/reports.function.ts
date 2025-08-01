import { Chart } from "chart.js/auto";
import { AmountData, ItemsData, RatioPerRace, ReportsCategoryBreakDown, AllocationStudentRaceReportsDataItems,  AllAllocationAndSpending, UniversitiesAllocationSpentData,  UniversitiesActiveStudents, AmountDataObject, UniversitiesActiveRaces, UpdateChartData, ReportsData, PredictedSpending } from "../../../admin/data-access/models/applications-report.model";
import { CategoryBreakdownTitles } from "../../enums/categories";
import { Context } from "chartjs-plugin-datalabels";
import { arrayRange } from "./checkData.function";

function filterValueIsAll(filterValue: (string | number)): boolean {
  return (typeof filterValue === 'string' && filterValue.toLowerCase() === CategoryBreakdownTitles.FILTER_DEFAULT.toLowerCase());
}

export function getStudentsAndFundsData(data : AllocationStudentRaceReportsDataItems, filterValue: (string | number)): ReportsCategoryBreakDown {
  const reportsCategoryBreakDown = {
    heading: CategoryBreakdownTitles.TOTAL,
    year: filterValue,
    subHeading: CategoryBreakdownTitles.PERCENTAGES_HEADING,
  };
  if(filterValueIsAll(filterValue)) {
    Object.assign(reportsCategoryBreakDown, {
      totalAllocations: data.allAllocationStudentAndRace.totalAllocations,
      totalNumberOfActiveStudents: data.allAllocationStudentAndRace.totalNumberOfActiveStudents,
      totalPerRace: data.allAllocationStudentAndRace.totalPerRace.sort((raceA, raceB) => raceA.race.localeCompare(raceB.race)),
    })
  } else {
    const allocationByYear: AmountData | undefined = data.byYearAllocationStudentRace.allocationByYear.find((allocation: AmountData) => allocation[String(filterValue)]);
    const numberOfStudentsByYear: AmountData | undefined = data.byYearAllocationStudentRace.studentsByYear.find((studentDetail: AmountData) => studentDetail[String(filterValue)])
    Object.assign(reportsCategoryBreakDown, {
      totalAllocations:  allocationByYear ? allocationByYear[String(filterValue)] : 0 ,
      totalNumberOfActiveStudents: numberOfStudentsByYear ? numberOfStudentsByYear[String(filterValue)] :  0,
      totalPerRace: data.byYearAllocationStudentRace.raceByYear[String(filterValue)] ? data.byYearAllocationStudentRace.raceByYear[String(filterValue)].sort((raceA, raceB) => raceA.race.localeCompare(raceB.race)) : [],
    })
  }
  return reportsCategoryBreakDown
}

export function getUniversitiesAllocationSpentData(data: UniversitiesAllocationSpentData, filterValue: number | string): AllAllocationAndSpending {
  if(filterValueIsAll(filterValue)) {
    return {
      totalAllocationByUniversity: data.allAllocationAndSpending.totalAllocationByUniversity,
      totalAmountUsedByUniversity: data.allAllocationAndSpending.totalAmountUsedByUniversity,
    }
  } else {
    return {
      totalAllocationByUniversity: data.byYearAllocationAndSpending.allocationByYear[String(filterValue)] || [],
      totalAmountUsedByUniversity: data.byYearAllocationAndSpending.usedByYear[String(filterValue)] || [],
    }
  }
}

export function getActiveStudents(data: UniversitiesActiveStudents, filterValue: (string | number)): { activeStudents: AmountData[] } {
  if(filterValueIsAll(filterValue)) {
    return {
      activeStudents: data.allActiveStudents.totalActiveStudents,
    } 
  } else {
    const activeStudents: AmountDataObject | undefined= data.byYearAcitveStudents.totalActiveStudentsByYear.find((activeStudentDetail: AmountDataObject) => activeStudentDetail[String(filterValue)]);
    return {
      activeStudents: activeStudents ? activeStudents[String(filterValue)] : []
    }
  }
}

export function getActiveRaces(data: UniversitiesActiveRaces, filterValue: (string | number)): { activeRaces: RatioPerRace[] } {
  if(filterValueIsAll(filterValue)) {
    return {
      activeRaces: data.allUniversitiesActiveRaces.totalActiveRaces.sort((raceA: RatioPerRace, raceB: RatioPerRace) => raceA.race.localeCompare(raceB.race)),
    }
  } else {
    return {
      activeRaces: data.byYearUniversitiesActiveRaces.activeRacesByYear[String(filterValue)] ? (data.byYearUniversitiesActiveRaces.activeRacesByYear[String(filterValue)]).sort((raceA: RatioPerRace, raceB: RatioPerRace) => raceA.race.localeCompare(raceB.race)) : [],
    }
  }
}

export function updateChart(chart: Chart, reportsData: any): void {
  chart.data.datasets.forEach(dataset => {
    switch(dataset.label) {
      case CategoryBreakdownTitles.FUND_ALLOCATION:  {
        dataset.data = getFundAllocation(reportsData);
        chart.data.labels = getFundAllocation(reportsData).map((allocationDetail: {amount: number; label: string}) => allocationDetail.label);
        break;
      }
      case CategoryBreakdownTitles.USED: {
        dataset.data = getAmountSpent(reportsData);
        break;
      }
      case CategoryBreakdownTitles.STUDENTS_LABEL: {
        dataset.data = getFundedStudents(reportsData);
        const activeStudents: AmountData[] | undefined = reportsData.activeStudents;
        chart.data.labels = activeStudents ? activeStudents.flatMap((studentsData: AmountData) => Object.keys(studentsData)) : []; 
        break;
      }
    }
  });
  chart.update();
}

export function getFundAllocation(reportsData: UpdateChartData): any {
  const totalAllocationByUniversity: ItemsData[] | undefined = reportsData.totalAllocationByUniversity;
  return totalAllocationByUniversity ? totalAllocationByUniversity.map((allocationData: ItemsData) => ({amount: allocationData.amount, label: allocationData.label})) : []
}

export function getAmountSpent(reportsData: UpdateChartData): any {
  const totalAmountUsedByUniversity: ItemsData[] | undefined = reportsData.totalAmountUsedByUniversity; 
  return totalAmountUsedByUniversity ? totalAmountUsedByUniversity.map(((usedAmountData: ItemsData) => ({ amount: usedAmountData.amount, label: usedAmountData.label }))) : [];
}

export function getFundedStudents(reportsData: UpdateChartData): number[] {
  const activeStudents: AmountData[] | undefined = reportsData.activeStudents;
  return activeStudents ? activeStudents.flatMap((studentsData: AmountData) => Object.values(studentsData)) : [];
}

export function getPredictedSpending(reporsData: ReportsData, year: number | string): PredictedSpending {
  if(typeof year === 'string' && year.toLowerCase() === CategoryBreakdownTitles.FILTER_DEFAULT.toLowerCase()) {
    return reporsData.predictedSpending;
  }
  return {
    applicationsData: reporsData.predictedSpending.applicationsData.filter(applicationData => applicationData.year === year),
    predictionYears: typeof year === 'number' ? arrayRange(year + 1, year + 4, 1) : []
  }
} 
