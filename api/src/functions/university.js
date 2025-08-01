const { app } = require("@azure/functions");
const { auth, userRoles } = require("../shared/auth");
const {
  getUniversity,
  getUniversitiesWithApplications,
  getActiveUniversities,
  getHODBursaryApplications,
  getNumberHODBursaryApplications,
  getUniversityId,
  getHODNumberApplicationsByStatus,
  getHODBursaryApplicationsByDate,
  getNumberHODNumberApplicationsByDateStatus,
  getNumberOfHODApplicationsByDate,
  AllHodData,
  getDepartments,
  getFacultyDepartmentsAmount,
  updateUniversityStatus
} = require("../handlers/universityHandlers");
const universityAppFunctionName = require("../shared/utils/enums/universityAppFunctionNameEnum");


app.get(universityAppFunctionName.getUniversity, {
  route: "university",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getUniversity(request, context, locals);
  }),
});

app.get(universityAppFunctionName.getUniversitiesWithApplications, {
  route: "universitiesWithApplications",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getUniversitiesWithApplications(request, context, locals);
  }),
});
app.get(universityAppFunctionName.getActiveUniversities, {
  route: "universitiesActiveBursaries",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getActiveUniversities(request, context, locals);
  }),
});
app.get(universityAppFunctionName.getHODBursaryApplications, {
  route: "getHODBursaryApplications",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getHODBursaryApplications(request, context, locals);
  }),
});

app.get(universityAppFunctionName.getNumberOfHODApplications, {
  route: "numberOfHODApplications",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getNumberHODBursaryApplications(request, context, locals);
  }),
});
app.get(universityAppFunctionName.getUniversityId, {
  route: "universityId",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getUniversityId(request, context, locals);
  }),
});
app.get(universityAppFunctionName.getHODNumberApplicationsByStatus, {
  route: "hodNumberApplicationsByStatus",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getHODNumberApplicationsByStatus(request, context, locals);
  }),
});

app.get(universityAppFunctionName.getHODBursaryApplicationsByDate, {
  route: "hodApplicationsByDate",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getHODBursaryApplicationsByDate(request, context, locals);
  }),
});

app.get(universityAppFunctionName.getHODNumberApplicationsByDateStatus, {
  route: "hodNumberApplicationsByDateStatus",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getNumberHODNumberApplicationsByDateStatus(request, context, locals);
  }),
});

app.get(universityAppFunctionName.numberOfHODApplicationsByDate, {
  route: "numberOfHODApplicationsByDate",
  authLevel: "anonymous",

  handler: auth(userRoles.university, (request, context, locals) => {
    return getNumberOfHODApplicationsByDate(request, context, locals);
  }),
});

app.get(universityAppFunctionName.getUniversityByName, {
  route: "universityByName",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getUniversityByName(request, context, locals);
  }),
});

app.get(universityAppFunctionName.AllHodData, {
  route: "AllHodData",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return AllHodData(request, context, locals);
  })
});

 app.get(universityAppFunctionName.getDepartments, {
  route: "universityDepartments",
  authLevel: "anonymous",
  handler: auth(userRoles.dean, (request, context, locals) => {
    return getDepartments(request, context, locals);
  }),
});

app.get(universityAppFunctionName.getFacultyDepartmentsAmount, {
  route: "universityDepartmentsAmount",
  authLevel: "anonymous",
  handler: auth(userRoles.dean, (request, context, locals) => {
    return getFacultyDepartmentsAmount(request, context, locals);
  }),
});

app.put(universityAppFunctionName.updateUniversityStatus,{
  route: "updateUniversityStatus",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request,context, locals) => {
    return updateUniversityStatus(request, context, locals)
  }),
});
