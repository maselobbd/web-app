const { student_events_data,
  get_location_requests_data,
  student_data,
  get_student_guid_data,
  student_data_by_id,
  application_status_history_data,
  application_invoice_status_history_data,
  application_fund_distribution_history_data,
  application_details_update_history_data,
  application_documents_update_history_data,
  application_renewal_data,
  student_min_max_allocation_data,
  get_averages_data,
  gender_data,
  student_documents_data,
  student_questionnaire_data,
  confirm_student_documents_data,
  upload_recent_academic_transcript_data,
  get_titles_data,
  update_student_details_data,
  upload_student_profile_picture_data,
  get_student_documents_years_data,
  reset_address_request_count_data
} = require("../data-facade/studentData");
const { eventImageDownload } = require("../shared/utils/helper-functions/eventsHelperFunctions");
const { getAdminDocumentsForStudent } = require("../shared/utils/helper-functions/documentInformationHelperFunction");
const { get_student_questionnaire_responses_data } = require("../data-facade/adminData");
const {
  profilePhotoDownload,
  fileDownloadAdminDocuments,
  fileDownloadStudentDocuments
} = require("../shared/utils/helper-functions/documentDownloadHelperFunction");
const { roles } = require("../shared/utils/enums/rolesEnum");
const { get_users_from_db_data } = require("../data-facade/usersData");
const { addApproverApplicationName } = require("../shared/utils/helper-functions/applicationApproverNameHelperFunctions");
const { checkAdminDocumentsValues } = require("../shared/utils/helper-functions/checkCollection");
const { processStudentAverages } = require("../shared/utils/helper-functions/processAveragesFunction");
const { uploadFile } = require("../shared/utils/helper-functions/upload-file");
const { address } = require("../shared/utils/helper-functions/addressHelperFunction");
const ResponseStatus = require("../shared/utils/enums/responseStatusEnum");
const ErrorMessages = require('../shared/utils/enums/internalServalErrorMessageEnum');
const eventMessages = require("../shared/utils/enums/eventMessagesEnum");
const bursaryTypes = require("../shared/utils/enums/bursaryTypesEnum");
const validatorTypeEnum = require("../shared/utils/enums/validatorTypeEnum");
const feedbackMessages = require("../shared/utils/enums/feedbackMessagesEnum");


const getStudentInformation = async (request, context, locals) => {
  try {
    const maxLocationRequest= await get_location_requests_data();
    const student = await student_data(request.query.get("applicationGuid"));
    const canRequest= maxLocationRequest <= process.env.maxLocationRequests
    Object.assign(student,{"canRequest": canRequest})
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: student,
    };
  } catch (error) {
    context.log(error);
    return {
      status: 500,
      jsonBody:
      ErrorMessages.internalServerError,
    };
  }
};

const getStudentInformationById = async (request, context, locals) => {
  try {
    let applicationGuid;
    if(locals.role === 'student')
    {
      let email = request.query.get("email");
      let guidResult = await get_student_guid_data(email);
      applicationGuid = guidResult[0].applicationGuid
    }else{
      applicationGuid = request.query.get("id");
    }
    const year = request.query.get("year");
    const userRole = locals.role;

    let student, applicationStatusHistory, invoiceStatusHistory, fundDistributionHistory,
      detailsUpdatesHistory, documentsUpdatesHistory, adminDocuments,
      studentProfilePhoto, questionnaireResponses, canRenew, minMaxAllocation,
      usersFromDb, downloadedAdminDocuments, averages, downloadedStudentDocuments;

    const initialPromises = [
      student_data_by_id(applicationGuid),
      application_status_history_data(applicationGuid),
      application_invoice_status_history_data(applicationGuid),
      application_fund_distribution_history_data(applicationGuid),
      application_details_update_history_data(applicationGuid),
      application_documents_update_history_data(applicationGuid),
      getAdminDocumentsForStudent(applicationGuid, year, userRole),
      get_student_questionnaire_responses_data(applicationGuid),
      application_renewal_data(applicationGuid),
      student_min_max_allocation_data(locals.role, bursaryTypes.UKUKHULA, validatorTypeEnum.DEFAULT)
    ];

    const initialResults = await Promise.all(initialPromises);
    let minMaxResult;

    [
      student, applicationStatusHistory, invoiceStatusHistory, fundDistributionHistory,
      detailsUpdatesHistory, documentsUpdatesHistory, adminDocuments,
      questionnaireResponses, canRenew, minMaxResult
    ] = initialResults;

    minMaxAllocation = (minMaxResult && minMaxResult.length > 0) ? minMaxResult[0] : { minAmount: 0, maxAmount: 0 };

    if (student) {
      student.canRenew = Boolean(canRenew);
    } else {
      context.log(`Student data not found for GUID: ${applicationGuid}. Some operations might be skipped or fail.`);
    }

    const dependentPromises = [];

    if (student) {
      dependentPromises.push(profilePhotoDownload(student));
    } else {
      dependentPromises.push(Promise.resolve(null));
    }


    if (locals.role === roles.ADMIN) {
      const adminSpecificPromises = [
        fileDownloadAdminDocuments(adminDocuments),
        get_users_from_db_data()
      ];
      const adminResults = await Promise.all(adminSpecificPromises);
      downloadedAdminDocuments = adminResults[0];
      usersFromDb = adminResults[1];

      if (student && usersFromDb) {
        const userMap = new Map(usersFromDb.map(user => [user.id, { nameRole: `${user.givenName} ${user.surname}, ${user.role}`, rank: user.rank, email: user.emailAddress }]));
        Object.assign(student, { "ApplicationHistory": addApproverApplicationName(applicationStatusHistory, userMap) });
        Object.assign(student, { "InvoiceHistory": addApproverApplicationName(invoiceStatusHistory, userMap) });
        Object.assign(student, { "fundDistribution": addApproverApplicationName(fundDistributionHistory, userMap) });
        Object.assign(student, { "AdminDocuments": adminDocuments });
        Object.assign(student, { "QuestionnaireResponses": questionnaireResponses });
        Object.assign(student, { "DownloadedAdminDocuments": downloadedAdminDocuments });
        Object.assign(student, { "detailsUpdates": addApproverApplicationName(detailsUpdatesHistory, userMap) });
        Object.assign(student, { "documentsUpdate": addApproverApplicationName(documentsUpdatesHistory, userMap) });
      }
    }

    if (dependentPromises.length > 0) {
      const dependentResults = await Promise.all(dependentPromises);
      studentProfilePhoto = dependentResults[0];
    }

    if (![roles.ADMIN, roles.HOD, roles.DEAN].includes(locals.role)) {
      if (student) {
        Object.assign(student, { "QuestionnaireResponses": questionnaireResponses });
        Object.assign(student, { "StudentProfilePhoto": studentProfilePhoto });
        Object.assign(student,{"applicationGuid": applicationGuid});
      }
    }

    if (student && checkAdminDocumentsValues(student) && roles.STUDENT !== locals.role) {
      const studentSpecificPromises = [
        get_averages_data(applicationGuid),
        fileDownloadStudentDocuments(student)
      ];
      const studentSpecificResults = await Promise.all(studentSpecificPromises);
      downloadedStudentDocuments = studentSpecificResults[1];
      averages = await processStudentAverages(studentSpecificResults[0]);
      Object.assign(student, { "StudentAverages": averages });
      Object.assign(student, { "DownloadedStudentDocuments": downloadedStudentDocuments });
      Object.assign(student, minMaxAllocation);
    }

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: student,
    };
  } catch (error) {
    context.log("Error in getStudentInformationById:", error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getGenders = async (request, context) => {
  try {
    const genders = await gender_data();
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: genders,
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

const getStudentDocuments = async (request, context, locals) => {
  try {
    const applicationguid = request.query.get("applicationguid");
    const year = request.query.get("year");
    const userRole = request.query.get("userRole") || roles.ADMIN;

    if (![roles.ADMIN, roles.STUDENT].includes(userRole)) {
      return {
        status: ResponseStatus.ERROR,
        jsonBody: "Invalid user role",
      };
    }

    const documents = await student_documents_data(applicationguid, year, userRole);

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        contract: (documents || []).filter((docInfo) =>
          docInfo?.documentType?.toLowerCase().includes("contract")
        ),
        invoice: (documents || []).filter((docInfo) =>
          docInfo?.documentType?.toLowerCase().includes("invoice")
        ),
        payments: (documents || []).filter((docInfo) =>
          docInfo?.documentType?.toLowerCase().includes("payment")
        ),
      },
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getQuestions = async (request, context) => {
  try {
    const questions = await student_questionnaire_data();
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: questions,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const confirmDocument = async (request, context, locals) => {
  try {
    const { applicationId, status } = await request.json();

    const documents = await confirm_student_documents_data(
      applicationId,
      locals.userId,
      status,
    );

    const applicationGuid = documents[0].applicationGuid;

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: documents,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const uploadNewTranscript = async (request, context) => {
  try {
    const { applicationGuid, semesterDescription, base64String } =
      await request.json();

    const uploadedTranscript = await uploadFile(base64String);
    const newTranscriptId = await upload_recent_academic_transcript_data(
      applicationGuid,
      uploadedTranscript,
      semesterDescription
    )

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: newTranscriptId,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getAverages = async (request, context) => {
  try {
    const applicationGuid = await request.query.get("applicationGuid");
    const averages = processStudentAverages(await get_averages_data(applicationGuid));
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: averages,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getTitles = async(request, context) => {
  try{
    const titles = await get_titles_data();

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: titles,
    }
  } catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    }
  }
}

const getStudentApplicationGuid = async(request, context, locals) => {
  try {

    const studentUser =JSON.parse( request.query.get(roles.STUDENT));
    const applicationGuid = await get_student_guid_data(studentUser)
    const student = await getStudentInformationById(applicationGuid[0].studentId)
    Object.assign(student,{"applicationGuid": applicationGuid[0].applicationGuid})
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: student,
    }

  } catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    }
  }
}

const updateStudentDetails = async(request, context, locals) => {
  try {
    const {profileUpdateForm, applicationGuidDetailsForm} = await request.json();

    const update = await update_student_details_data(
      profileUpdateForm,
      applicationGuidDetailsForm
    )
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        message: feedbackMessages.DETAILS_UPDATED
      },
    }
  } catch (error) {
    context.log(error)
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    }
  }
}

const uploadProfilePicture = async (request, context) => {
  try {
    const { studentId,file } =
      await request.json();
    const uploadedPhoto = await uploadFile(file);
    await upload_student_profile_picture_data(studentId,uploadedPhoto )
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: studentId,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getStudentDocumentsYears = async(request, context) => {
  try {
    const studentDocumentsYears = await get_student_documents_years_data();
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: studentDocumentsYears.map(year => year.documentYears)
    }
  } catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    };
  }
}

const getLocation = async(request,context)=>{
  try {
    const streetAddress = request.query.get('streetAddress');
    const countryCode = request.query.get('countrySet');
    const response = await address(streetAddress,countryCode)
    return {
      status:ResponseStatus.SUCCESS,
      jsonBody: response
    }

  } catch (error) {
    context.log(error)
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    };
  }
}
const resetLocation = async(context) =>{
  try{
    const response = await reset_address_request_count_data()
    return {
      status:ResponseStatus.SUCCESS,
      jsonBody: response
    }
  }catch (error){
    context.log(error)
    return{
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    }
  }
}

const getStudentEvents = async(request, context) => {
  try {
    const studentId = request.query.get('studentId');
    const events = await student_events_data(studentId);
    const enhancedEvents = await Promise.all(events.map(async (event) => {
      if (event.eventImage !== eventMessages.NOT_AVAILABLE) {
        event.downloadedEventImage = await eventImageDownload(event);
      }
      return event;
    }));
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: enhancedEvents
    }
  } catch (error) {
    context.log(error)
    return{
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    }
  }
}

module.exports = {
  getGenders,
  getLocation,
  getAverages,
  getQuestions,
  updateStudentDetails,
  uploadNewTranscript,
  uploadProfilePicture,
  resetLocation,
  getStudentDocumentsYears,
  getStudentInformation,
  getStudentApplicationGuid,
  getStudentInformationById,
  getTitles,
  getStudentDocuments,
  confirmDocument,
  getStudentEvents
}
