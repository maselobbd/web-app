const { app } = require("@azure/functions");
const { auth, userRoles } = require("../shared/auth");
const {
  downloadFiles,
  getRaces,
  getDegrees,
  getAvailableBursaryYears,
  checkExistingApplication,
  postApplication,
  updateApplication,
  deleteApplication,
  uploadFiles,
  getIncompleteApplications,
  nudgeHOD,
  getHODApplicationsPendingRenewal,
  onboard
} = require("../handlers/applicationHandlers");
const applicantAppFunctionName = require("../shared/utils/enums/applicationAppFunctionNameEnum");
const { cronSchedule } = require("../shared/utils/enums/cronSchedulesEnum");


app.get(applicantAppFunctionName.downloadFileByName, {
  route: "downloadFileByName",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context) => {
    return downloadFiles(request, context)
  }),
});

app.get(applicantAppFunctionName.getRaces, {
  route: "races",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context) => {
    return getRaces(request, context)
  }),
});

app.get(applicantAppFunctionName.getDegrees, {
  route: "degrees",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context) => {
    return getDegrees(request, context)
  }),
});

app.get(applicantAppFunctionName.getAvailableBursaryYears, {
  route: "bursaryYears",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getAvailableBursaryYears(request, context, locals);
  }),
});

app.post(applicantAppFunctionName.checkExistingApplication, {
  route: "checkExistingApplication",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return checkExistingApplication(request, context, locals);
  }),
});

app.post(applicantAppFunctionName.postApplication, {
  route: "applications",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return postApplication(request, context, locals);
  }),
});

app.put(applicantAppFunctionName.updateApplication, {
  route: "updateApplications",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return updateApplication(request, context, locals);
  }),
});

app.deleteRequest(applicantAppFunctionName.deleteApplication, {
  route: "applications",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return deleteApplication(request, context, locals);
  }),
});

app.post(applicantAppFunctionName["student-application"], {
  route: "student-application",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context) => {
    return uploadFiles(request, context)
  }),
});

app.get(applicantAppFunctionName.incompleteApplications, {
  route: "incompleteApplications",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getIncompleteApplications(request, context, locals);
  }),
});

app.timer(applicantAppFunctionName.nudgeHODRenewal, {
  schedule: cronSchedule.nudgeOnceInTwoWeeks,
  handler: async (myTimer, context) => {
    return await nudgeHOD();
  },
});

app.get(applicantAppFunctionName.applicationDueForRenewal,{
  route: "applicationDueForRenewal",
  authLevel: "anonymous",
  handler: auth(userRoles.university,(request,context,locals)=>{
    return getHODApplicationsPendingRenewal(request,context,locals)
  })
})

app.post(applicantAppFunctionName.onboard, {
  route: "onboard",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return onboard(request, context, locals);
  }),
})
