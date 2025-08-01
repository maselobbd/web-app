const { app } = require("@azure/functions");
const { auth, userRoles } = require("../shared/auth");
const functionNames = require("../shared/utils/enums/functionNamesEnum");
const { getConfig, setConfig } = require("../handlers/system-configurationHandlers");

app.get(functionNames.setConfig,{
    route:"getConfig",
    authLevel:"anonymous",
    handler: auth(userRoles.all,(request,context,locals)=>{
      return getConfig(request,context,locals);
    }),
  });

app.post(functionNames.getConfig,{
    route:"setConfig",
    authLevel:"anonymous",
    handler: auth(userRoles.admin,(request,context,locals)=>{
      return setConfig(request,context,locals);
    }),
  });
