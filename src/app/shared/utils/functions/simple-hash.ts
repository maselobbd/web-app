export function generatestamp(): number {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  return timestamp;
}
