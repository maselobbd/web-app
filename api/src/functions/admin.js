const { app } = require("@azure/functions");
const { auth, userRoles } = require("../shared/auth");
const { cronSchedule } = require("../shared/utils/enums/cronSchedulesEnum");
const functionNames = require("../shared/utils/enums/functionNamesEnum");
const {
  createAdmin,
  emailFailedStudentApplication,
  updateApplicationAmount,
  getYearOfApplications,
  getApplicationsDetails,
  adminUpdateApplicationStatusHistory,
  adminRejectStudentApplication,
  applicationsReport,
  getAdminDashBoardData,
  uploadPayment,
  getApplicationDocuments,
  uploadAdminDocuments,
  getExpenses,
  getExpensesValues,
  getYearsOfFunding,
  getBursaryTypes,
  updateInvoiceStatus,
  inviteHOD,
  getAllUniversities,
  addUniversity,
  getFaculties,
  addDepartment,
  getDepartmentsAndUniversity,
  getDeclinedApplications,
  nudgeStudents,
  getStudentsToNudge,
  getStudentExpense,
  postExpense,
  postExistingApplication,
  autoNudgeStudents,
  calculateAverages,
  nonResponsiveStudent,
  autoNudgeExecutives,
  resendEmailToExecutive,
  setCronConfig,
  updateUniversityDepartment,
  updateUniversityDepartmentStatus,
  getApplicationSettings,
  updateStudentDocument,
  maintenanceMode,
  processMail,
  reportsData,
  getUniversityCardData,
  getBursariesSummary,
  getDeclinedReasons
} = require("../handlers/adminHandlers");


app.post(functionNames.createAdmin, {
  route: "createAdminUser",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return createAdmin(request, context, locals);
  }),
});

app.post(functionNames.emailFailedStudentApplication, {
  route: "emailFailedStudentApplication",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return emailFailedStudentApplication(request, context, locals);
  }),
});

app.put(functionNames.updateApplicationAmount, {
  route: "updateApplicationAmount",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return updateApplicationAmount(request, context, locals);
  }),
});

app.post(functionNames.insertInvoiceStatusHistory, {
  route: "contract-signed",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return insertInvoiceStatusHistory(request, context, locals);
  }),
});

app.get(functionNames.getYearOfApplications, {
  route: "years",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getYearOfApplications(request, context, locals);
  }),
});

app.get(functionNames.getApplicationsDetails, {
  route: "applicationsInfoDetails",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getApplicationsDetails(request, context, locals);
  }),
});

app.post(functionNames.updateStudentApplicationStatus, {
  route: "update-student-application-status",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return adminUpdateApplicationStatusHistory(request, context, locals);
  }),
});

app.post(functionNames.rejectStudentApplication, {
  route: "reject-student-application",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return adminRejectStudentApplication(request, context, locals);
  }),
});

app.post(functionNames.terminateStudentApplication, {
  route: "student-terminate-bursary",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return adminRejectStudentApplication(request, context, locals);
  }),
});

app.get(functionNames.applicationsReport, {
  route: "applications-report",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return applicationsReport(request, context, locals);
  }),
});

app.get(functionNames.adminData, {
  route: "allAdminData",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getAdminDashBoardData(request, context, locals);
  }),
});

app.post(functionNames.uploadPayment, {
  route: "uploadPayment",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return uploadPayment(request, context, locals);
  }),
});

app.get(functionNames.getApplicationDocuments, {
  route: "application-documents",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context, locals) => {
    return getApplicationDocuments(request, context, locals);
  }),
});

app.post(functionNames.uploadAdminDocuments, {
  route: "upload-admin-documents",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return uploadAdminDocuments(request, context, locals);
  }),
});

app.get(functionNames.getExpenses, {
  route: "expense-types",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getExpenses(request, context, locals);
  }),
});

app.get(functionNames.studentExpenseTypes, {
  route: "student-expense-types",
  authLevel: "anonymous",
  handler: auth(userRoles.student, (request, context, locals) => {
    return getExpenses(request, context, locals);
  }),
});

app.get(functionNames.getExpensesValues, {
  route: "expenses",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getExpensesValues(request, context, locals);
  }),
});

app.get(functionNames.getYearsOfFunding, {
  route: "funding-years",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context, locals) => {
    return getYearsOfFunding(request, context, locals);
  }),
});
app.get(functionNames.studentFundingYears, {
  route: "student-funding-years",
  authLevel: "anonymous",
  handler: auth(userRoles.student, (request, context, locals) => {
    return getYearsOfFunding(request, context, locals);
  }),
});

app.get(functionNames.getBursaryTypes, {
  route: "bursary-types",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getBursaryTypes(request, context, locals);
  })
});

app.post(functionNames.updateInvoiceStatus, {
  route: "update-invoice-status",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context, locals) => {
    return updateInvoiceStatus(request, context, locals);
  }),
});

app.post(functionNames.sendEmailToHod, {
  route: "sendEmail",
  authLevel: "anonymous",
  handler: auth(userRoles.dean, (request, context, locals) => {
    return inviteHOD(request, context, locals);
  }),
});

app.get(functionNames.getAllUniversities, {
  route: "universities",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getAllUniversities(request, context, locals);
  }),
});

app.post(functionNames.addUniversity, {
  route: "addUniversity",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return addUniversity(request, context, locals);
  }),
});

app.get(functionNames.getFaculties, {
  route: "faculties",
  authLevel: "anonymous",
  handler: auth(userRoles.dean, (request, context, locals) => {
    return getFaculties(request, context, locals);
  }),
});

app.post(functionNames.addDepartment, {
  route: "addDepartment",
  authLevel: "anonymous",
  handler: auth(userRoles.dean, (request, context, locals) => {
    return addDepartment(request, context, locals);
  }),
});

app.get(functionNames.getDepartmentsAndUniversity, {
  route: "getDepartmentsAndUniversity",
  authLevel: "anonymous",
  handler: auth(userRoles.dean, (request, context, locals) => {
    return getDepartmentsAndUniversity(request, context, locals);
  }),
});

app.get(functionNames.getDeclinedApplications, {
  route: "declinedApplications",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getDeclinedApplications(request, context, locals);
  }),
});

app.post(functionNames.nudgeStudents, {
  route: "nudgeStudents",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return nudgeStudents(request, context, locals);
  }),
});

app.get(functionNames.getStudentsToNudge, {
  route: "studentToNudgeList",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getStudentsToNudge(request, context, locals);
  }),
});

app.get(functionNames.getStudentExpense, {
  route: "studentExpense",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getStudentExpense(request, context, locals);
  }),
});

app.post(functionNames.postExpense, {
  route: "insertExpense",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return postExpense(request, context, locals);
  }),
});

app.post(functionNames.postExistingApplication, {
  route: "insertExistingApplication",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return postExistingApplication(request, context, locals);
  }),
});

app.timer(functionNames.autoNudgeStudents, {
  schedule: cronSchedule.nudgeJanAndDec,
  handler: (myTimer, context) => {
    return autoNudgeStudents(context);
  },
});

app.timer(functionNames.averageCalculationsTimer, {
  schedule: cronSchedule.averageSchedule,
  handler: async (myTimer, context) => {
    return await calculateAverages(context);
  },
});

app.timer(functionNames.nonResponsiveStudent, {
  schedule: cronSchedule.nudgeEvery7Days,
  handler: async (myTimer, context) => {
    return await nonResponsiveStudent();
  },
});

app.timer(functionNames.autoNudgeExecutives, {
  schedule: cronSchedule.nudgeOnceAWeek,
  handler: async (myTimer, context) => {
    return await autoNudgeExecutives(context);
  },
});

app.post(functionNames.sendEmailToExecutive, {
  route: "sendEmailToExecutive",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, async (request, context,locals) => {
    return resendEmailToExecutive(request, context,locals);
  }),
});

app.put(functionNames.setCronConfig, {
  route: "set-cron-config",
  authLevel: "anonymous",
  handler: setCronConfig,
});

app.put(functionNames.updateUniversityDepartment, {
  route: "updateUniversityDepartment",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return updateUniversityDepartment(request, context, locals);
  }),
});

app.put(functionNames.updateUniversityDepartmentStatus, {
  route: "updateUniversityDepartmentStatus",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return updateUniversityDepartmentStatus(request, context, locals);
  }),
});

app.get(functionNames.config, {
  route: "config",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context, locals) => {
    return getApplicationSettings(request, context, locals)
  })
})

app.post(functionNames.updateStudentDocument, {
  route: "update-student-document",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context,locals) => {
    return updateStudentDocument(request, context,locals)
  }),
});

app.get(functionNames.getMaintenance, {
  route: "maintenance",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context, locals) => {
    return maintenanceMode(request, context, locals)
  })
});

app.post(functionNames.readEmail,{
  route:"readMail",
  authLevel:"function",
  handler: (request, context, locals) => {
    return processMail(request, context, locals)
  }
})

app.get(functionNames.getReportsData, {
  route: "reports",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return reportsData(request, context, locals)
  })
});

app.get(functionNames.getUniversityCardData, {
  route: "university-card-data",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getUniversityCardData(request, context, locals);
  }),
})

app.get(functionNames.getBusariesSummary, {
  route: "bursaries-summary",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getBursariesSummary(request, context, locals);
  }),
})

app.get(functionNames.getDeclinedReasons, {
  route: "get-declined-reasons",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context) => {
    return getDeclinedReasons(request, context);
  }),
});
