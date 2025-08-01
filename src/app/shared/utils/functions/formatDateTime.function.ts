export function formatDateTime(startDate: Date, endDate: Date, startTime: string, endTime: string): { startDateTime: string; endDateTime: string } {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const fullStartDateTime = new Date(startDate);
  const fullEndDateTime = new Date(endDate);
  fullStartDateTime.setHours(startHours, startMinutes, 0, 0);
  fullEndDateTime.setHours(endHours, endMinutes, 0, 0);

  return {
    startDateTime: toLocalDateTimeString(fullStartDateTime),
    endDateTime: toLocalDateTimeString(fullEndDateTime)
  };
}

function toLocalDateTimeString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}
