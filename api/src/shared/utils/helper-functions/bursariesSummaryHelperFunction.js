const getAggregatedSummaryWithSummaryData = (data) => {
  return data.map(bursary => {
    const totals = Array.isArray(bursary.bursaryStats)
      ? bursary.bursaryStats.reduce((accumulator, currentStat) => {
          accumulator.activeBursaries += currentStat.activeBursaries;
          accumulator.applications += currentStat.applications;
          return accumulator;
        }, { activeBursaries: 0, applications: 0 })
      : { activeBursaries: 0, applications: 0 };

    return {
      id: bursary.bursaryType,
      name: bursary.bursaryType,
      fundAllocation: bursary.bursaryAmountSummary || 0, 
      activeBursaries: totals.activeBursaries,
      applications: totals.applications,
      fundSpending: bursary.fundSpending,
      fundSpendingTotal: getTotal(bursary.fundSpending),
    };
  });
};
const getTotal=(entity)=>
{
  return entity.reduce((accumulator, currentStat) => {
    accumulator.total += currentStat.amount;
    return accumulator;
  }, { total: 0 });
}

module.exports = { getAggregatedSummaryWithSummaryData, getTotal };