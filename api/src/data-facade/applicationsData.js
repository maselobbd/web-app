const { db } = require("../shared/db-connections");
const {
  universities_query,
  degrees_query,
  races_query,
  years_of_funding_query,
  select_incomplete_application_query,
  application_procedure,
  delete_application_query,
  student_application_query,
  update_application_query,
  check_existing_details_query,
  update_request_count_query,
  hod_to_nudge_query,
  applicants_pending_renewal,
  onboard_query
} = require("../queries/applicationsQueries");
const { checkUser, updateUserInfo } = require("../shared/utils/helper-functions/usersHelperFunctions");

const degrees_data = async () => {
  const connection = await db();
  const degrees = await connection.timed_query(degrees_query, "degrees_data");
  const listOfDegrees = degrees["recordset"].map(
    (degreeJson) => degreeJson["degreeName"],
  );

  return listOfDegrees;
};
const races_data = async () => {
  const connection = await db();
  const races = await connection.timed_query(races_query, "races_data");

  const listOfRaces = races["recordset"].map((raceJson) => raceJson["race"]);

  return listOfRaces;
};
const years_of_funding_data = async (University) => {
  const connection = await db();

  const bursaryYears = await connection
    .input("university", University)
    .timed_query(years_of_funding_query, "years_of_funding_data");
  const listOfbursaryYears = bursaryYears["recordset"].map(
    (bursaryYearsJson) => bursaryYearsJson["yearOfFunding"],
  );

  return listOfbursaryYears;
};

const incomplete_applications_data = async (userId) => {
  const connection = await db();

  const incompleteApplicationResult = await connection
    .input("userId", userId)
    .timed_query(select_incomplete_application_query);
  const incompleteApplications = incompleteApplicationResult.recordset;

  return incompleteApplications;
};
const delete_application_data = async (id) => {
  const connection = await db();

  const deleteApplicationResult = await connection
    .input("applicationId", id)
    .timed_query(delete_application_query, "delete_application_data");

  return deleteApplicationResult;
};
const check_existing_application_data = async (email, name, surname) => {
  const connection = await db();

  const insertApplicationResult = await connection
    .input("email", email)
    .input("name", name)
    .input("surname", surname)
    .timed_query(
      check_existing_details_query,
      "check_existing_application_data",
    );
  const resultId = insertApplicationResult["recordset"];
  return resultId;
};
const save_application_data = async (applicant, locals) => {
  const connection = await db();
  const insertApplicationResult = await connection
    .input("applicationId", applicant.applicationId)
    .input("name", applicant.name)
    .input("surname", applicant.surname)
    .input("title", applicant.title)
    .input("email", applicant.email)
    .input("idDocumentName", applicant.name + ".pdf")
    .input("race", applicant.race)
    .input("gender", applicant.gender)
    .input("degreeName", applicant.degreeName)
    .input("university", applicant.university)
    .input("faculty", applicant.faculty)
    .input("department", applicant.department)
    .input("yearOfFunding", applicant.yearOfFunding)
    .input("amount", applicant.amount)
    .input("averageGrade", applicant.gradeAverage)
    .input("motivation", applicant.motivation)
    .input("status", applicant.complete ? "Pending" : "Draft")
    .input("userId", locals.userId)
    .input("userRole", locals.role)
    .input("isRenewal",applicant.isRenewal)
    .input("yearOfStudy",applicant.yearOfStudy)
    .input("bursaryType", applicant.bursaryType)
    .input("bursaryTier", applicant.bursaryTier)
    .timed_query(application_procedure, "save_application_data");
  const resultId = insertApplicationResult["recordset"];
  return resultId[0];
};

const update_application_data = async (
  applicationGuid,
  data,
  userId,
) => {
  const connection = await db();

  const insertApplicationResult = await connection
    .input("applicationGuid", applicationGuid)
    .input("name", data.name)
    .input("surname", data.surname)
    .input("email", data.email)
    .input("contactNumber", data.contactNumber)
    .input("yearOfFunding", data.yearOfFunding)
    .input("address", data.address)
    .input("code", data.code)
    .input("city", data.city)
    .input("suburb", data.suburb)
    .input("university", data.university)
    .input("faculty", data.faculty)
    .input("degree", data.degree)
    .input("yearOfStudy", data.yearOfStudy)
    .input("degreeDuration", data.degreeDuration)
    .input("confirmHonors", data.confirmHonors)
    .input("department", data.department)
    .input("userId", userId)
    .timed_query(update_application_query, "update_application_data");

  const resultId = insertApplicationResult["recordset"];

  return resultId;
};
function formatPhoneNumber(number) {
  if (number.length === 10 && number[0] === "0") {
    return "+27" + number.slice(1);
  } else if (number.length === 9) {
    return "+27" + number;
  } else {
    return "";
  }
}

const save_student_application_form_data = async (formValue, documentation, responses) => {
  const connection = await db();

  if (formValue && responses) {
    const personalInformation = formValue["personalInformation"];
    const constactNumber = formValue["contactNumber"];
    const address = formValue["address"];
    const universityInformation = formValue["universityInformation"];
    const termsAndConditionsPrivacyPolicy =
      formValue["termsAndConditionsPrivacyPolicy"];
    const applicationConfirmationCheckbox =
      formValue["applicationConfirmationCheckbox"];

    const insertStudentApplicationData = await connection
      .input("applicationId", personalInformation["applicationId"])
      .input("studentId", personalInformation["studentId"])
      .input("title", personalInformation["title"].trim())
      .input("other", personalInformation["other"] 
        ? personalInformation["other"].trim()
        : null
      )
      .input("name", personalInformation["firstName"].trim())
      .input("surname", personalInformation["lastName"].trim())
      .input("gender", personalInformation["gender"])
      .input("idNumber", personalInformation["idNumber"].trim())
      .input("race", personalInformation["race"])
      .input("contactNumber", formatPhoneNumber(constactNumber["phoneNumber"].trim()))
      .input("streetAddress", address["addressLine1"].trim())
      .input("suburb", address["suburbDistrict"].trim())
      .input("city", address["cityTown"].trim())
      .input("postalCode", address["postalCode"].trim())
      .input("degree", universityInformation["degree"])
      .input("gradeAverage", universityInformation["gradeAverage"])
      .input("yearOfStudy", universityInformation["yearOfStudy"].trim())
      .input("userId", personalInformation["email"])
      .input(
        "applicationAcceptanceConfirmation",
        applicationConfirmationCheckbox["checkbox"],
      )
      .input(
        "citizenship",
        personalInformation["citizenShipControl"]
      )
      .input(
        "termsAndConditions",
        termsAndConditionsPrivacyPolicy["termsAndConditionsCheckbox"],
      )
      .input(
        "privacyPolicy",
        termsAndConditionsPrivacyPolicy["privacyPolicyCheckbox"],
      )
      .input("idDocumentName", documentation["proofOfIdentification"])
      .input("academicTranscriptDocumentName", documentation["academicRecord"])
      .input(
        "financialStatementDocumentName",
        documentation["financialStatement"],
      )
      .input("matricDocumentName", documentation["matric"])
      .input("dateOfBirth", personalInformation["dateOfBirth"])
      .input("questionnaireResponseJson", responses)
      .input("questionnaireStatus", "Complete")
      .input("complexFlat", address["complexFlat"] ? address["complexFlat"].trim() : "N/A")
      .input("degreeDuration", universityInformation["degreeDuration"])
      .input("confirmHonors", universityInformation["confirmHonors"])
      .timed_query(
        student_application_query,
        "save_student_application_form_data",
      );
    return insertStudentApplicationData["rowsAffected"];
  }
  return "";
};

const update_location_count_data = async(updateCount)=>{
  const connection = await db();
  const updatedCount = await connection
  .input("count", updateCount)
  .timed_query(update_request_count_query, "update_location_count_data")
  return updatedCount;
}

const hod_to_nudge_data = async()=>{
  const connection = await db();
  const hodData = await connection
  .timed_query(hod_to_nudge_query, "hod_to_nudge_data")
  return hodData.recordset;
}

const hod_student_pending_renewal_data = async(userId)=>
{
  const connection = await db();
  const studentRenwalData = await connection
  .input("userId",userId)
  .timed_query(applicants_pending_renewal,hod_student_pending_renewal_data)
  return studentRenwalData.recordset
}

const onboard_data = async(obj,userId)=>
{
  const connection = await db();
  const studentRenwalData = await connection
  .input("email",obj.bursarEmail)
  .input("firstName",obj.firstName)
  .input("lastName",obj.lastName)
  .input("idNumber",obj.idNumber)
  .input("gender",obj.gender)
  .input("race",obj.race)
  .input("title",obj.title)
  .input("phoneNumber",obj.phoneNumber)
  .input("addressLine",obj.addressLine)
  .input("cityTown",obj.cityTown)
  .input("postalCode",obj.postalCode)
  .input("complexFlat",obj.complexFlat)
  .input("suburbDistrict",obj.suburbDistrict)
  .input("degree",obj.degree)
  .input("gradeAverage",obj.gradeAverage)
  .input("yearOfStudy",obj.yearOfStudy)
  .input("universityFaculty",obj.universityFaculty)
  .input("bursaryType",obj.bursaryType)
  .input("bursaryAmount",obj.bursaryAmount)
  .input("bursarUniversity",obj.bursarUniversity)
  .input("bursarDepartment",obj.bursarDepartment)
  .input("bursaryTier",obj.bursaryTier)
  .input("proofOfIdFile",obj.proofOfIdFile)
  .input("contractFile",obj.contractFile)
  .input("paymentFile",obj.paymentFile)
  .input("invoiceFile",obj.invoiceFile)  
  .input("userId",userId)
  .timed_query(onboard_query, "onboard_data")
  return studentRenwalData.recordset
}

module.exports = {
  degrees_data,
  years_of_funding_data,
  races_data,
  incomplete_applications_data,
  save_application_data,
  delete_application_data,
  save_student_application_form_data,
  update_application_data,
  check_existing_application_data,
  update_location_count_data,
  hod_to_nudge_data,
  hod_student_pending_renewal_data,
  onboard_data
};
