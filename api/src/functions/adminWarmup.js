const { app } = require("@azure/functions");
const { 
  warmupFunction, 
} = require("../shared/utils/helper-functions/warmupHelper");
const { cronSchedule } = require("../shared/utils/enums/cronSchedulesEnum");
const ResponseStatus = require("../shared/utils/enums/responseStatusEnum");

app.timer("adminWarmupSelected", {
  schedule: process.env.WARMUP_SCHEDULE || cronSchedule.weekdayBusinessHoursWarmUp,
  handler: async (myTimer, context) => {
    context.log('[WARMUP] Starting scheduled warm-up of selected admin functions');
    const functionNames = [
      "getBursariesSummary",
      "getUniversityCardData"
    ];
    const results = [];
    for (const fn of functionNames) {
      try {
        const result = await warmupFunction(fn);
        results.push({ function: fn, ...result });
      } catch (error) {
        results.push({ function: fn, success: false, error: error.message });
      }
    }
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    context.log(`[WARMUP] Selected warm-up completed: ${successful} successful, ${failed} failed`);
    return {
      status: ResponseStatus.SUCCESS,
      body: {
        message: 'Selected warm-up completed',
        summary: { total: results.length, successful, failed },
        results,
        timestamp: new Date().toISOString()
      }
    };
  }
});