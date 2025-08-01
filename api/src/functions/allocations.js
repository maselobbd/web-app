const { app } = require("@azure/functions");
const { auth, userRoles } = require("../shared/auth");
const allocationAppFunctionName  = require("../shared/utils/enums/allocationAppFunctionNameEnum");
const {
  getApprovedTotalAndRequestedAmounts,
  GetTotalRequestedAmountForUniversity,
  GetFundAllocationsData,
  GetTotalRequestedAmountForUniversityHOD,
  checkValidDepartment,
  moveDepartmentFunds,
  insertAllocationsForUniversity,
  reallocationsHistory,
  addToTotalFund,
  GetFundAllocationsDataForDean
} = require("../handlers/allocationsHandlers");

app.get(allocationAppFunctionName.getApprovedTotalAndRequestedAmounts, {
  route: "allocations",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getApprovedTotalAndRequestedAmounts(request, context, locals);
  }),
});

app.get(allocationAppFunctionName.GetTotalRequestedAmountForUniversity, {
  route: "allocationsForUniversity",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return GetTotalRequestedAmountForUniversity(request, context, locals);
  }),
});

app.get(allocationAppFunctionName.getUniversityAllocations,{
  route: "universityAllocations",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return getUniversityAllocations(request, context, locals);
  }),
})

app.get(
  allocationAppFunctionName .GetFundAllocationsData, {
    route: "fund-allocations-data",
    authLevel: "anonymous",
    handler: auth(
      userRoles.admin, (request, context, locals) => {
        return GetFundAllocationsData(request, context, locals)
      }
    )
  }
)

app.get(allocationAppFunctionName.GetTotalRequestedAmountForUniversityHOD, {
  route: "allocationsForUniversityHOD",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return GetTotalRequestedAmountForUniversityHOD(request, context, locals);
  }),
});

app.get(allocationAppFunctionName.checkValidDepartment, {
  route: "checkValidDepartment",
  authLevel: "anonymous",
  handler: auth(userRoles.university, (request, context, locals) => {
    return checkValidDepartment(request, context, locals);
  }),
});

app.post(allocationAppFunctionName.moveDepartmentFunds, {
  route: "move-department-funds",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return moveDepartmentFunds(request, context, locals);
  })
})

app.post(allocationAppFunctionName.insertAllocationsForUniversity, {
  route: "university-allocations",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return insertAllocationsForUniversity(request, context, locals);
  }),
});

app.post(allocationAppFunctionName.reallocationsHistory, {
  route: "reallocations-history",
  authLevel: "anonymous",
  handler: auth(
    userRoles.admin, (request, context, locals) => {
      return reallocationsHistory(request, context, locals)
    })
})

app.post(allocationAppFunctionName.addToTotalFund, {
  route: "add-to-fund",
  authLevel: "anonymous",
  handler: auth(
    userRoles.admin, (request, context, locals) => {
      return addToTotalFund(request, context, locals)
    }
  )
})

app.get(allocationAppFunctionName.GetFundAllocationsDataForDean, {
  route: "dean-university-fund",
  authLevel: "anonymous",
  handler: auth(
    userRoles.dean, (request, context, locals) => {
      return GetFundAllocationsDataForDean(request, context, locals)
    }
  )
})
