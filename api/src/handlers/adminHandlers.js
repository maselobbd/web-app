const {
  get_applications_report,
  admin_reject_student_application,
  admin_update_application_status_history,
  year_of_application_data,
  adminDashboardData,
  save_student_payment_data,
  distinct_year_of_study_data,
  distinct_bursary_types_data,
  get_expenses_data,
  post_expense_data,
  application_documents_data,
  get_expenses_values_data,
  update_invoice_status_data,
  get_expenses_for_application_data,
  get_student_to_nudge_data,
  update_last_email_sent_time_data,
  declined_applications_data,
  average_for_cron_data,
  get_cron_config_data,
  update_calculated_averages_data,
  store_user_data,
  all_universities_data,
  add_university_data,
  all_faculties_data,
  add_department_data,
  get_departments_and_university_data,
  update_application_bursary_amount_data,
  post_existing_application_data,
  admin_Email_Failed_student_application_data,
  set_configuration_data,
  update_department_name_data,
  update_department_status_data,
  non_responsive_student_application_data,
  update_grade_average_data,
  update_student_document_data,
  get_pending_applications_data,
  get_configuration_data,
  active_applications_data,
  all_allocations_data,
  stats_applications_for_university_data,
  bursaries_summary_data,
  declined_reasons_data
} = require("../data-facade/adminData");
const ResponseStatus = require("../shared/utils/enums/responseStatusEnum");
const { process_applications_report_data } = require("../shared/utils/helper-functions/adminHelperFunctions");
const ErrorMessages = require("../shared/utils/enums/internalServalErrorMessageEnum");
const { getCacheInstance } = require("../shared/utils/cache");
const { sendEmail } = require("../shared/utils/helper-functions/send-email");
const {
  studentRejectionEmailMessage,
  studentRejectionEmailMessageSubject,
  studentAcceptanceToBursaryMessage,
  bursaryAcceptanceMessageEmailSubject,
  creditorInvoiceProcessingMessage,
  emailCreditorsSubject,
  studentAcademicRecordEmailMessage,
  studentAcademicTranscript,
  inviteToHODEmailMessage,
  inviteToDeanEmailMessage,
  hodInvitationEmailMessageSubject,
  inviteDeanSubject,
  studentAdditionalInformationEmailMessage,
  studentAdditionalInformationEmailMessageSubject,
  inviteAdminEmailMessage,
  inviteAdminSubject,
  bbdStudentAdditionalInformationEmailMessageSubject,
  bursaryTerminationEmailMessage
} = require("../shared/utils/helper-functions/email-templates");
const { sendEmailsToHods } = require("../shared/utils/helper-functions/email-to-hod");
const { student_data_by_id, update_application_status_history } = require("../data-facade/studentData");
const getPrimaryDocuments = require("../shared/utils/helper-functions/studentDocumentsHelper.function");
const { documentStatusEnum } = require("../shared/utils/enums/documentStatusEnum");
const { sendEmailToExecutive } = require("../shared/utils/helper-functions/emailToExecutives");
const { emailTypeEnum } = require("../shared/utils/enums/emailTypeEnum");
const { get_users_from_db_data } = require("../data-facade/usersData");
const { groupByStatus, processApplication, processApplications } = require("../shared/utils/helper-functions/statusSortHelperFunction");
const { addApproverNames } = require("../shared/utils/helper-functions/applicationApproverNameHelperFunctions");
const { uploadFile } = require("../shared/utils/helper-functions/upload-file");
const {
  getDistinctYears,
  getDistinctBursaryTypes,
  sumAmounts,
  totalNumberOfActiveStudents,
  filterActiveStudentsByRace,
  filterAllocationsByYear,
  filterActiveStudentsByYear,
  filterActiveStudentsByRaceAndYear,
  allAllocationByUniversity,
  allAmountUsedByUniversity,
  amountsByUniversityByYear,
  allStudentsByUniversity,
  allStudentsByUniversityByYear,
  allStudentsByRaceByUniversity,
  filterStudentsByUniversityByRaceByYear,
  getDistinctRaces,
  computePredictedSpending,
  createRange
} = require("../shared/utils/helper-functions/reportsHelperFunctions");
const { saveFile } = require("../shared/utils/helper-functions/saveFileHelperFunction");
const {
  areAllPaymentsApproved,
  isSingleContract,
  handleContract
} = require("../shared/utils/helper-functions/uploadHelperFunctions");
const { handleStudentProfileCreation } = require("../shared/utils/helper-functions/createStudentProfileHelperFunction");
const { extractNameFromEmail } = require("../shared/utils/helper-functions/extractNameFromEmailHelperFunctions");
const { imagePathsEnum } = require("../shared/utils/enums/imagePathsEnum");
const {
  mapStudentsPerBursaryType,
  mapEmailList,
  filterBySemester,
  getStudentsToNudgeTvp
} = require("../shared/utils/helper-functions/nudgeHelperFunctions");
const bursaryTypes = require("../shared/utils/enums/bursaryTypesEnum");
const actionReason = require("../shared/utils/enums/actionReasonEnum");
const { bursariesApplicationsData } = require("../shared/utils/helper-functions/bursaryApplicationsDataHelperFunctions");
const { downloadFile } = require("../shared/utils/helper-functions/download-file");
const { averageCalculation } = require("../shared/utils/helper-functions/calculate-averageHelperFunction");
const { roles } = require("../shared/utils/enums/rolesEnum");
const { convertToSqlDatetime } = require("../shared/utils/helper-functions/convertDateHelperFunction");
const { getGradeAverage } = require("../shared/utils/helper-functions/gradeAverageCalculatorHelperFunction");
const { formatAmountToFloat } = require("../shared/utils/helper-functions/formatToFloatHelperFunction");
const StatusEnum = require("../shared/utils/enums/statusEnum");
const nudgeStagnantApplicationConfig = require("../shared/utils/enums/nudgeDaysConfigEnum");
const { configTypes } = require("../shared/utils/enums/configurationTypesEnum");
const { getRedirectUrl } = require("../shared/utils/helper-functions/getRedirectUrlHelperFunction");
const actionType = require("../shared/utils/enums/documentActionTypeEnum");
const {
  validateApprover,
  getApproverDetailsFromDb,
  extractStudentGuid,
  extractMessageText,
  processApplicationApproval
} = require("../shared/utils/helper-functions/mailProcessorHelperFunctions");
const { responseMessages } = require("../shared/utils/enums/responseMessageEnum");
const { handleWarmupRequest } = require("../shared/utils/helper-functions/warmupHelper");
const functionNames = require("../shared/utils/enums/functionNamesEnum");
const { fetchAllUsers } = require("../shared/utils/helper-functions/usersHelperFunctions");
const { ranks } = require("../shared/utils/enums/ranksEnum");
const {
  total_allocated_amount_for_university_data,
  total_requested_amount_for_university_data,
  total_approved_amount_for_university_data
} = require("../data-facade/allocationsData");
const {
  getAggregatedSummaryWithSummaryData,
  getTotal
} = require("../shared/utils/helper-functions/bursariesSummaryHelperFunction");


const applicationsReport = async (request, context, locals) => {
  try {
    const yearParam = request.query.get("year");
    const year = yearParam.toLowerCase() === 'all' ? 0 : yearParam;
    const applicationsReport = await get_applications_report(year);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: process_applications_report_data(applicationsReport),
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const adminRejectStudentApplication = async (request, context, locals) => {
  const cache = getCacheInstance();
  try {
    const { applicationGuid, status, reason, motivation } =
      await request.json();
    const student = await admin_reject_student_application(
      status,
      applicationGuid,
      locals.userId,
      reason,
      motivation ?? "",
    );

    if (student) {
      let emailMessage = "";
      if (status === StatusEnum.Declined) {
        emailMessage = studentRejectionEmailMessage(student["name"]);
      } else if (status === StatusEnum.Terminated) {
        emailMessage = bursaryTerminationEmailMessage(student["name"]);
      }

      if (emailMessage) {
        await sendEmail(
          context,
          [{ address: student["email"] }],
          emailMessage,
          studentRejectionEmailMessageSubject
        );
        await sendEmailsToHods(applicationGuid,cache,context)
      }
    }
    return {
      status: ResponseStatus.CREATED,
      jsonBody: student,
    };
  } catch (error) {
    context.log(error)
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const adminUpdateApplicationStatusHistory = async (
  request,
  context,
  locals,
) => {
  const cache = getCacheInstance();
  try {
    const { applicationGuid, status, isRenewal } = await request.json();
    const applicationStatusHistory = await admin_update_application_status_history(
      status,
      applicationGuid,
      locals.userId,
      isRenewal
    );

    const student = await student_data_by_id(applicationGuid);
    if (!student) {
      context.log(`Student data not found for applicationGuid: ${applicationGuid}`);
      return {
        status: ResponseStatus.NOT_FOUND,
        jsonBody: ErrorMessages.studentNotFound,
      };
    }

    const documents = getPrimaryDocuments(student)

    const emailToApproveApplication =
      status === documentStatusEnum.AWAITING_EXEC_APPROVAL
        ? process.env.NEW_APPLICATIONS_APPROVER.split(",")
        : process.env.FINANCE_APROVER.split(",");

    context.log(`Sending approval emails to: ${emailToApproveApplication.join(", ")}`);

    await sendEmailToExecutive(
      context,
      emailToApproveApplication,
      emailTypeEnum.STUDENT_APPLICATION_REQUIRES_APPROVAL,
      documents,
      applicationGuid
    );

    if(status === documentStatusEnum.APPROVED){
      sendEmailsToHods(applicationGuid, cache, context)
    }

    if(status === documentStatusEnum.APPROVED)
    {
      const studentFullname = `${student.name} ${student.surname}`;
      await sendEmail(
        context,
        [{ address: student.email }],
        studentAcceptanceToBursaryMessage(studentFullname),
        bursaryAcceptanceMessageEmailSubject,
      );
    }

    return {
      status: ResponseStatus.CREATED,
      jsonBody: applicationStatusHistory,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getApplicationsDetails = async (request, context, locals) => {
  try {
    const bursarsDetails = await bursar_applications_details_data();

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: bursarsDetails,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getYearOfApplications = async () => {
  try {
    const years = await year_of_application_data();
    const yearsList = years.map((item) => item.yearOfFunding);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: yearsList,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getAdminDashBoardData = async (request, context, locals) => {
  try {
    const university = request.query.get("university");
    const year = request.query.get("year");
    const name = request.query.get("fullName");
    const data = await adminDashboardData(university, year, name);

    const usersFromDb = await get_users_from_db_data();

    const userMap = new Map(
      usersFromDb.map((user) => [user.id, `${user.givenName} ${user.surname}`]),
    );

    const sortedUniversityApplications = data.map((item) => {
      const details = groupByStatus(item.details);
      addApproverNames(details, userMap);

      return {
        details
      };
    });

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: sortedUniversityApplications[0],
    };
  } catch (error) {
    context.log("Error", error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const uploadPayment = async (request, context, locals) => {
  try {
    const upload = await request.json();
    const applicationId = upload["applicationId"];
    const paymentFor = upload["paymentFor"];
    const file = upload["file"];
    const fileUploaded = await uploadFile(file);
    const studentInvoiceResult = await save_student_payment_data(
      applicationId,
      fileUploaded,
      locals.userId,
      paymentFor,
    );
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: studentInvoiceResult[0]["NewInvoiceId"],
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getYearsOfFunding = async (request, context, locals) => {
  try {
    const yearsOfFunding = await distinct_year_of_study_data();

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: yearsOfFunding
        ? getDistinctYears(yearsOfFunding)
        : [],
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getBursaryTypes = async (request, context, locals) => {
  try {
    const bursaryTypes = await distinct_bursary_types_data();

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: bursaryTypes
        ? getDistinctBursaryTypes(bursaryTypes)
        : [],
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
}

const getExpenses = async () => {
  try {
    const expensesResponse = await get_expenses_data();
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: expensesResponse,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const postExpense = async (request, context, locals) => {
  try {
    const data = await request.json()
    const {status, applicationGuid, isRenewal} = data;
    const result = await post_expense_data(data, locals.userId);

    await admin_update_application_status_history(status, applicationGuid, locals.userId, isRenewal)

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: result,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getApplicationDocuments = async (request, context, locals) => {
  try {
    const applicationGuid = request.query.get("applicationGuid");
    const documentType = request.query.get("documentType");
    const status = request.query.get("status");

    const documents = await application_documents_data(
      applicationGuid,
      documentType,
      status,
    );

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: documents,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const uploadAdminDocuments = async (request, context, locals) => {
  const cache = getCacheInstance();
  try {
    const data = await request.json();
    const userId = locals.userId;
    const userRole = locals.role
    let canCreateNewProfile = false;
    let applicationId;
    let applicationGuid;
    let results = [];

    if (!Array.isArray(data.documents)) {
      return {
        status: ResponseStatus.ERROR,
        jsonBody: ErrorMessages.badRequest,
      };
    }

    for (const item of data.documents) {
      results.push(saveFile(item, userId));
      applicationId = item.applicationId;
      applicationGuid = item.applicationGuid
    }

    if (areAllPaymentsApproved(data.documents)) {
      canCreateNewProfile = true;
    } else if (isSingleContract(data.documents)) {
      await handleContract(data.documents[0], userId, cache, context);
    }

    if (canCreateNewProfile && applicationId) {
      await handleStudentProfileCreation(context, applicationId, userId, cache,userRole);
    }
    if (data.documents && data.documents.length > 0 && data.documents[0]?.documentStatus === documentStatusEnum.IN_REVIEW) {
      const documents = data.documents.map(doc => doc.file);
      await sendEmail(
        context,
        [{ address: process.env.CREDITORS }],
        creditorInvoiceProcessingMessage(extractNameFromEmail(process.env.CREDITORS)),
        emailCreditorsSubject,
        imagePathsEnum.BBD_CREDITORS_HEADER,
        documents
      );
    }
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: "files uploaded",
    };
  } catch (error) {
    context.log("Upload error:", error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getExpensesValues = async (request, context, locals) => {
  const applicationGuid = request.query.get("applicationGuid");
  try {
    const expenses = await get_expenses_values_data(applicationGuid);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: expenses,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const updateInvoiceStatus = async (request, context, locals) => {
  const { applicationId, expenseCategory } = await request.json();
  try {
    const result = await update_invoice_status_data(
      applicationId,
      1,
      expenseCategory,
    );
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: result,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getStudentExpense = async (request, context, locals) => {
  const applicationId = request.query.get("applicationId");
  try {
    const expenses = await get_expenses_for_application_data(applicationId);

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: expenses.length > 0,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};



const studentsNudge = async(context, isTimer=true, userId) => {

  const currentMonth = (new Date()).getMonth();
  const students = await get_student_to_nudge_data();
  const bbdBursars = mapStudentsPerBursaryType(bursaryTypes.BBDBURSAR, students);
  const ukukhulaBursars = mapStudentsPerBursaryType(bursaryTypes.UKUKHULA, students);

  if(students.length === 0) return;

  let bbdMappedEmails;
  let ukukhulaMappedEmails;
  let nudgeTableList;
  let bbdBulkEmailResponse;
  let ukukulaBulkEmailResponse

  switch(currentMonth) {
    case 0:
      bbdMappedEmails = mapEmailList(filterBySemester(bbdBursars).firstSemester);
      ukukhulaMappedEmails = mapEmailList(filterBySemester(ukukhulaBursars).firstSemester);
      nudgeTableList = filterBySemester(students).firstSemester;
    case 6:
      bbdMappedEmails = mapEmailList(filterBySemester(bbdBursars).secondSemester);
      ukukhulaMappedEmails = mapEmailList(filterBySemester(ukukhulaBursars).secondSemester);
      nudgeTableList = filterBySemester(students).secondSemester;
  }

  if(nudgeTableList.length === 0) return;

  if(bbdMappedEmails.length > 0) bbdBulkEmailResponse = await sendEmail(
    context,
    bbdMappedEmails,
    studentAcademicRecordEmailMessage(bursaryTypes.BBDBURSAR),
    studentAcademicTranscript
  );
  if (ukukhulaMappedEmails.length > 0) ukukulaBulkEmailResponse = await sendEmail(
    context,
    ukukhulaMappedEmails,
    studentAcademicRecordEmailMessage(bursaryTypes.UKUKHULA),
    studentAcademicTranscript
  );

  const studentsToNudgeTvp = getStudentsToNudgeTvp(nudgeTableList.map(student => ({
    applicationId: student.applicationId,
    nudgedEmail: student.email
  })));
  const nudgeHistoryUpdateResult = await update_last_email_sent_time_data(actionReason.UPLOAD_TRANSCRIPTS, isTimer ? "BBD" : userId, studentsToNudgeTvp);

  return  { bbdBulkEmailResponse, ukukulaBulkEmailResponse, nudgeHistoryUpdateResult };
};

const autoNudgeStudents = async (context) => {
  try {
    const nudgeResults = await studentsNudge(context);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: nudgeResults,
    }
  } catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError
    }
  }
}

const nudgeStudents = async (request, context, locals) => {
  try {
    const { isTimer } = await request.json();
    const nudgeStudentsResult = await studentsNudge(context, isTimer, locals.userId);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: nudgeStudentsResult
    }
  } catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: error.message
    }
  }
}

const getStudentsToNudge = async (request, context, locals) => {
  try {
    const students = await get_student_to_nudge_data();
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: students,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getDeclinedApplications = async (request, context, locals) => {
  try {
    const students = await declined_applications_data();
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: bursariesApplicationsData(students),
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const calculateAverages = async (context) => {
  try {
    const cronData = await average_for_cron_data();
    const cronConfig = await get_cron_config_data("Cron Job");
    let finalMarks;

    if (!cronConfig) return;
    if (cronData && cronData.length > 0) {
      finalMarks = {};
      for (const academicTranscriptHistory of cronData) {
        if (academicTranscriptHistory["docBlobName"].length > 256) continue;
        if (academicTranscriptHistory["averageToolConfidence"]) {
          const documentBase64String = await downloadFile(
            academicTranscriptHistory["docBlobName"],
          );

          const finalMark = await averageCalculation(
            documentBase64String["base64"],
          );

          finalMark["final_mark"]
            ? await update_calculated_averages_data(
              academicTranscriptHistory["academicTranscriptsHistoryId"],
              finalMark["final_mark"],
            )
            : null;
          finalMarks["application"] = {
            applicationGuid: academicTranscriptHistory["applicationGuid"],
            finalMark: finalMark["final_mark"] || "No final mark",
          };
        } else if (!academicTranscriptHistory["averageToolConfidence"]) {
          await update_calculated_averages_data(
            academicTranscriptHistory["academicTranscriptsHistoryId"],
            -1,
          );
        }
      }
    }
    return finalMarks;
  } catch (error) {
    context.log(error);
    return error;
  }
};

const inviteHOD = async (request, context, locals) => {
  const cache = getCacheInstance();
  try {
    const { data } = await request.json();
    const isHod = data.userRole === roles.HOD.toUpperCase();
    const isRejected = data.InvitedStatus === "Rejected";
    let emailResult;
    if (locals.role === roles.ADMIN && !isRejected) {
      emailResult = await sendEmail(
        context,
        [{ address: data.emailAddress }],
        isHod ? inviteToHODEmailMessage() : inviteToDeanEmailMessage(),
        isHod ? hodInvitationEmailMessageSubject : inviteDeanSubject,
        isHod
          ? imagePathsEnum.HOD_INVITE_HEADER
          : imagePathsEnum.DEAN_INVITE_HEADER,
      );
    }
    const storeUser = await store_user_data(data, locals.userId, locals.role);
    if (storeUser) {
      cache.clear();
    }
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: storeUser,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getAllUniversities = async (request, context, locals) => {
  try {
    const universities = await all_universities_data();
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: universities,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const addUniversity = async (request, context, locals) => {
  try {
    const { university, faculty } = await request.json();

    const result = await add_university_data(university, faculty);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: result,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getFaculties = async (request, context, locals) => {
  try {
    const faculties = await all_faculties_data();
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: faculties,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const addDepartment = async (request, context, locals) => {
  try {
    const { university, department, faculty, newFaculty } = await request.json();
    const result = await add_department_data(
      university,
      department,
      faculty,
      locals.userId,
      faculty !== "Add faculty" ? null : newFaculty
    );
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: result,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getDepartmentsAndUniversity = async (request, context, locals) => {
  const role = locals.role;
  let university = null;
  let faculty = null;
  if (role === roles.DEAN) {
    university = locals.university;
    faculty = locals.faculty;
  }
  try {
    const result = await get_departments_and_university_data(
      faculty,
      university,
    );
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: result,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const updateApplicationAmount = async (request, context, locals) => {
  try {
    const applicationGuid = request.query.get("applicationGuid");
    const newAmount = parseFloat(request.query.get("newAmount"));
    const userId = locals.userId;

    if (newAmount >= 1000) {
      await update_application_bursary_amount_data(
        applicationGuid,
        newAmount,
        userId,
      );

      return {
        status: ResponseStatus.SUCCESS,
        jsonBody: newAmount,
      };
    } else {
      return {
        status: ResponseStatus.ERROR,
        jsonBody: ErrorMessages.minimumAmountError,
      };
    }
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const postExistingApplication = async (request, context, locals) => {
  try {
    const data = await request.json();

    const racesDict = {
      A: "Black",
      W: "White",
      I: "Indian",
      C: "Coloured",
    };

    const genderDict = {
      M: "Male",
      F: "Female",
      O: "Other",
    };

    const universityDict = {
      WITS: "University of the Witwatersrand",
      NMU: "Nelson Mandela University",
      UFS: "University of the Free State",
      UJ: "University of Johannesburg",
      UP: "University of Pretoria",
      CT: "University of Cape Town",
      CPU: "Cape Peninsula University of Technology",
      RUR: "Rhodes University",
    };

    const departmentDict = {
      "bsc it": "Computer Science",
      "bsc computer science": "Computer Science",
      "ba digital arts": "Digital arts",
      "master's in digital arts": "Digital arts",
      "master's in film and television": "Film and television",
      "beng digital arts": "Digital arts",
      "bsc computing science": "Computer Science",
      "bcom computer science & info systems": "Computer Science",
    };

    const studentsData = data.map((entry) => {
      const {
        address: { City: cityName = "N/A" },
        details: {
          "First Name": name,
          "Last Name": surname,
          Degree: degreeName,
          "Contract Start Date": startDate,
          "Email Address": email,
          University: university,
          "Identity Number": idNumber,
          "Mobile Phone Number": mobileNumber,
          "Ukukhula PIF / Mobile Number": otherNumber,
          Race: races,
          "Current year of study": yearOfStudy,
          Gender: gender,
          "At which level is the degree?": degreeLevel,
          "Overall academic average?": gradeAverage,
        },
        expenses: {
          "Tuition Fee": tuitionFee,
          Accommodation,
          Meals,
          Other,
          OtherDescription,
          "Bursary Value": amount,
        },
      } = entry;

      return {
        name,
        surname,
        degreeName,
        yearOfStudy,
        degreeLevel,
        university: universityDict[university.toUpperCase()] || university,
        city: cityName || "N/A",
        email,
        idNumber,
        contactNumber: mobileNumber || otherNumber || "N/A",
        race: racesDict[races],
        startDate: convertToSqlDatetime(startDate),
        gender: genderDict[gender],
        department: departmentDict[degreeName.toLowerCase()],
        grade: getGradeAverage(gradeAverage),
        expenses: {
          bursaryAmount: formatAmountToFloat(amount),
          accommodation: formatAmountToFloat(Accommodation),
          tuitionFee: formatAmountToFloat(tuitionFee),
          meals: formatAmountToFloat(Meals),
          other: Other || 0,
          otherDescription: OtherDescription,
        },
      };
    });

    let result = [];

    for (let student of studentsData) {
      result.push(await post_existing_application_data(student));
    }

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        result: result.length,
      },
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const emailFailedStudentApplication = async (request, context, locals) => {
  try {
    const { applicationGuid } = await request.json();
    const student =
      await admin_Email_Failed_student_application_data(applicationGuid);

    const sentEmails = await sendEmail(
      context,
      [{ address: student["email"] }],
      studentAdditionalInformationEmailMessage(
        student["applicationGuid"],
        student["name"],
      ),
      studentAdditionalInformationEmailMessageSubject,
    );

    if (sentEmails.status === ResponseStatus.SUCCESS) {
      await update_application_status_history(
        locals.userId,
        student.applicationId,
        StatusEnum.Pending,
      );
    } else {
      await update_application_status_history(
        "BBD",
        student.applicationId,
        StatusEnum["Email-Failed"],
      );
    }

    return {
      status: ResponseStatus.CREATED,
      jsonBody: student,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const setCronConfig = async (request, context, locals) => {
  try {
    const { configuration } = await request.json();
    const set_config_data =
      typeof configuration === "boolean"
        ? await set_configuration_data(configuration)
        : ErrorMessages.configurationNotBooleanError;

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: set_config_data,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const updateUniversityDepartment = async (request, context, locals) => {
  try {
    const { universityToUpdate, oldDepartmentName, newDepartmentName } =
      await request.json();
    const response = await update_department_name_data(
      universityToUpdate,
      oldDepartmentName,
      newDepartmentName,
      locals.userId,
    );

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: { updateId: response },
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};
const updateUniversityDepartmentStatus = async (request, context, locals) => {
  try {
    const { universityName, departmentName, facultyName, status } =
      await request.json();
    const response = await update_department_status_data(
      universityName,
      departmentName,
      facultyName,
      status,
      locals.userId,
    );

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: { updateId: response },
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const createAdmin = async (request, context, locals) => {
  try {
    const userDetails = await request.json();
    const userId = locals.userId;
    let response;
    if (!userDetails.faculty || !userDetails.university) {
      userDetails.faculty = "Admin";
      userDetails.universityName = "BBD";
    }
    if (userDetails) {
      const userName = extractNameFromEmail(userDetails.emailAddress);
      response = await sendEmail(
        context,
        [{ address: userDetails.emailAddress }],
        inviteAdminEmailMessage(userName),
        inviteAdminSubject,
      );
      if (response) {
        await store_user_data(userDetails, userId, locals.role);
      }
    }
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: response,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const nonResponsiveStudent = async (request, context, locals) => {
  try {
    const students = await non_responsive_student_application_data();
    for (const student of students) {
      const { daysDifference, email, applicationGuid, name, applicationId } =
        student;

      if (
        daysDifference > nudgeStagnantApplicationConfig.minDays &&
        daysDifference < nudgeStagnantApplicationConfig.maxDays
      ) {
        await sendEmail(
          context,
          [{ address: email }],
          studentAdditionalInformationEmailMessage(applicationGuid, name, student.bursaryType),
          student.bursaryType===bursaryTypes.UKUKHULA? studentAdditionalInformationEmailMessageSubject:bbdStudentAdditionalInformationEmailMessageSubject,
        );

        if (daysDifference > nudgeStagnantApplicationConfig.maxDays) {
          await update_application_status_history(
            locals.userId,
            applicationId,
            StatusEnum["Stagnant application"],
          );
        }
      }
    }

    return {
      status: ResponseStatus.CREATED,
      jsonBody: students,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const updateGradeAverage = async (request, context, locals) => {
  try {
    const { semesterGradeAverage, applicationId, semesterDescription } =
      await request.json();
    const result = await update_grade_average_data(
      semesterGradeAverage,
      applicationId,
      semesterDescription,
    );
    return {
      status: ResponseStatus.CREATED,
      jsonBody: result,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
};

const getApplicationSettings = async (request, context, locals) => {
  try {
    const config = request.query.get("config");
    const currentUrl = request.query.get("currentUrl");
    if(config === configTypes.msal) {
      return {
        status: ResponseStatus.SUCCESS,
        jsonBody: {
          tenantName: process.env.tenantName,
          clientId: process.env.clientId,
          redirectUrl: getRedirectUrl(currentUrl),
          policyId: process.env.policyId
        }
      }
    }

    if (config === configTypes.appInsigths) {
      return {
        status: ResponseStatus.SUCCESS,
        jsonBody: {
          appInsights: process.env.appInsightsConnectionString
        }
      }
    }
  } catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    }
  }
}

const updateStudentDocument = async (request, context,locals) => {
  try {
    const data =
      await request.json();
    let newFileBlobName = "";
    let markAsDeleted;

    switch(data.actionToPerfom.toLowerCase())
    {
      case actionType.DELETE:
        markAsDeleted = true;
        newFileBlobName = " ";
        break;
      case actionType.UPDATE:
        markAsDeleted = true;
        newFileBlobName = await uploadFile(data.newFile);
        break;
      case actionType.AMEND:
        markAsDeleted = false;
        newFileBlobName = await uploadFile(data.newFile);
        break;
      default:
        return {
          status: ResponseStatus.ERROR,
          jsonBody: `${ErrorMessages.badRequest} ${error}`,
        };
    }

    Object.assign(data, {"userId": locals.userId}, {"newFile": newFileBlobName},{"markAsDeleted":markAsDeleted});
    const result = await update_student_document_data(data)
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: result,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const autoNudgeExecutives = async (context) => {
  try {
    const pendingApplications = await getPendingApplications();

    if (!pendingApplications.length) {
      context.log("No pending applications to nudge.");
      return;
    }

    for (const application of pendingApplications) {
      const { applicationGuid, status } = application;

      const emailToApproveApplication =
        status === documentStatusEnum.AWAITING_EXEC_APPROVAL
          ? process.env.NEW_APPLICATIONS_APPROVER.split(",")
          : process.env.FINANCE_APROVER.split(",");

      context.log(`Sending nudge emails to: ${emailToApproveApplication.join(", ")}`);

      await sendEmailToExecutive(
        context,
        emailToApproveApplication,
        emailTypeEnum.STUDENT_APPLICATION_REQUIRES_APPROVAL,
        application.documents,
        applicationGuid
      );

      for await (email of emailToApproveApplication){
        await update_last_email_sent_time_data(applicationGuid,actionReason.APPROVAL,email,locals.userId);
      }
    }

    context.log(`Successfully nudged ${pendingApplications.length} applications.`);
  } catch (error) {
    context.log(`Error nudging executives: ${error.message}`);
  }
}

const getPendingApplications = () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return get_pending_applications_data(oneWeekAgo);
};

const maintenanceMode = async (request, context, locals) => {
  try {
    const configType = request.query.get("maintenance");
    const maintenance = await get_configuration_data(configType);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: maintenance.config,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
}

const processMail = async (request,context,locals) => {
  try {
    const response = await request.json();
    const approver = response.from.toLowerCase();
    validateApprover(approver);

    const approverDetails = await getApproverDetailsFromDb(approver);
    if (!approverDetails) {
      throw new Error(responseMessages.ERROR_NOT_APPROVER);
    }

    const applicationGuid = extractStudentGuid(response.body);
    if (!applicationGuid) {
      throw new Error(responseMessages.ERROR_STUDENT_NOT_FOUND);
    }

    const messageText = extractMessageText(response.body);

    const status = await processApplicationApproval(approverDetails, applicationGuid,messageText, context);

    return { status: ResponseStatus.SUCCESS };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: { success: false, message: `${ErrorMessages.internalServerError} ${error.message}` },
    };
  }
}

const resendEmailToExecutive = async (request, context,locals) => {
  try {
    const { applicationGuid } = await request.json();
    if (!applicationGuid) {
      return {
        status: ResponseStatus.ERROR,
        jsonBody: { success: false, message: "Missing applicationGuid" },
      };
    }

    const student = await student_data_by_id(applicationGuid);
    if (!student) {
      return {
        status: ResponseStatus.NOT_FOUND,
        jsonBody: { success: false, message: ErrorMessages.studentNotFound },
      };
    }

    const documents = getPrimaryDocuments(student)

    const emailToApproveApplication = student.status === documentStatusEnum.AWAITING_EXEC_APPROVAL ? process.env.NEW_APPLICATIONS_APPROVER.split(",") :
      process.env.FINANCE_APROVER.split(",");

    if (!emailToApproveApplication || emailToApproveApplication.length === 0) {
      context.log("No approvers found or invalid email addresses.");
      return { status: ResponseStatus.ERROR, jsonBody: { success: false, message: "No approvers found." } };
    }

    await sendEmailToExecutive(
      context,
      emailToApproveApplication,
      emailTypeEnum.STUDENT_APPLICATION_REQUIRES_APPROVAL,
      documents,
      applicationGuid
    );
    try {
      for await (email of emailToApproveApplication){
        await update_last_email_sent_time_data(applicationGuid,actionReason.APPROVAL,email,locals.userId);
      }
      context.log("LastEmailSentTime updated successfully.");
    } catch (dbError) {
      context.log("Database update failed:", dbError);
      return {
        status: ResponseStatus.ERROR,
        jsonBody: { success: false, message: "Database update failed", error: dbError.toString() },
      };
    }

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        success: true,
        message: "Email sent successfully",
      },
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: { success: false, message: `${ErrorMessages.internalServerError} ${error}` },
    };
  }
};

const reportsData = async(request, context, locals) => {
  try {
    const activeApplicationsData = await active_applications_data();
    const allAllocationsData = await all_allocations_data();
    const currentYear = (new Date()).getFullYear();
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        allocationStudentRace: {
          allAllocationStudentAndRace: {
            totalAllocations: sumAmounts(allAllocationsData),
            totalNumberOfActiveStudents: totalNumberOfActiveStudents(activeApplicationsData),
            totalPerRace: filterActiveStudentsByRace(activeApplicationsData)
          },
          byYearAllocationStudentRace: {
            allocationByYear: filterAllocationsByYear(allAllocationsData),
            studentsByYear: filterActiveStudentsByYear(activeApplicationsData),
            raceByYear: filterActiveStudentsByRaceAndYear(activeApplicationsData, "None"),}
        },
        universitiesAllocationSpentData: {
          allAllocationAndSpending: {
            totalAllocationByUniversity: allAllocationByUniversity(allAllocationsData),
            totalAmountUsedByUniversity: allAmountUsedByUniversity(activeApplicationsData)
          },
          byYearAllocationAndSpending: {
            allocationByYear: amountsByUniversityByYear(allAllocationsData),
            usedByYear: amountsByUniversityByYear(activeApplicationsData)
          }
        },
        universitiesActiveStudents: {
          allActiveStudents: {
            totalActiveStudents: allStudentsByUniversity(activeApplicationsData)
          },
          byYearAcitveStudents: {
            totalActiveStudentsByYear: allStudentsByUniversityByYear(activeApplicationsData)
          }
        },
        universitiesActiveRaces: {
          allUniversitiesActiveRaces: {
            totalActiveRaces: allStudentsByRaceByUniversity(activeApplicationsData),
          },
          byYearUniversitiesActiveRaces: {
            activeRacesByYear: filterStudentsByUniversityByRaceByYear(activeApplicationsData),
          }
        },
        distinctYears: Array.from(new Set([...getDistinctYears(allAllocationsData), ...getDistinctYears(activeApplicationsData)])),
        distinctRaces: Array.from(new Set([...getDistinctRaces(activeApplicationsData)])),
        predictedSpending: {
          applicationsData: computePredictedSpending(activeApplicationsData),
          predictionYears: createRange(currentYear + 1, currentYear + 4),
        },
      },
    }
  } catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.yearlyDataFailed}: ${error}`
    }
  }
};

const getUniversityCardData = async (request, context, locals) => {
  const warmUpResponse =handleWarmupRequest(request, context, functionNames.getUniversityCardData);
  if (warmUpResponse) {
    return warmUpResponse;
  }

  const facultyName = '';
  const universityName = '';
  const university = request.query.get("university");
  const viewTypeFlag = request.query.get("viewTypeFlag");
  const bursaryType = viewTypeFlag === 'all' ? null : viewTypeFlag.split(" ")[0];
  const year = request.query.get("year");
  const users = await fetchAllUsers(facultyName, universityName, false);
  let rank = locals.rank === ranks.SUPER_USER ? ranks.LEVEL_ONE_ADMIN : locals.rank
  let result;
  try {
    const allUniversityApplicationsStats = await stats_applications_for_university_data(null, year, rank, bursaryType);
    const allUniversityApplicationsData = await adminDashboardData({university:null, year:year, name:null, bursaryType:bursaryType});
    const yearsOfFunding = await distinct_year_of_study_data();

    if (viewTypeFlag.toLowerCase() === 'all') {
      const aggregatedApplicationsByStatus = {};

      const sortedStatusApplications = await Promise.all(
        allUniversityApplicationsData.map(async (item) => {
          let sortedApplications = await processApplications(item);

          for (const status in sortedApplications) {
            if (aggregatedApplicationsByStatus[status]) {
              aggregatedApplicationsByStatus[status].push(...sortedApplications[status]);
            } else {
              aggregatedApplicationsByStatus[status] = sortedApplications[status];
            }
          }

          return sortedApplications
        })
      );

      result = {
        details: aggregatedApplicationsByStatus,
      };

    } else {
      const userMap = new Map(
        users.map((user) => [user.id, `${user.givenName} ${user.surname}`]),
      );

      const sortedUniversityApplications = await Promise.all(
        allUniversityApplicationsData.map(async (item) => {
          let sortedApplications = await processApplications(item);

          const matchingUniversity = allUniversityApplicationsStats.find(
            (ap) => item.universityName === ap.universityName
          );

          addApproverNames(sortedApplications, userMap);

          const university = item.universityName;
          const totalAllocation = await total_allocated_amount_for_university_data(
            university,
            year,
            bursaryType
          );
          const requestedAmount = await total_requested_amount_for_university_data(
            university,
            year,
            bursaryType
          );
          const approvedAmount = await total_approved_amount_for_university_data(
            university,
            year,
            bursaryType
          );

          const allocations = {
            totalAllocation: totalAllocation[0]?.total_allocation_amount || 0,
            requestedAmount: requestedAmount[0]?.total_requested_amount || 0,
            approvedAmount: approvedAmount[0]?.total_approved_amount || 0,
            years: getDistinctYears(yearsOfFunding),
          };

          return {
            universityDetails: matchingUniversity,
            universityApplications: sortedApplications,
            allocations,
          };
        }),
      );
      result = sortedUniversityApplications

    }

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: result
    }
  }  catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.adminDataError}: ${error}`
    }
  }
}

const getBursariesSummary = async (request, context, locals) => {
  const warmUpResponse = handleWarmupRequest(request, context, functionNames.getBursariesSummary);
  if (warmUpResponse) {
    return warmUpResponse;
  }
  try {
    const bursaryTypesQuery = request.query.get("bursaryTypes");
    const year = request.query.get("year");
    if (!year || !bursaryTypesQuery) {
      return {
        status: ResponseStatus.BAD_REQUEST,
        jsonBody: { error: "Missing required query parameters: 'year' and 'bursaryTypes'" }
      };
    }

    const bursaryTypes = bursaryTypesQuery.split(",");
    const activeApplicationsData = await active_applications_data();
    const rank = locals.rank === ranks.SUPER_USER ? ranks.LEVEL_ONE_ADMIN : locals.rank
    const summaryPromises = bursaryTypes.map(async (bursaryType) => {
      const summaryPromise = bursaries_summary_data(year, bursaryType);
      const statsPromise = stats_applications_for_university_data(null, year, rank, bursaryType);
      const fundSpending = allAmountUsedByUniversity(activeApplicationsData, bursaryType)

      const [bursaryAmountSummary, bursaryStats] = await Promise.all([summaryPromise, statsPromise]);

      return {
        bursaryType,
        bursaryAmountSummary,
        bursaryStats,
        fundSpending
      };
    });

    const result = await Promise.all(summaryPromises);

    const finalSummary = getAggregatedSummaryWithSummaryData(result);

    const spendingByUniversity = allAmountUsedByUniversity(activeApplicationsData);
    const spendingByUniversityTotal = getTotal(allAmountUsedByUniversity(activeApplicationsData));
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody:
        {
          finalSummary,
          spendingByUniversity,
          spendingByUniversityTotal
        }
    };

  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: { error: "An internal server error occurred while fetching bursary data." }
    };
  }
};

const getDeclinedReasons = async (request, context) => {
  try {
    const declinedReasons = await declined_reasons_data();
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: declinedReasons,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    };
  }
}

module.exports = {
  adminUpdateApplicationStatusHistory,
  adminRejectStudentApplication,
  createAdmin,
  getAdminDashBoardData,
  getAllUniversities,
  getApplicationsDetails,
  getApplicationDocuments,
  getApplicationSettings,
  getDeclinedApplications,
  getDepartmentsAndUniversity,
  getUniversityCardData,
  update_student_document_data,
  updateInvoiceStatus,
  updateStudentDocument,
  updateUniversityDepartment,
  updateGradeAverage,
  updateUniversityDepartmentStatus,
  getBursaryTypes,
  getBursariesSummary,
  reportsData,
  resendEmailToExecutive,
  autoNudgeStudents,
  autoNudgeExecutives,
  add_university_data,
  addDepartment,
  addUniversity,
  postExpense,
  postExistingApplication,
  post_expense_data,
  post_existing_application_data,
  processMail,
  maintenanceMode,
  nonResponsiveStudent,
  setCronConfig,
  sendEmail,
  sendEmailToExecutive,
  sendEmailsToHods,
  emailFailedStudentApplication,
  nudgeStudents,
  inviteHOD,
  calculateAverages,
  updateApplicationAmount,
  getStudentsToNudge,
  getStudentExpense,
  uploadPayment,
  uploadAdminDocuments,
  getFaculties,
  getYearsOfFunding,
  getExpensesValues,
  getExpenses,
  getYearOfApplications,
  applicationsReport,
  getDeclinedReasons
}
