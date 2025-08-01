export function checkDecimals(amount: number): number {
    if(parseFloat(amount.toFixed(2)) === 0) return 0; 
    return parseFloat(amount.toFixed(2));
  }