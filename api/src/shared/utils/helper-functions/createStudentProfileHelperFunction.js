const {
  get_studentProfile_data,
  store_user_data,
} = require("../../../data-facade/adminData");
const { save_user_in_db_data } = require("../../../data-facade/usersData");
const { userRoles } = require("../../auth");
const {
  inviteStudentEmailMessage,
  inviteStudentSubject,
  inviteBBDStudentSSubject,
} = require("./email-templates");
const ResponseStatus = require("../enums/responseStatusEnum");
const { sendEmail } = require("./send-email");
const bursaryTypes = require("../enums/bursaryTypesEnum");
const invitedUserStatus = require("../enums/invitedUserStatusEnum");
const { generatePassword } = require("./passwordGeneratorHelperFunction");
const { createUser } = require("./usersHelperFunctions");
const { imagePathsEnum } = require("../enums/imagePathsEnum");

async function handleStudentProfileCreation(
  context,
  applicationId,
  userId,
  cache,
  userRole
) {
  const studentData = await get_studentProfile_data(applicationId);
  if (!studentData) return;
  formatStudentObject(studentData);
  const existingUser = cache?.addUser(studentData);
  let password = '';
  if (existingUser) {
    return existingUser;
  }
  if(studentData.bursaryType === bursaryTypes.BBDBURSAR) {
    password = generatePassword(16);
    Object.assign(studentData, { password: password });
    await createInstantApplicantProfile(applicationId,password);
  }
  await sendInviteEmail(context, studentData);
  studentData.InvitedStatus = invitedUserStatus.Accepted;
  await store_user_data(studentData, userId, userRole);
  await save_user_in_db_data(studentData);
}

const sendInviteEmail = async (context, studentData) => {
  const emailSent = await sendEmail(
    context,
    [{ address: studentData.emailAddress }],
    inviteStudentEmailMessage(studentData,studentData.bursaryType),
    studentData.bursaryType === bursaryTypes.UKUKHULA ? inviteStudentSubject:inviteBBDStudentSSubject,
    studentData.bursaryType === bursaryTypes.UKUKHULA ? imagePathsEnum.DEFAULT_HEADER:imagePathsEnum.BBD_HEADER
  );
  return emailSent.status === ResponseStatus.SUCCESS;
};

const formatStudentObject = (student) => {
  if(student) {
    Object.assign(student, 
      {
        University: student.university, 
        Department: student.department, 
        Faculty: student.faculty,
        rank: 'no_rank'
      })
    delete student.university;
    delete student.department;
    delete student.faculty;
  }
}
const createInstantApplicantProfile = async (applicationId,password) => {
    const studentData = await get_studentProfile_data(applicationId);
    if (!studentData) return;
    
    const user = await createUser({
        displayName: `${studentData.givenName} ${studentData.surname}`,
        givenName: studentData.givenName,
        surname: studentData.surname,
        contactNumber: studentData.contactNumber,
        emailAddress: studentData.emailAddress,
        university: studentData.university,
        faculty: studentData.faculty,
        department: studentData.department,
        role: "student",
        password: password
    });
    return user
}
module.exports = { 
  handleStudentProfileCreation,
};
