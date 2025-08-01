const { ClientSecretCredential } = require("@azure/identity");
const { Client } = require("@microsoft/microsoft-graph-client");
const {
  TokenCredentialAuthenticationProvider,
} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const { userStatuses, userRoles } = require("../../auth");
const { get_invited_users_data,update_invited_user_status_data,user_email_update_data, get_users_from_db_data,remove_user_from_lookup_table_data } = require("../../../data-facade/usersData");
const { isAzureId } = require("./verifyAzureEntity");
const { isEmpty } = require("./checkCollection");
const { roles } = require("../enums/rolesEnum");

const getAuthProvider = () => {
  const credential = new ClientSecretCredential(
    process.env.B2C_Tenant_ID,
    process.env.B2C_App_ID,
    process.env.B2C_App_Secret,
  );

  return new TokenCredentialAuthenticationProvider(credential, {
    scopes: ["https://graph.microsoft.com/.default"],
  });
};

const getGraphClient = () => {
  return Client.initWithMiddleware({
    authProvider: getAuthProvider(),
  });
};

const removeArrayExtensionString = (responseValues) => {
  // Remove the "extension_xxx_" string from the array keys as we don't want to share the extension application ID
  const extensionString = `extension_${process.env.B2C_Extensions_Application_ID}_`;
  for (const value of responseValues) {
    Object.keys(value).forEach((key) => {
      if (key == "identities") {
        value["emailAddress"] = value[key][0].issuerAssignedId;
        delete value[key];
      } else if (key.startsWith(extensionString)) {
        const extensionName = key.split("_").slice(2).join("_");
        value[extensionName] = value[key];
        delete value[key];
      }
    });
  }
  return responseValues;
};

const getUsersDetails = async () => {
  const response = await getGraphClient()
    .api(`/users`)

    .select(
      `displayName,
       givenName,
       surname,
       id,
       accountEnabled,
       identities,
       extension_${process.env.B2C_Extensions_Application_ID}_Contactnumber,
       extension_${process.env.B2C_Extensions_Application_ID}_role,
       extension_${process.env.B2C_Extensions_Application_ID}_Rank,
       extension_${process.env.B2C_Extensions_Application_ID}_Faculty,
       extension_${process.env.B2C_Extensions_Application_ID}_Department,
       extension_${process.env.B2C_Extensions_Application_ID}_University`
    )
    .expand("extensions")
    .get()
    .catch((error) => {
      return { error: error };
    });
  // Use this to remove the "extension..." information before returning values
    // if (response.value) {
    //   return removeArrayExtensionString(response.value);
    // }
  if (response.value) {
    return extractInfoFromUsers(response.value);
  }
  return null;
};

const fetchAllUsers= async(facultyName,universityName, refresh = false) => {
    let users = refresh ? await fetchUsersFromAzure() : await get_users_from_db_data();
    if(isEmpty(users))
    {
      users = await fetchUsersFromAzure();
    }
    const invitedUser = await get_invited_users_data();
    const savedUsers = await get_users_from_db_data();
    const duplicates = invitedUser.filter((invited) => users.some((user) => user.emailAddress === invited.emailAddress)

    );

    const nonDuplicateUsers = invitedUser.filter((invited) =>
      {
        const savedUser = savedUsers.find(savedUser => invited.emailAddress === savedUser.emailAddress)
        if(savedUser) Object.assign(invited, { givenName: savedUser.givenName, surname: savedUser.surname, contactNumber: savedUser.contactNumber });
        return !users.some((user) => user.emailAddress === invited.emailAddress)
      }
    );

    users = users.concat(nonDuplicateUsers);
    for(let dup of duplicates)
    {
      await update_invited_user_status_data(dup.emailAddress,'Active');
    }
   if(facultyName && universityName)
   {
     return users.filter(user => user.Faculty === facultyName && user.Faculty === universityName);
   }
   return users;
  }
 //this function takes 4-6 seconds, nothing you can do about it.
 const fetchUsersFromAzure= async()=>
 {
  let users = [];
  let nextLink = `/users?` + new URLSearchParams({
    '$filter': `accountEnabled eq true`,
    '$select': `displayName,
                 givenName,
                 surname,
                 id,
                 accountEnabled,
                 identities,
                 extension_${process.env.B2C_Extensions_Application_ID}_Contactnumber,
                 extension_${process.env.B2C_Extensions_Application_ID}_role,
                 extension_${process.env.B2C_Extensions_Application_ID}_Rank,
                 extension_${process.env.B2C_Extensions_Application_ID}_Faculty,
                 extension_${process.env.B2C_Extensions_Application_ID}_Department,
                 extension_${process.env.B2C_Extensions_Application_ID}_University`,
    '$expand': `extensions`
  }).toString();

  while (nextLink) {
    try {
      const response = await getGraphClient().api(nextLink).get();

      if (response.value && response.value.length > 0) {
        users.push(...extractInfoFromUsers(response.value));
      }

      nextLink = response['@odata.nextLink'] || null;

    } catch (error) {
      return { error: error };
    }
  }

  return users;
 }
function extractUserInfo(user) {
  const givenName= user['givenName']|| '';
  const surname= user['surname'] || '';
  const id= user['id'] || '';
  const accountEnabled= user['accountEnabled'] || false;
  const Faculty = user[`extension_${process.env.B2C_Extensions_Application_ID}_Faculty`] || '';
  const Department = user[`extension_${process.env.B2C_Extensions_Application_ID}_Department`] || '';
  const University = user[`extension_${process.env.B2C_Extensions_Application_ID}_University`] || '';
  const contactNumber = user[`extension_${process.env.B2C_Extensions_Application_ID}_Contactnumber`] || '';
  const role = user[`extension_${process.env.B2C_Extensions_Application_ID}_role`] ||roles.HOD.toUpperCase();
  const emailIdentity = user.identities.find(identity => identity.signInType === 'emailAddress');
  const emailAddress = emailIdentity ? emailIdentity.issuerAssignedId : '';
  const rank = user[`extension_${process.env.B2C_Extensions_Application_ID}_Rank`] || '';

  return {
      Faculty,
      University,
      Department,
      emailAddress,
      givenName,
      surname,
      id,
      role,
      rank,
      accountEnabled,
      contactNumber,
  };
}

function extractInfoFromUsers(users) {
  return users
      .map(user => extractUserInfo(user))
}

const updateUserInfo = async (userId, customAttributes) => {
  if (!userId) {
    return {
      error: "Invalid UserId",
    };
  }
  if (!customAttributes) {
    return {
      error: "No custom attributes provided",
    };
  }
  const givenName= customAttributes.givenName;
  const surname= customAttributes.surname;
  const emailAddress= customAttributes.emailAddress;
  const accountEnabled= customAttributes.active;
  const contactNumber = customAttributes.contactNumber;
  const role = customAttributes.role;
  const rank = customAttributes.rank;

  const userInfo = {
    givenName: givenName,
    accountEnabled: accountEnabled,
    surname: surname,
    [`extension_${process.env.B2C_Extensions_Application_ID}_Contactnumber`]: contactNumber,
    [`extension_${process.env.B2C_Extensions_Application_ID}_role`]: role,
    [`extension_${process.env.B2C_Extensions_Application_ID}_Rank`]: rank,
    [`extension_${process.env.B2C_Extensions_Application_ID}_Faculty`] : role === roles.EXEC || role === roles.ADMIN? null : customAttributes.Faculty,
    [`extension_${process.env.B2C_Extensions_Application_ID}_Department`] : role === roles.EXEC || role === roles.ADMIN? null : customAttributes.Department,
    [`extension_${process.env.B2C_Extensions_Application_ID}_University`] : role === roles.EXEC || role === roles.ADMIN? null : customAttributes.University,
    identities: [
      {
        signInType: "emailAddress",
        issuer: process.env.IDENTITIES_ISSUER,
        issuerAssignedId: emailAddress,
      },
    ],
  };


  // for (const key in customAttributes) {
  //   // do not add empty custom attributes to the object
  //   if (customAttributes[key]) {
  //     // Add "extension_applicationID_" to the front of each custom attribute object name
  //     // - where applicationID is the application ID of the auto generated b2c extensions application
  //     // - NB: this applicationID must be formatted without any "-"
  //   //  if(key === 'Department'||key === 'University'||key === 'Faculty'){
  //     userInfo[
  //       `extension_${process.env.B2C_Extensions_Application_ID}_${key}`
  //     ] = customAttributes[key] + "";
  //   //}
  //     // else{
  //     //   userInfo[key] = customAttributes[key] + "";
  //     // }
  //      // Custom attributes are cast to string as all user attributes are strings on Azure
  //   }
  // }

  try {
    if(customAttributes.previousEmail)
    {
      await user_email_update_data(customAttributes.previousEmail,emailAddress)
    }
    if(isAzureId(userId)){
      await getGraphClient().api(`/users/${userId}`).update(userInfo);
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

const deleteUserInfo = async (userId,emailAddress) => {
  if (!userId) {
    return {
      error: "Invalid UserId",
    };
  }
  try {
    await update_invited_user_status_data(emailAddress,'Removed')
    if(isAzureId(userId))
      {
      await remove_user_from_lookup_table_data(userId);
      await getGraphClient().api(`/users/${userId}`).update({
        accountEnabled: false});
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

const checkUser = async(email) => {
  try {
    const user = await getGraphClient().api('/users').filter(`identities/any(i:i/issuerAssignedId eq '${email}'  and i/issuer eq '${process.env.IDENTITIES_ISSUER}')`)
    .get();
    if(user.value.length > 0) {
      if(user.value[0].id) return user.value[0].id
    }
    return null;
  } catch(error) {
    return error
  }
}

const createUser = async(studentAttributes) => {
  try {
    const userInfo = {
      displayName: studentAttributes.displayName,
      givenName: studentAttributes.givenName,
      Surname: studentAttributes.surname,
      accountEnabled: true,
      [`extension_${process.env.B2C_Extensions_Application_ID}_Contactnumber`]: studentAttributes.contactNumber,
      [`extension_${process.env.B2C_Extensions_Application_ID}_role`]: studentAttributes.role,
      [`extension_${process.env.B2C_Extensions_Application_ID}_Faculty`] : studentAttributes.faculty,
      [`extension_${process.env.B2C_Extensions_Application_ID}_Department`] : studentAttributes.department,
      [`extension_${process.env.B2C_Extensions_Application_ID}_University`] : studentAttributes.university,
      identities: 
      [{
        signInType: "emailAddress",
        issuer: process.env.IDENTITIES_ISSUER,
        issuerAssignedId: studentAttributes.emailAddress,
      },],
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password: studentAttributes.password,
      }
    };
    const user = await getGraphClient().api("/users").post(userInfo);
    return user
  } catch(error) {
    return {
      error: error,
    }
  }
}

module.exports = {
  getUsersDetails,
  updateUserInfo,
  deleteUserInfo,
  checkUser,
  fetchAllUsers,
  createUser
};
