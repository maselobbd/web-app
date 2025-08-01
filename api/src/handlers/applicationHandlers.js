const {
  degrees_data,
  years_of_funding_data,
  incomplete_applications_data,
  save_application_data,
  delete_application_data,
  races_data,
  save_student_application_form_data,
  update_location_count_data,
  update_application_data,
  check_existing_application_data,
  hod_to_nudge_data,
  hod_student_pending_renewal_data,
  onboard_data
} = require("../data-facade/applicationsData");
const {
  studentAdditionalInformationEmailMessage,
  studentAdditionalInformationEmailMessageSubject,
  bbdStudentAdditionalInformationEmailMessageSubject,
  studentBursaryRenewalMessage,
  bursaryRenewalMessageEmailSubject,
  studentAdditionalInformationSubmissionEmailMessage,
  studentAdditionalInformationSubmissionEmailSubject,
  nudgeHodForRenewal,
  nudgeHodForRenewalSubject
} = require("../shared/utils/helper-functions/email-templates");
const { instantFileSave } = require("../shared/utils/helper-functions/saveFileHelperFunction");
const { update_application_status_history } = require("../data-facade/studentData");
const { sendEmail } = require("../shared/utils/helper-functions/send-email");
const { uploadFile } = require("../shared/utils/helper-functions/upload-file");
const { handleStudentProfileCreation } = require("../shared/utils/helper-functions/createStudentProfileHelperFunction");
const { checkUser, updateUserInfo } = require("../shared/utils/helper-functions/usersHelperFunctions");
const { downloadFile } = require("../shared/utils/helper-functions/download-file");
const { update_last_email_sent_time_data } = require("../data-facade/adminData");
const ResponseStatus = require("../shared/utils/enums/responseStatusEnum");
const ErrorMessages = require("../shared/utils/enums/internalServalErrorMessageEnum");
const bursaryTypes = require("../shared/utils/enums/bursaryTypesEnum");
const StatusEnum = require("../shared/utils/enums/statusEnum");
const actionReason = require("../shared/utils/enums/actionReasonEnum");

const getDegrees = async (request, context) => {
  try {
    const degrees = await degrees_data();

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: degrees,
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

const getAvailableBursaryYears = async (request, context, locals) => {
  try {
    const bursaryYears = await years_of_funding_data(locals.userId);

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: bursaryYears,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
      ErrorMessages.internalServerError,
    };
  }
};

const getIncompleteApplications = async (request, context, locals) => {
  try {
    const userId = await locals.userId;
    const incompleteApplications = await incomplete_applications_data(userId);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: incompleteApplications,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const postApplication = async (request, context, locals) => {
  try {
    const data = await request.json();
    const savedApplications = [];
    const sentEmails = [];
    for (const applicant of data) {
      const savedApplication = await save_application_data(
        applicant,
        locals,
      );
      if (applicant.complete && !applicant.isRenewal) {
        const emailResult = await sendEmail(
          context,
          [{ address: applicant.email }],
          studentAdditionalInformationEmailMessage(
            savedApplication["applicationGuid"],
            applicant.name,
            applicant.bursaryType
          ),
          applicant.bursaryType===bursaryTypes.UKUKHULA? studentAdditionalInformationEmailMessageSubject:bbdStudentAdditionalInformationEmailMessageSubject,
        );
        sentEmails.push({
          applicationId: savedApplication["applicationId"],
          email: applicant.email,
          result: emailResult,
        });

        if(applicant.Invoice|| applicant.Payment || applicant.Contract)
        {
          const documentProperties = [
            { type: 'Invoice', value: applicant.Invoice },
            { type: 'Payment', value: applicant.Payment },
            { type: 'Contract', value: applicant.Contract }
          ].filter(docType => docType.value);

          for (const doc of documentProperties) {
            await instantFileSave(doc, savedApplication["applicationId"]);
          }
        }
      }
      if(applicant.isRenewal)
      {
        await sendEmail(
          context,
          [{ address: applicant.email }],
          studentBursaryRenewalMessage(applicant.name),
          bursaryRenewalMessageEmailSubject,
        );
      }

      savedApplications.push(savedApplication["applicationId"]);
    }
    const applicationsToUpdate = sentEmails.map((student) => {
      if (student.result.status === 200) {
        return update_application_status_history(
          "BBD",
          student.applicationId,
          StatusEnum.Pending

        );
      } else {
        return update_application_status_history(
          "BBD",
          student.applicationId,
          StatusEnum["Email-Failed"]
          ,
        );
      }
    });
    await Promise.all(applicationsToUpdate);
    return {
      status: ResponseStatus.CREATED,
      jsonBody: savedApplications,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      error: ErrorMessages.internalServerError,
    };
  }
};
const deleteApplication = async (request, context, locals) => {
  try {
    const id = request.query.get("id");
    const deletedApplication = await delete_application_data(id);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: deletedApplication["rowsAffected"],
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
      ErrorMessages.internalServerError,
    };
  }
};

const getRaces = async (request, context) => {
  try {
    const races = await races_data();
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: races,
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

const uploadFiles = async (request, context) => {
  try {
    const { additionalInfoApplicationForm, questionnaireFormToPost } =
      await request.json();

    const questionnaireResponses = [];

    Object.keys(questionnaireFormToPost).forEach((response) =>
      questionnaireFormToPost[response]["response"]
        ? questionnaireResponses.push(questionnaireFormToPost[response])
        : null,
    );

    const filesUploaded = {};

    if (additionalInfoApplicationForm["documentation"]) {
      for (const typeOfFile of Object.keys(
        additionalInfoApplicationForm["documentation"],
      )) {
        const fileBase64String =
          additionalInfoApplicationForm["documentation"][typeOfFile][
            "filebytes"
            ];
        const fileUploaded = await uploadFile(fileBase64String);
        filesUploaded[typeOfFile] = fileUploaded;
      }
    }

    const studentApplicationResult = await save_student_application_form_data(
      additionalInfoApplicationForm,
      filesUploaded,
      JSON.stringify(questionnaireResponses),
    );

    if(additionalInfoApplicationForm["personalInformation"]["bursaryType"] === bursaryTypes.BBDBURSAR)
    {
      await handleStudentProfileCreation(context, additionalInfoApplicationForm["personalInformation"]["applicationId"], bursaryTypes.BBDBURSAR, null,'Student');
    }else{
      const emailRes = await sendEmail(
        context,
        [{ address: additionalInfoApplicationForm["personalInformation"]["email"] }],
        studentAdditionalInformationSubmissionEmailMessage(
          additionalInfoApplicationForm["personalInformation"]["firstName"],
        ),
        studentAdditionalInformationSubmissionEmailSubject,
      );
    }

    await update_location_count_data(additionalInfoApplicationForm["address"]["addressCalls"])

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        message: "Application Updated",
        exitNumber: studentApplicationResult,
      },
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

const updateApplication = async (request, context, locals) => {
  try {
    const {
      applicationGuid,
      form,
    } = await request.json();

    const savedApplication = await update_application_data(
      applicationGuid,
      form,
      locals.userId,
    );
    if (savedApplication[0]) {
      const { initialEmail, name, surname } = savedApplication[0];
      const userId = await checkUser(initialEmail);

      if (userId) {
        const updateUser = await updateUserInfo(userId, {
          givenName: name,
          surname: surname,
          emailAddress: initialEmail,
          contactNumber: contactNumber
        });
      }
    }
    return {
      status: ResponseStatus.CREATED,
      jsonBody: savedApplication,
    };
  } catch (error) {
    context.log(error);
    if (error.causedBy && error.causedBy.number === 50001) {
      return {
        status: 400,
        jsonBody:
          'The selected university, faculty, and department combination does not exist. Please check your selections.'
      };
    }
    return {
      status: ResponseStatus.ERROR,
      error: ErrorMessages.internalServerError,
    };
  }
};
const checkExistingApplication = async (request, context, locals) => {
  const data = await request.json();
  const response = [{}];
  try {
    for (const applicant of data) {
      const existingApplicationStatus = await check_existing_application_data(
        applicant.email,
        applicant.name,
        applicant.surname,
      );
      applicant.status = existingApplicationStatus[0]?.status || "NA";
      response.push(applicant);
    }
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: response,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
      ErrorMessages.internalServerError,
    };
  }
};

const downloadFiles = async (request, context) => {
  try {
    blobFileName = request.query.get("blobFileName");

    const fileDetails = await downloadFile(blobFileName);

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        ...fileDetails,
      },
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

const nudgeHOD = async (request, context) => {
  try {
    const data = await hod_to_nudge_data();
    const HodData = [];
    const seenEmails = new Set();

    data.forEach(entry => {
      if (!seenEmails.has(entry.HODEmail)) {
        HodData.push(entry);
        seenEmails.add(entry.HODEmail);
      }
    });

    for (const hod of HodData) {
      const firstName = hod["HODName"];
      const email = hod["HODEmail"];
      const applicationGuid=hod["applicationGuid"];

      await sendEmail(
        context,
        [{ address: email }],
        nudgeHodForRenewal(
          firstName
        ),
        nudgeHodForRenewalSubject,
      );
      await update_last_email_sent_time_data(applicationGuid,actionReason.RENEWAL,email,"BBD");
    }
    return {
      status: ResponseStatus.SUCCESS,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getHODApplicationsPendingRenewal = async (request,context,locals)=>
{
  try {
    const data = await hod_student_pending_renewal_data(locals.userId)
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: data
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

const getSafe = (fn, defaultValue = "") => {
  try {
    const value = fn();
    return (value === undefined || value === null) ? defaultValue : value;
  } catch (e) {
    return defaultValue;
  }
};

async function extractSimplifiedData(originalData) {
  if (!originalData) {
    console.error("Original data is null or undefined. Cannot extract.");
    return null;
  }

  const countryCode = getSafe(() => originalData.contactNumber.countryCode, '');
  let localPhoneNumber = getSafe(() => originalData.contactNumber.phoneNumber, '');

  if (countryCode === '+27' && localPhoneNumber && localPhoneNumber.startsWith('0')) {
    localPhoneNumber = localPhoneNumber.substring(1);
  }
  const correctlyFormattedPhoneNumber = `${countryCode}${localPhoneNumber}`;

  return {
    email: getSafe(() => originalData.personalInformation.email.value),
    firstName: getSafe(() => originalData.personalInformation.firstName),
    lastName: getSafe(() => originalData.personalInformation.lastName),
    idNumber: getSafe(() => originalData.personalInformation.idNumber),
    gender: getSafe(() => originalData.personalInformation.gender),
    race: getSafe(() => originalData.personalInformation.race),
    title: getSafe(() => originalData.personalInformation.title),

    phoneNumber: correctlyFormattedPhoneNumber,

    addressLine: getSafe(() => originalData.address.addressLine1),
    complexFlat: getSafe(() => originalData.address.complexFlat),
    suburbDistrict: getSafe(() => originalData.address.suburbDistrict),
    cityTown: getSafe(() => originalData.address.cityTown),
    postalCode: getSafe(() => originalData.address.postalCode),

    degree: getSafe(() => originalData.universityInformation.degree === "Other" ? originalData.universityInformation.other : originalData.universityInformation.degree),
    gradeAverage: getSafe(() => originalData.universityInformation.gradeAverage),
    yearOfStudy: getSafe(() => originalData.universityInformation.yearOfStudy),
    universityFaculty: getSafe(() => originalData.bursaryInformation.faculty),
    bursaryType: getSafe(() => originalData.bursaryInformation.bursaryType),
    bursaryAmount: getSafe(() => originalData.bursaryInformation.amount, 0),
    bursarEmail: getSafe(() => originalData.bursaryInformation.email),
    bursarUniversity: getSafe(() => originalData.bursaryInformation.university),
    bursarDepartment: getSafe(() => originalData.bursaryInformation.department),
    bursaryTier: getSafe(() => originalData.bursaryInformation.bursaryTier),

    proofOfIdFile: originalData.documentation && originalData.documentation.proofOfIdentification ? await uploadFile(originalData.documentation.proofOfIdentification.filebytes) : '',
    contractFile: originalData.bursaryInformation && originalData.bursaryInformation.contract ? await uploadFile(originalData.bursaryInformation.contract.filebytes) : '',
    invoiceFile: originalData.bursaryInformation && originalData.bursaryInformation.invoice ? await uploadFile(originalData.bursaryInformation.invoice.filebytes) : '',
    paymentFile: originalData.bursaryInformation && originalData.bursaryInformation.payment ? await uploadFile(originalData.bursaryInformation.payment.filebytes) : '',
  };
}
const onboard = async (request, context, locals) => {
  try {
    const data = await request.json();
    const obj=await extractSimplifiedData(data);
    const response = await onboard_data(obj,locals.userId);
    if (response[0].applicationId) {
      await handleStudentProfileCreation(context, response[0].applicationId,locals.userId, null,'Student');
    }
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: response,
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

module.exports = {
  getDegrees,
  getRaces,
  getAvailableBursaryYears,
  getHODApplicationsPendingRenewal,
  getIncompleteApplications,
  postApplication,
  handleStudentProfileCreation,
  onboard,
  nudgeHOD,
  deleteApplication,
  downloadFiles,
  checkExistingApplication,
  updateApplication,
  uploadFiles
}
