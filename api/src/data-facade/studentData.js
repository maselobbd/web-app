const { db } = require("../shared/db-connections");
const {
  student_information_query,
  get_student_emails_query,
  gender_query,
  update_application_status_history_query,
  student_information_by_applicationId_procedure,
  get_student_documents_information,
  get_questionnaire_questions_query,
  change_document_status_query,
  upload_recent_academic_transcript_query,
  get_averages_query,
  get_titles_query,
  get_student_guid_query,
  update_student_details_query,
  insert_profile_picture_query,
  get_student_documents_years_query,
  get_remaining_requests_query,
  reset_num_requests_query,
  get_application_status_history_query,
  get_application_invoice_status_history_query,
  get_application_fund_distribution_history_query,
  get_application_details_update_history_query,
  get_document_updates_history_query,
  can_renew_application_query,
  get_student_min_max_allocation_query,
  get_student_events_query
} = require("../queries/studentQueries");

const student_data = async (applicationGuid) => {
  const connection = await db();
  const studentInformation = await connection
    .input("applicationGuid", applicationGuid)
    .timed_query(student_information_query, "student_data");
  return studentInformation["recordset"][0];
};

const gender_data = async () => {
  const connection = await db();
  const genders = await connection.timed_query(gender_query, "gender_data");
  const listOfGenders = genders["recordset"].map(
    (genderJson) => genderJson["gender"],
  );
  return listOfGenders;
};
const student_data_by_id = async (id) => {
  const connection = await db();
  const studentInformation = await connection
    .input("applicationGuid", id)
    .timed_query(
      student_information_by_applicationId_procedure,
      "student_data_by_id",
    );
  return studentInformation["recordset"][0];
};

const student_emails = async () => {
  const connection = await db();
  const studentEmails = await connection.timed_query(
    get_student_emails_query,
    "student_emails",
  );
  return studentEmails["recordset"];
};

const update_application_status_history = async (
  userId,
  applicationId,
  status,
) => {
  const connection = await db();
  const update_application_status_history = await connection
    .input("userId", userId)
    .input("applicationId", applicationId)
    .input("status", status)
    .timed_query(
      update_application_status_history_query,
      "update_application_status_history",
    );
  return update_application_status_history["recordset"];
};

const student_documents_data = async (
  applicationguid,
  year,
  userRole
) => {

  const connection = await db();
  const documents_data = await connection
  .input("applicationguid", applicationguid)
  .input("year", year)
  .input("userRole", userRole)
  .timed_query(
    get_student_documents_information,
    "student_documents_data"
  )
  return documents_data["recordset"];
}

const student_questionnaire_data = async () => {
  const connection = await db();
  const questions = await connection.timed_query(
    get_questionnaire_questions_query,
    "student_questionnaire_data"
  )
  return questions['recordset'];
}

const confirm_student_documents_data = async (applicationId,userId,status) => {

  const connection = await db();
  const confirm_student_documents_data = await connection.input("userId",userId)
  .input("applicationId", applicationId)
  .input("status",status).timed_query(
    change_document_status_query,
    "confirm_student_documents_data"
  )
  return confirm_student_documents_data["recordset"];
}

const upload_recent_academic_transcript_data = async(
  applicationGuid,
  docBlobName,
  semesterDescription
) => {
  const connection = await db();
  const transcriptUploadInsertResponse = await connection
    .input("applicationGuid", applicationGuid)
    .input("docBlobName", docBlobName)
    .input("semesterDescription", semesterDescription)
    .timed_query(
      upload_recent_academic_transcript_query,
      "upload_recent_academic_transcript_data"
    )

    return transcriptUploadInsertResponse["recordset"][0]["newTranscriptId"];
}

const get_averages_data = async(
  applicationGuid
) => {
  const connection = await db();
  const averages = await connection
    .input("applicationGuid", applicationGuid)
    .timed_query(
      get_averages_query,
      "get_averages_data"
    )

  return averages['recordset'];
}

const get_titles_data = async() => {
  const connection = await db();
  const titles = await connection.timed_query(
    get_titles_query,
    "get_titles_data"
  )
  return titles["recordset"].map(
    titleObject => titleObject["title"]
  )
}

const get_student_guid_data = async(emailAddress) => {
  const connection = await db();
  const applicationGuid = await connection
  .input("emailAddress", emailAddress)
  .timed_query(
    get_student_guid_query,
   "get_student_guid_data"
  )

  return applicationGuid["recordset"]
}

const update_student_details_data = async(profileUpdateForm, applicationGuidDetailsForm) => {
  const connection = await db();
  const update = await connection
    .input("newName",profileUpdateForm.givenName)
    .input("newSurname",profileUpdateForm.surname)
    .input("newEmail", profileUpdateForm.emailAddress)
    .input("newContactNumber",profileUpdateForm.contactNumber)
    .input("name",applicationGuidDetailsForm.name)
    .input("surname",applicationGuidDetailsForm.surname)
    .input("email",applicationGuidDetailsForm.email)
    .input("contactNumber", applicationGuidDetailsForm.contactNumber)
    .input("department", applicationGuidDetailsForm.Department)
    .input("faculty", applicationGuidDetailsForm.Faculty)
    .input("university", applicationGuidDetailsForm.University)
    .timed_query(
      update_student_details_query,
      "update_student_details_data"
    )
    return update;
}

const upload_student_profile_picture_data = async(studentId, profilePictureBlobName) => {
  const connection = await db();
  const profilePhoto = await connection
  .input("studentId",studentId)
  .input("profilePictureBlobName",profilePictureBlobName)
  .timed_query(
    insert_profile_picture_query,
   "upload_student_profile_picture_data"
  )
  return profilePhoto["recordset"]
}

const get_student_documents_years_data = async() => {
  const connection = await db();
  const documentsYears = await connection.timed_query(
    get_student_documents_years_query,
    "get_student_documents_years_data"
  )

  return documentsYears['recordset']
}
const get_location_requests_data = async() => {
  const connection = await db();
  const maxRequest = await connection.timed_query(
    get_remaining_requests_query,
    "get_location_requests_data"
  )
  return maxRequest['recordset'][0].currentNumRequests;
}
const reset_address_request_count_data = async() => {
  const resetToValue = 0;
  const connection = await db();
  const resetRequests = await connection
  .input('numRequests', resetToValue)
  .timed_query(
    reset_num_requests_query,
    "reset_address_request_count_data"
  )
  return resetRequests['recordset']
}
const application_status_history_data = async (applicationGuid) =>{
  const connection = await db();

  const applicationStatushistory = await connection
  .input('applicationGuid',applicationGuid)
  .timed_query(get_application_status_history_query,'application_status_history_data')

  return applicationStatushistory['recordset'];
}
const application_invoice_status_history_data = async (applicationGuid) =>{
  const connection = await db();

  const applicationInvoiceHistory = await connection
  .input('applicationGuid',applicationGuid)
  .timed_query(get_application_invoice_status_history_query,'application_status_history_data')

  return applicationInvoiceHistory['recordset'];
}
const application_fund_distribution_history_data = async(applicationGuid) => {
  const connection = await db();
  const fundDistributionHistory = await connection
  .input('applicationGuid', applicationGuid)
  .timed_query(get_application_fund_distribution_history_query, 'application_fund_distribution_history_data')
  return fundDistributionHistory['recordset'];
}
const application_details_update_history_data = async(applicationGuid) => {
  const connection = await db();
  const detailsUpdates = await connection
  .input('applicationGuid', applicationGuid)
  .timed_query(get_application_details_update_history_query, 'application_details_update_history_data')
  return detailsUpdates['recordset'];
}

const application_documents_update_history_data = async(applicationGuid) => {
  const connection = await db();
  const documentsUpdates = await connection
  .input('applicationGuid', applicationGuid)
  .timed_query(get_document_updates_history_query, 'application_documents_update_history_data')
  return documentsUpdates['recordset'];
}

const application_renewal_data = async(applicationGuid)=>{
  const connection = await db();
  const canRenew = await connection
  .input('applicationGuid', applicationGuid)
  .timed_query(can_renew_application_query, 'application_renewal_data')
  return canRenew['recordset'][0].isRenewed;
}

const student_min_max_allocation_data = async (role, bursaryType, allocatorGuid)=>
{
  const connection = await db();
  const minMaxAllocation = await connection
  .input('role', role)
  .input('bursaryType',bursaryType)
  .input('allocatorGuid', allocatorGuid)
  .timed_query(get_student_min_max_allocation_query, 'student_min_max_allocation_data')
  return minMaxAllocation['recordset'];
}

const student_events_data = async (studentId) => {
  const connection = await db();
  const studentEvents = await connection
  .input("studentId", studentId)
  .timed_query(get_student_events_query, 'student_events_data')
  return studentEvents['recordset'];
}

module.exports = {
  student_data,
  student_emails,
  update_application_status_history,
  gender_data,
  student_data_by_id,
  student_documents_data,
  student_questionnaire_data,
  confirm_student_documents_data,
  upload_recent_academic_transcript_data,
  get_averages_data,
  get_titles_data,
  get_student_guid_data,
  update_student_details_data,
  upload_student_profile_picture_data,
  get_student_documents_years_data,
  get_location_requests_data,
  reset_address_request_count_data,
  application_status_history_data,
  application_invoice_status_history_data,
  application_fund_distribution_history_data,
  application_details_update_history_data,
  application_documents_update_history_data,
  application_renewal_data,
  student_min_max_allocation_data,
  student_events_data
};
