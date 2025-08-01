const { getCacheInstance } = require("../shared/utils/cache");
const { isEmpty } = require("../shared/utils/helper-functions/checkCollection");
const {
  fetchAllUsers,
  updateUserInfo,
  deleteUserInfo,
  checkUser
} = require("../shared/utils/helper-functions/usersHelperFunctions");
const { roles } = require("../shared/utils/enums/rolesEnum");
const { update_student_details_data } = require("../data-facade/studentData");
const { save_user_in_db_data, get_student_data, get_users_from_db_data } = require("../data-facade/usersData");
const { is_user_invited } = require("../data-facade/adminData");
const { isAzureId } = require("../shared/utils/helper-functions/verifyAzureEntity");
const ResponseStatus = require("../shared/utils/enums/responseStatusEnum");
const ErrorMessages = require("../shared/utils/enums/internalServalErrorMessageEnum");

const getUsers = async (request, context, locals) => {
  const cache = getCacheInstance();
  const faculty = '';
  const university = '';
  let users = cache.get('users');
  try {
    if(isEmpty(users))
    {
      users= await fetchAllUsers(faculty,university,true);
      cache.set('users',users)
      await syncUsers();
    }
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: users,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error.message}`,
    };
  }
};

const updateUser = async (request, context, locals) => {
  const cache = getCacheInstance();
  await syncUsers();
  cache.clear();
  const { oid, customAttributes,  applicationGuidDetailsForm, updatedProfile} = await request.json();
  try {
    if (updatedProfile === roles.STUDENT) {
      await update_student_details_data(
        customAttributes,
        applicationGuidDetailsForm
      );
    }

    const users = await updateUserInfo(oid, customAttributes);
    await save_user_in_db_data({id:oid,...customAttributes});

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: users,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
      ErrorMessages.internalServerError,
    };
  }
};
const deleteUser = async (request, context, locals) => {
  const id  = request.query.get("id");
  const email = request.query.get("email");
  const cache = getCacheInstance()
  cache.clear();
  try {
    const user = await deleteUserInfo(id,email);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: user,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
      ErrorMessages.internalServerError,
    };
  }
}

const verifyUser = async (request, context) => {

  const requestParams = await request.json();
  let action = "ShowBlockPage";

  try {
    const email = requestParams.email.toLowerCase();
    const invitedEmail = await is_user_invited(email);
    const invitedUser = invitedEmail ? invitedEmail[0] : [];
    const student = invitedUser.role === roles.STUDENT ? await get_student_data(email) : null;
    const invitedStudent = student ? student[0] : [];

    action = invitedEmail.length === 0 ? "ShowBlockPage" : "Continue";
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        version: "1.0.0",
        action: action,
        extension_Rank: invitedUser ? invitedUser.rank : "",
        extension_role: invitedUser ? invitedUser.role: "",
        extension_Department: invitedUser ? invitedUser.universityDepartmentName : "",
        extension_University: invitedUser ? invitedUser.universityName : "",
        extension_Faculty: invitedUser ? invitedUser.facultyName : "",
        extension_BursarType: invitedUser && invitedUser.role === roles.STUDENT ? invitedStudent.bursaryType : "",
        extension_ContactNumber: invitedUser && invitedUser.role === roles.STUDENT ? invitedStudent.contactNumber : ""
      }
    }
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: {
        version: "1.0.0",
        action: action,
        userMessage: "An error ocurred, please contact your administrator"
      }
    }
  }
}

const checkUserExists = async (request, context, locals) => {
  try {
    const email = await request.query.get('email');
    const user = await checkUser(email);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: user
    }
  } catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
      ErrorMessages.internalServerError,
    };
  }
}

const updateAdminRanks = async (request,context,locals) =>{
  try{
    const ranks = ['assistant_admin','admin_officer','senior_admin']
    const users = await fetchAllUsers();
    for(let user of users)
    {
      if(user.role === roles.ADMIN && !ranks.includes(user.role)){
        user.rank = ranks[0];
        await updateUserInfo(user.id, user);
      }
    }
    return{
      status: ResponseStatus.SUCCESS,
      jsonBody: users
    }
  }catch(error){
    return{
      status: ResponseStatus.ERROR,
      jsonBody:
      ErrorMessages.internalServerError,
    }
  }
}

const clearCache = async(request,context,locals) =>{
  const canLogout = request.query.get("logout")
  const cache = getCacheInstance()
  if(canLogout)
  {
    cache.clear();
  }
  return {
    status: ResponseStatus.CREATED,
    jsonBody: 'Logout successful'
  }
}

const syncUsers = async (context) =>{
  const usersFromAzure = Array.from(await fetchAllUsers(facultyName = null, universityName = null,true));
  const usersFromDB = Array.from(await get_users_from_db_data());
  const result=[]
  for (const azureUser of usersFromAzure) {
    const isInDB = usersFromDB.some(dbUser => dbUser.id === azureUser.id);
    if (!isInDB && isAzureId(azureUser.id)) {
      result.push(await save_user_in_db_data(azureUser));
    }
  }
}

module.exports = {
  syncUsers,
  getUsers,
  updateUser,
  updateAdminRanks,
  deleteUser,
  clearCache,
  checkUserExists,
  verifyUser
}
