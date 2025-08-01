export function currentFiscalYear(): number {
    const currentDate = new Date();
    const fiscalYearStartMonth = 2; // March
    if (currentDate.getMonth() < fiscalYearStartMonth) {
      return currentDate.getFullYear() - 1;
    }
    
    return currentDate.getFullYear();
  }