const { app } = require("@azure/functions");
const { auth, userRoles } = require("../shared/auth");
const { cronSchedule } = require("../shared/utils/enums/cronSchedulesEnum");
const {
  uploadProfilePicture,
  getStudentInformation,
  getGenders,
  getStudentInformationById,
  getStudentDocuments,
  confirmDocument,
  getQuestions,
  uploadNewTranscript,
  getAverages,
  getTitles,
  getStudentApplicationGuid,
  updateStudentDetails,
  getStudentDocumentsYears,
  getLocation,
  resetLocation,
  getStudentEvents
} = require("../handlers/studentsHandlers");
const studentAppFunctionName = require("../shared/utils/enums/studentAppfunctionNameEnum");


app.post(studentAppFunctionName.uploadProfilePicture, {
  route: "upload_student_photo",
  authLevel: "anonymous",
  handler: auth(userRoles.student, (request, context) => {
    return uploadProfilePicture(request, context)
  }),
});

app.get(studentAppFunctionName.getStudentInformation, {
  route: "studentInformation",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context) => {
    return getStudentInformation(request, context)
  }),
});

app.get(studentAppFunctionName.getGenders, {
  route: "genderInformation",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context) => {
    return getGenders(request, context)
  }),
});

app.get(studentAppFunctionName.getStudentInformationById, {
  route: "studentInformationById",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getStudentInformationById(request, context, locals);
  }),
});

app.get(studentAppFunctionName.getStudentDocuments, {
  route: "student-documents",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getStudentDocuments(request, context, locals);
  }),
});

app.post(studentAppFunctionName.confirmDocument, {
  route: "confirmDocument",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return confirmDocument(request, context, locals);
  }),
});

app.get(studentAppFunctionName.getQuestions, {
  route: "questions",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context) => {
    return getQuestions(request, context)
  }),
});

app.post(studentAppFunctionName.uploadNewTranscript, {
  route: "update-transcript",
  authLevel: "anonymous",
  handler: auth(userRoles.student, (request, context, locals) => {
    return uploadNewTranscript(request, context, locals)
  }),
});

app.get(studentAppFunctionName.getAverages, {
  route: "averages",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context) => {
    return getAverages(request, context)
  }),
});

app.get(studentAppFunctionName.getTitles, {
  route: "titles",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context) => {
    return getTitles(request, context)
  })
})

app.get(studentAppFunctionName.getStudentApplicationGuid, {
  route: "application-guid",
  authLevel: "anonymous",
  handler: auth(userRoles.student, (request, context, locals)=> {
    return getStudentApplicationGuid(request, context, locals);
  })
})

app.get(studentAppFunctionName.studentInfo, {
  route: "student-info",
  authLevel: "anonymous",
  handler: auth(userRoles.student, (request, context, locals) => {
    return getStudentInformationById(request, context, locals);
  }),
});

app.get(studentAppFunctionName.studentDocs, {
  route: "student-docs",
  authLevel: "anonymous",
  handler: auth(userRoles.student, (request, context, locals) => {
    return getStudentDocuments(request, context, locals);
  }),
});

app.put(studentAppFunctionName.studentDetailsUpdate, {
  route: "student-details-update",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return updateStudentDetails(request, context, locals);
  })
})

app.get(studentAppFunctionName.studentDocsYears, {
  route: "student-docs-years",
  authLevel: "anonymous",
  handler: auth(userRoles.student, (request, context) => {
    return getStudentDocumentsYears(request, context);
  }),
});

app.get(studentAppFunctionName.location,{
  route:"location",
  authLevel:"anonymous",
  handler:( (request,context)=>{
    return getLocation(request,context);
  })
})

app.timer(studentAppFunctionName.resetLocationRequests,{
  schedule: cronSchedule.firstDayOfTheMonth,
  handler: async (myTimer, context) => {
    return await resetLocation(context);
  },
})

app.get(studentAppFunctionName.studentEvents, {
  route: "student-events-data",
  authLevel: "anonymous",
  handler: auth(userRoles.student, (request, context) => {
    return getStudentEvents(request, context)
  })
})
