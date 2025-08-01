export function hasValidResults(data: any): boolean {
  return data && data.results;
}

export function arrayRange(start: number, stop: number, step: number): number[] {
    return Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step,
    );
  }
