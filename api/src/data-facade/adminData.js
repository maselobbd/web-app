const { db } = require("../shared/db-connections");
const {
  admin_update_application_status_history_query,
  hodUserId_query,
  admin_reject_student_application_query,
  year_of_application_query,
  invoice_status_history_insert_query,
  get_applications_report_query,
  admin_dashboard_procedure,
  distinct_years_of_funding_query,
  distinct_bursary_types_query,
  save_student_payment_query,
  email_failed_student_application_query,
  insert_expense_query,
  get_application_documents,
  upload_admin_document,
  get_expense_types,
  get_expense_types_query,
  get_student_questionnaire_responses_query,
  update_invoice_status_query,
  get_expenses_for_application_query,
  students_to_nudge_query,
  add_university_proc,
  all_universities_query,
  all_faculties_query,
  add_department_proc,
  get_departments_and_university_query,
  get_students_to_nudge_query,
  declined_applications_query,
  average_for_cron_query,
  update_calculated_averages_query,
  store_user_query,
  update_application_bursary_amount_query,
  get_invited_user_by_email,
  post_existing_application_query,
  get_cron_config_query,
  set_cron_config_query,
  get_studentProfileDetails_query,
  update_department_name_query,
  update_department_status_query,
  non_responsive_student_application_query,
  average_grade_calculation_query,
  update_student_document_query,
  get_applications_awaiting_exec_approval_query,
  update_last_email_sent_query,
  get_maintenance_configuration_query,
  get_all_allocations_data_per_university_query,
  get_all_applications_students_race_query,
  save_file_query,
  university_stats_query,
  bursaries_summary_query,
  get_declined_reasons_query
} = require("../queries/adminQueries");
const invitedUserStatus = require("../shared/utils/enums/invitedUserStatusEnum");
const { roles } = require("../shared/utils/enums/rolesEnum");

const student_to_nudge_data = async (year, semesterDescription) => {
  const connection = await db();
  const students = await connection
    .input("year", year)
    .input("semesterDescription", semesterDescription)
    .timed_query(students_to_nudge_query, "student_to_nudge_data");
  return students["recordset"];
};

const get_student_to_nudge_data = async () => {
  const connection = await db();
  const students = await connection.timed_query(
    get_students_to_nudge_query,
    "student_to_nudge_data",
  );
  return students["recordset"];
};
const get_applications_report = async (year) => {
  const connection = await db();
  const applicationsReport = await connection
  .input("year", year)
  .timed_query(
    get_applications_report_query,
    "get_applications_report",
  );
  return applicationsReport["recordset"];
};

const admin_update_application_status_history = async (
  status,
  applicationGuid,
  userId,
  isRenewal = false
) => {
  const connection = await db();
  const update_application_status_history = await connection
    .input("status", status)
    .input("applicationGuid", applicationGuid)
    .input("userId", userId)
    .input("isRenewal",isRenewal)
    .timed_query(
      admin_update_application_status_history_query,
      "admin_update_application_status_history",
    );
  return update_application_status_history["rowsAffected"];
};

const hodUserId_data = async (applicationGuid, applicationId) => {
  const connection = await db();

  const hodUserId = await connection
    .input("applicationGuid", applicationGuid)
    .timed_query(hodUserId_query, "hodUserId_data");
  return hodUserId["recordset"][0];
};

const admin_reject_student_application = async (
  status,
  applicationGuid,
  userId,
  reason,
  motivation,
) => {
  const connection = await db();
  const applicationStatus = await connection
    .input("status", status)
    .input("applicationGuid", applicationGuid)
    .input("userId", userId)
    .input("reason", reason)
    .input("motivation", motivation)
    .timed_query(
      admin_reject_student_application_query,
      "admin_reject_student_application",
    );
  return applicationStatus["recordset"][0];
};

const year_of_application_data = async () => {
  const connection = await db();
  const response = await connection.timed_query(
    year_of_application_query,
    "year_of_application_data",
  );
  return response["recordset"];
};
const adminDashboardData = async (filterData) => {
  const connection = await db();
  const inputs = {
    universityName: filterData.university || null,
    year: filterData.year || null,
    name: filterData.name || null,
    bursaryType: filterData.bursaryType
  };
  const response = await connection
    .input("universityName", inputs.universityName)
    .input("year", inputs.year)
    .input("fullName", inputs.name)
    .input("bursaryType", inputs.bursaryType)
    .timed_query(admin_dashboard_procedure, "adminDashboardData");
  return response["recordset"];
};
const invoice_status_history_data = async (userId, applicationGuid, status) => {
  const connection = await db();
  const insertInvoiceResponse = await connection
    .input("userId", userId)
    .input("applicationGuid", applicationGuid)
    .input("status", status)
    .timed_query(
      invoice_status_history_insert_query,
      "invoice_status_history_data",
    );

  return insertInvoiceResponse;
};

const distinct_year_of_study_data = async () => {
  const connection = await db();
  const distinctYearsOfFunding = await connection.timed_query(
    distinct_years_of_funding_query,
    "distinct_year_of_study_data",
  );

  return distinctYearsOfFunding["recordset"];
};

const distinct_bursary_types_data = async () => {
  const connection = await db();
  const distinctYearsOfFunding = await connection.timed_query(
    distinct_bursary_types_query,
    "distinct_bursary_types_data",
  );

  return distinctYearsOfFunding["recordset"];
};

const save_student_payment_data = async (
  applicationId,
  fileUploaded,
  userId,
  paymentFor,
) => {
  const connection = await db();
  if (fileUploaded) {
    const studentInvoiceResult = await connection
      .input("file", fileUploaded)
      .input("applicationId", applicationId)
      .input("userId", userId)
      .input("paymentFor", paymentFor)
      .timed_query(save_student_payment_query, "save_student_payment_data");
    return studentInvoiceResult["recordset"];
  }
};

const admin_Email_Failed_student_application_data = async (applicationGuid) => {
  const connection = await db();
  const applicationStatus = await connection
    .input("applicationGuid", applicationGuid)
    .timed_query(
      email_failed_student_application_query,
      "admin_Email_Failed_student_application_data",
    );

  return applicationStatus["recordset"][0];
};

const post_expense_data = async (data, userId) => {
  const { accommodation, tuition, meals, other, otherDescription, applicationId } = data;
  const connection = await db();

  const result = await connection
    .input("accommodation", accommodation)
    .input("tuition", tuition)
    .input("meals", meals)
    .input("other", other)
    .input("otherDescription", otherDescription)
    .input("applicationId", applicationId)
    .input("userId", userId)
    .timed_query(insert_expense_query, "post_expense_data");
  return result["recordset"];
};

const application_documents_data = async (
  applicationGuid,
  documentType,
  status,
) => {
  const connection = await db();
  const applicationDocuments = await connection
    .input("applicationGuid", applicationGuid)
    .input("documentType", documentType)
    .input("status", status)
    .timed_query(get_application_documents, "application_documents_data");

  return applicationDocuments["recordset"];
};

const get_expenses_data = async () => {
  const connection = await db();
  const expenses = await connection.timed_query(
    get_expense_types,
    "get_expenses_data",
  );
  return expenses["recordset"];
};

const upload_admin_documents_data = async (
  file,
  applicationId,
  userId,
  documentType,
  status,
  expenseCategory,
  reason,
) => {
  const connection = await db();
  const uploadDocumentsResponse = await connection
    .input("file", file)
    .input("applicationId", applicationId)
    .input("userId", userId)
    .input("documentType", documentType)
    .input("status", status)
    .input("expenseCategory", expenseCategory)
    .input("reason", reason)
    .timed_query(upload_admin_document, "upload_admin_documents_data");

  return uploadDocumentsResponse;
};
const get_expenses_values_data = async (applicationGuid) => {
  const connection = await db();
  const expenses = await connection
    .input("applicationGuid", applicationGuid)
    .timed_query(get_expense_types_query, "get_expenses_values_data");
  return expenses["recordset"];
};

const get_student_questionnaire_responses_data = async (applicationId) => {
  const connection = await db();
  const questionnaireResponses = await connection
    .input("applicationId", applicationId)
    .timed_query(
      get_student_questionnaire_responses_query,
      "get_student_questionnaire_responses_data",
    );

  return questionnaireResponses["recordset"];
};

const update_invoice_status_data = async (
  applicationId,
  isRemoved,
  expenseCategory,
) => {
  const connection = await db();
  const expenses = await connection
    .input("applicationId", applicationId)
    .input("isRemoved", isRemoved)
    .input("expenseCategory", expenseCategory)
    .timed_query(update_invoice_status_query, "update_invoice_status_data");
  return expenses["recordset"];
};

const get_expenses_for_application_data = async (applicationId) => {
  const connection = await db();
  const expenses = await connection
    .input("applicationId", applicationId)
    .timed_query(
      get_expenses_for_application_query,
      "get_expenses_for_application_data",
    );
  return expenses["recordset"];
};
const add_university_data = async (university, faculty) => {
  const connection = await db();
  const insertUniversityResult = await connection
    .input("university", university)
    .input("faculty", faculty)
    .timed_query(add_university_proc, "add_university_data");
  return insertUniversityResult["recordset"];
};
const all_universities_data = async () => {
  const connection = await db();
  const insertUniversityResult = await connection.timed_query(
    all_universities_query,
    "all_universities_data",
  );
  return insertUniversityResult["recordset"];
};
const all_faculties_data = async () => {
  const connection = await db();
  const insertUniversityResult = await connection.timed_query(
    all_faculties_query,
    "all_faculties_data",
  );
  return insertUniversityResult["recordset"];
};
const add_department_data = async (university, department, faculty, userId, newFaculty) => {
  const connection = await db();
  const insertUniversityResult = await connection
    .input("universityName", university)
    .input("facultyName", faculty)
    .input("departmentName", department)
    .input("userId", userId)
    .input("newFaculty", newFaculty)
    .timed_query(add_department_proc, "add_department_data");
  return insertUniversityResult["recordset"];
};
const get_departments_and_university_data = async (faculty, university) => {
  const connection = await db();
  const insertUniversityResult = await connection
    .input("facultyName", faculty)
    .input("universityName", university)
    .timed_query(
      get_departments_and_university_query,
      "get_departments_and_university_data",
    );
  return insertUniversityResult["recordset"];
};

const declined_applications_data = async () => {
  const connection = await db();
  const applications = await connection.timed_query(
    declined_applications_query,
    "declined_applications_data",
  );
  return applications["recordset"];
};

const average_for_cron_data = async () => {
  const connection = await db();
  const dataResponse = await connection.timed_query(
    average_for_cron_query,
    "average_for_cron_data",
  );

  return dataResponse["recordset"];
};

const update_calculated_averages_data = async (
  academicTranscriptsHistoryId,
  average,
) => {
  const connection = await db();
  const dataResponse = await connection
    .input("academicTranscriptsHistoryId", academicTranscriptsHistoryId)
    .input("average", average)
    .timed_query(
      update_calculated_averages_query,
      "update_invoice_status_data",
    );
  return dataResponse["rowsAffected"];
};

const store_user_data = async (data, userId, inviterRole) => {
  const connection = await db();
  const dataResponse = await connection
    .input("inviterUserId", userId)
    .input("invitedEmail", data.emailAddress.toLowerCase())
    .input(
      "university",
      data.universityName ? data.universityName : data.university || data.University,
    )
    .input("department", data.department || data.Department)
    .input("faculty", data.faculty || data.Faculty)
    .input("role", data.role || data.userRole)
    .input("rank", data.rank ? data.rank : "no_rank")
    .input(
      "invitedUserStatus",
      inviterRole.toLowerCase() === roles.ADMIN ||
        data.role.toLowerCase() === roles.STUDENT || data.userRole.toLowerCase() === roles.STUDENT
        ? data.InvitedStatus || invitedUserStatus.Accepted
        : invitedUserStatus.Pending,
    )
    .timed_query(store_user_query, "store_user_data");
  return dataResponse["rowsAffected"];
};

const update_application_bursary_amount_data = async (
  applicationGuid,
  newAmount,
  userId,
) => {
  const connection = await db();
  const updateApplicationAmount = await connection
    .input("applicationGuid", applicationGuid)
    .input("newAmount", newAmount)
    .input("userId", userId)
    .timed_query(
      update_application_bursary_amount_query,
      "update_application_bursary_amount_data",
    );
  return updateApplicationAmount["recordset"];
};
const is_user_invited = async (email) => {
  const connection = await db();
  const dataResponse = await connection
    .input("email", email)
    .timed_query(get_invited_user_by_email, "get_invited_user_by_email");

  return dataResponse["recordset"];
};
const update_department_name_data = async (
  universityToUpdate,
  oldDepartmentName,
  newDepartmentName,
  userId,
) => {
  const connection = await db();

  const updatedDepartmentNameResult = await connection
    .input("university", universityToUpdate)
    .input("oldDepartment", oldDepartmentName)
    .input("newDepartment", newDepartmentName)
    .input("userId", userId)
    .timed_query(update_department_name_query, "update_department_name_data");
  return updatedDepartmentNameResult.recordset[0].RecordId;
};

const post_existing_application_data = async (student) => {
  const connection = await db();
  const updateApplicationAmount = await connection
    .input("name", student.name)
    .input("surname", student.surname)
    .input("email", student.email)
    .input("race", student.race)
    .input("gender", student.gender)
    .input("contactNumber", student.contactNumber)
    .input("city", student.city)
    .input("idNumber", student.idNumber)
    .input("universityDepartmentName", student.department)
    .input("averageGrade", student.grade)
    .input("degreeName", student.degreeName)
    .input("dateOfApplication", student.startDate)
    .input("bursaryAmount", student.expenses.bursaryAmount)
    .input("universityName", student.university)
    .input("yearOfStudy", student.yearOfStudy)
    .input("accommodation", student.expenses.accommodation)
    .input("tuition", student.expenses.tuitionFee)
    .input("meals", student.expenses.meals)
    .input("Other", student.expenses.other)
    .input("otherDescription", student.expenses.otherDescription)
    .timed_query(
      post_existing_application_query,
      "post_existing_application_data",
    );
  return updateApplicationAmount["rowsAffected"];
};

const get_cron_config_data = async (configType) => {
  const connection = await db();
  const cronData = await connection
  .input("configType",configType)
  .timed_query(
    get_cron_config_query,
    "get_cron_config_data",
  );

  return cronData["recordset"].length > 0
    ? cronData["recordset"][0]["config"]
    : null;
};

const set_configuration_data = async (config,configType) => {
  const connection = await db();
  const configData = await connection
    .input("config", config)
    .input("configType",configType)
    .timed_query(set_cron_config_query, "set_configuration_data");
  return configData["recordset"].length > 0
    ? configData["recordset"][0]["config"]
    : null;
};

const get_studentProfile_data = async (applicationId) => {
  const connection = await db();
  const studentProfileData = await connection
    .input("applicationId", applicationId)
    .timed_query(get_studentProfileDetails_query, "get_studentProfile_data");
  return studentProfileData["recordset"].length > 0
    ? studentProfileData["recordset"][0]
    : null;
};
const update_department_status_data = async (
  universityName,
  departmentName,
  facultyName,
  status,
  userId,
) => {
  const connection = await db();
  const updateId = await connection
    .input("university", universityName)
    .input("department", departmentName)
    .input("faculty", facultyName)
    .input("status", status)
    .input("userId", userId)
    .timed_query(
      update_department_status_query,
      "update_department_status_data",
    );
  return updateId.recordset.length > 0 ? updateId.recordset[0].RecordId : null;
};

const non_responsive_student_application_data = async () => {
  const connection = await db();
  const applicationStatus = await connection.timed_query(
    non_responsive_student_application_query,
    "non_responsive_student_application_data",
  );

  return applicationStatus["recordset"];
};

const update_grade_average_data = async (
  semesterGradeAverage,
  applicationId,
  semesterDescription,
) => {
  const connection = await db();
  const result = await connection
    .input("semesterGradeAverage", semesterGradeAverage)
    .input("applicationId", applicationId)
    .input("semesterDescription", semesterDescription)
    .timed_query(average_grade_calculation_query, "update_grade_average_data");
  return result["recordset"];
};

const update_student_document_data = async(data)=>{
  const connection = await db();
  const updateResult = await connection
    .input("documentType", data.documentType)
    .input("previousFile", data.previousFile)
    .input("newFile", data.newFile)
    .input("userId", data.userId)
    .input("applicationGuid", data.applicationGuid)
    .input("reasonForUpdate", data.reasonForUpdate)
    .input("markAsDeleted", data.markAsDeleted)
    .input("actionType",data.actionToPerfom.toLowerCase())
    .timed_query(update_student_document_query, "update_student_document_query");
    const resultId = updateResult["recordset"];
    return resultId;
}

const get_pending_applications_data = async (sinceDate) => {
  let connection;
  try {
    connection = await db();
    const result = await connection
      .input("sinceDate", sinceDate)
      .timed_query(get_applications_awaiting_exec_approval_query, "get_pending_applications_data");
    return result.recordset.length > 0 ? result.recordset : [];
  } catch (error) {
    console.error("Error in database query:", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
};
const get_configuration_data = async(configType) => {
  const connection = await db();
  const configuration = await connection
    .input("configType", configType)
    .timed_query(
      get_maintenance_configuration_query,
      "get_configuration_data",
    )
  return configuration["recordset"].length > 0 ? configuration["recordset"][0] : [];
}

const update_last_email_sent_time_data = async (reason, nudgerUserId, nudgeHistoryTvp) => {
  const connection = await db();
  const result = await connection
    .input("nudgeReason", reason)
    .input("nudgerUserId", nudgerUserId)
    .input("nudgeHistoryTVP", nudgeHistoryTvp)
    .execute(
      'UpdateNudgeHistory',
      (error, result) => {
        if(error) {
          throw new Error(error.message, { code });
        } else {
          return result;
        }
      });
  return result['recordset'];
};

const get_email_last_sent = async(applicationGuid) => {
  const connection = await db();
  const result = await connection
    .input("applicationGuid", applicationGuid)
    .timed_query(get_email_last_sent_date_query, "get_email_last_sent_date_query")
    return result.recordset.length > 0 ? result.recordset[0] : null;
}

const active_applications_data = async() => {
  const connection = await db();
  const activeApplicationsData = await connection.timed_query(
      get_all_applications_students_race_query,
      "active_applications_data"
    )
  return activeApplicationsData ? activeApplicationsData["recordset"] : []
}

const all_allocations_data = async() => {
  const connection = await db();
  const allAllocationsData = await connection.timed_query(
      get_all_allocations_data_per_university_query,
      "all_allocations_data"
    )
  return allAllocationsData ? allAllocationsData["recordset"] : [];
}

const save_file_data = async(blobName,applicationId, documentType)=>{
  const connection =await db();
  const saveFile = await connection
  .input("file", blobName)
  .input("amount", 0)
  .input("applicationId", applicationId)
  .input("documentType",documentType)
  .timed_query(
    save_file_query,
    "save_file_data"
  )
  return saveFile["recordset"];
}

const stats_applications_for_university_data = async (university, year,rank, bursaryType) => {
  const connection = await db();
  const applications = await connection
    .input("universityName", university)
    .input("year", year)
    .input("rank", rank)
    .input("bursaryType", bursaryType)
    .timed_query(
      university_stats_query,
      "stats_applications_for_university_data",
    );

  return applications["recordset"];
}

const bursaries_summary_data = async (year, bursaryType) => {
  const connection = await db();
  const applications = await connection
    .input("year", year)
    .input("bursaryType", bursaryType)
    .timed_query(
      bursaries_summary_query,
      "bursaries_summary_data",
    );

  return applications["recordset"][0]?.FundAllocation;
}

const declined_reasons_data = async() => {
  const connection = await db();
  const declined_reasons = await connection.timed_query(get_declined_reasons_query, "declined_reasons_data");
  return declined_reasons["recordset"].map((reasonJson) => reasonJson["reason"]);
}

module.exports = {
  admin_Email_Failed_student_application_data,
  admin_update_application_status_history,
  hodUserId_data,
  admin_reject_student_application,
  year_of_application_data,
  invoice_status_history_data,
  get_applications_report,
  adminDashboardData,
  distinct_year_of_study_data,
  distinct_bursary_types_data,
  save_student_payment_data,
  post_expense_data,
  get_expenses_data,
  application_documents_data,
  upload_admin_documents_data,
  get_expenses_values_data,
  get_student_questionnaire_responses_data,
  update_invoice_status_data,
  get_expenses_for_application_data,
  student_to_nudge_data,
  add_university_data,
  all_universities_data,
  all_faculties_data,
  add_department_data,
  get_departments_and_university_data,
  get_student_to_nudge_data,
  declined_applications_data,
  average_for_cron_data,
  update_calculated_averages_data,
  store_user_data,
  update_application_bursary_amount_data,
  is_user_invited,
  post_existing_application_data,
  get_cron_config_data,
  set_configuration_data,
  get_studentProfile_data,
  update_department_name_data,
  update_department_status_data,
  non_responsive_student_application_data,
  update_grade_average_data,
  update_student_document_data,
  get_pending_applications_data,
  get_configuration_data,
  update_last_email_sent_time_data,
  get_email_last_sent,
  active_applications_data,
  all_allocations_data,
  save_file_data,
  stats_applications_for_university_data,
  bursaries_summary_data,
  declined_reasons_data
};
