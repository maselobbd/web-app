const { get_cron_config_data, set_configuration_data } = require("../data-facade/adminData");
const ResponseStatus = require("../shared/utils/enums/responseStatusEnum");
const ErrorMessages = require("../shared/utils/enums/internalServalErrorMessageEnum");

const getConfig = async (request, context,locals) => {
  try {
    const configType= request.query.get("configType");
    const cronConfig = await get_cron_config_data(configType);
    return {
      status:ResponseStatus.SUCCESS,
      jsonBody: cronConfig
    }
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.configNotFound,
    };
  }
}

const setConfig = async (request, context,locals) => {
  try {
    const {config,configType}= await request.json();
    const cronConfig = await set_configuration_data(config,configType);
    return {
      status:ResponseStatus.SUCCESS,
      jsonBody: cronConfig
    }
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.configNotFound,
    };
  }
}

module.exports = {
  getConfig,
  setConfig
}
