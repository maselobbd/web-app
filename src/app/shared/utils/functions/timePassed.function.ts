export function hasTimePassed(lastTime: string, days: number): boolean {
    const lastDate = new Date(lastTime);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - lastDate.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return differenceInDays >= days;
  }
