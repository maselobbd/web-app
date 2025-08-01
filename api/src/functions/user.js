const { app } = require("@azure/functions");
const { auth , userRoles} = require("../shared/auth");
const { cronSchedule } = require("../shared/utils/enums/cronSchedulesEnum");
const userAppfunctionNames = require("../shared/utils/enums/userAppFunctionNameEnum");
const {
  getUsers,
  updateUser,
  deleteUser,
  verifyUser,
  checkUserExists,
  updateAdminRanks,
  syncUsers,
  clearCache
} = require("../handlers/userHandlers");


// This currently has no auth as we have to manually assign roles to admin + finance users in postman etc.
// Add auth as soon as we can do this on the FE
app.get(userAppfunctionNames.getUsers, {
  route: "users",
  authLevel: "anonymous",
  handler: ((request, context, locals) => {
    return getUsers(request, context, locals);
  }),
});

// This currently has no auth as we have to manually assign roles to admin + finance users in postman etc.
// Add auth as soon as we can do this on the FE
app.put(userAppfunctionNames.updateUser, {
  route: "user",
  authLevel: "anonymous",
  handler: auth(userRoles.dean,(request, context, locals) => {
    return updateUser(request, context, locals);
  }),
});
app.put(userAppfunctionNames.deleteUser, {
  route: "deleteUser",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return deleteUser(request, context, locals);
  }),
})

app.post(userAppfunctionNames.isUserInvited, {
  route: "isUserInvited",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context) => {
    return verifyUser(request, context)
  })
})

app.get(userAppfunctionNames.checkUserExists, {
  route: "check-user",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return checkUserExists(request, context, locals);
  })
})
app.put(userAppfunctionNames.updateAdminUserRanks,{
  route: "update-ranks",
  authLevel:"anonymous",
  handler: ((request,context,locals)=>{
    return updateAdminRanks(request,context,locals)
  })
})

app.timer(userAppfunctionNames.updateUserTable, {
  schedule: cronSchedule.nudgeEveryday,
  handler: async (myTimer, context) => {
    return await syncUsers();
  },
});

app.post('logout',{
  route:"logout",
  authLevel:"anonymous",
  handler: ((request,context,locals)=>{
    return clearCache(request,context,locals)
  })
})
