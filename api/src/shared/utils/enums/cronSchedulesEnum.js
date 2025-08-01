const cronSchedule = Object.freeze({
    nudgeJanAndJuly: '0 10 1 1,7 *',
    nudgeFeb: '0 10 1 15 2',
    nudgeMinute: '* * * * *',
    averageSchedule: "0 23 * * Monday-Friday",
    nudgeEvery7Days: '0 10 */7 * *' ,
    firstDayOfTheMonth: '0 0 1 * *',
    nudgeEveryday:'0 6 * * *',
    twiceAMonth:'0 8 1,15 * *',
    nudgeOnceAWeek:'0 10 * * 1',
    nudgeOnceInTwoWeeks:'0 10 * 9,10 1/2',
    updateEventStatuses: '0 59 23 * * 6',
    weekdayBusinessHoursWarmUp:'0 */10 08-17 * * 1-5'
});

module.exports = {
    cronSchedule
}