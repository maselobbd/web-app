const { tokenValidation } = require("./utils/helper-functions/token-validation");
const userRoles = {
  all: 0,
  student: 1,
  university: 2,
  dean: 3,
  finance: 4,
  admin: 5,
};

const isAuthorizedRoleLevel = (authRole, role) => {
  const roleLevel = userRoles[`${role}`] ?? userRoles.noRole;
  return roleLevel >= authRole;
};

const auth = (authRole, next) => async (req, context) => {
  const isWarmUp =
    req.headers.get("x-warmup") === "true" &&
    req.headers.get("x-warmup-secret") === process.env.WARMUP_SECRET;

  if (isWarmUp) {
    return next(req, context, { isWarmUp: true });
  }
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (token) {
      const verificationDetails = await tokenValidation(token);
      if (verificationDetails?.verified) {
        // University users do not have a role - return immediately if signed in
        if (authRole == userRoles.university) {
          return next(req, context, verificationDetails);
        } else if (isAuthorizedRoleLevel(authRole, verificationDetails?.role)) {
          return next(req, context, verificationDetails);
        }
      }
    }

    // If there is no token - give the least privileged "all" role to this user
    const noTokenRole = "all";
    if (isAuthorizedRoleLevel(authRole, noTokenRole)) {
      return next(req, context);
    }

    //token takes time to be set, prematurely gives 403 
    return {
      status: 403,
      jsonBody: "not authorized",
    };
  } catch (e) {
    return {
      status: e.status ?? 500,
      body: {
        message: e.message ?? "Internal server error",
      },
    };
  }
};

module.exports = {
  auth,
  userRoles,
};
