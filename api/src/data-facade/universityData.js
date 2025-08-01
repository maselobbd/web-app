const { db } = require("../shared/db-connections");
const {
  universities_applications_count_query,
  universities_with_active_bursaries_query,
  count_hod_bursary_applications_query,
  hod_filter_bursary_applications_query,
  university_by_id_query,
  filter_hod_applications_by_year,
  count_hod_filtered_applications_query,
  count_hod_filtered_applications_by_date_query,
  count_hod_bursary_applications_by_date_query,
  filter_active_bursaries_by_university_query,
  universities_applications_by_university_query,
  save_student_invoice_query,
  all_hod_bursary_applications_query,
  get_expense_types_query,
  departments_total_allocations_query,
  get_faculty_requested_amounts_query,
  get_faculty_approved_amounts_query,
  get_faculty_departments_query,
  update_total_fund_query
} = require("../queries/universityQueries");
const StatusEnum = require('../shared/utils/enums/statusEnum')

const university_count_data = async () => {
  const connection = await db();
  const universities = await connection.timed_query(
    universities_applications_count_query,
    "university_count_data",
  );

  const listOfUniversities = universities["recordset"];

  return listOfUniversities;
};

const universities_by_university_data = async (university) => {
  const connection = await db();
  const universities = await connection
    .input("university", university)
    .timed_query(
      universities_applications_by_university_query,
      "universities_by_university_data",
    );
  return universities["recordset"];
};

const active_bursary_by_university_data = async (university) => {
  const connection = await db();
  const universityInformation = await connection
    .input("university", university)
    .timed_query(
      filter_active_bursaries_by_university_query,
      "active_bursary_by_university_data",
    );
  return universityInformation["recordset"];
};
const universities_with_active_bursaries_data = async () => {
  const connection = await db();
  const universities = await connection.timed_query(
    universities_with_active_bursaries_query,
    "universities_with_active_bursaries_data",
  );
  const listOfUniversities = universities["recordset"];

  return listOfUniversities;
};

const mapStatusToDBStatus = (status) => {
  return StatusEnum[status] || status;
};
const hod_bursary_applications_data = async (status, userId) => {
  const connection = await db();
  const dbStatus = mapStatusToDBStatus(status);

  const hod_bursary_applications = await connection
    .input("userId", userId)
    .input("status", dbStatus)
    .timed_query(
      hod_filter_bursary_applications_query,
      "hod_bursary_applications_data",
    );

  return hod_bursary_applications["recordset"];
};

const hod_application_by_date_data = async (date, status, userId) => {
  const connection = await db();
  const dbStatus = mapStatusToDBStatus(status);

  const hod_bursary_applications = await connection
    .input("year", date)
    .input("userId", userId)
    .input("status", dbStatus)
    .timed_query(
      filter_hod_applications_by_year,
      "hod_application_by_date_data",
    );
  return hod_bursary_applications["recordset"];
};

const count_hod_bursary_applications_data = async (userId) => {
  const connection = await db();

  const hod_bursary_applications = await connection
    .input("userId", userId)
    .timed_query(
      count_hod_bursary_applications_query,
      "count_hod_bursary_applications_data",
    );
  return hod_bursary_applications["recordset"][0]["numberOfApplications"];
};

const count_hod_bursary_applications_by_date_data = async (date, userId) => {
  const connection = await db();

  const hod_bursary_applications = await connection
    .input("date", date)
    .input("userId", userId)
    .timed_query(
      count_hod_bursary_applications_by_date_query,
      "count_hod_bursary_applications_by_date_data",
    );

  return hod_bursary_applications["recordset"][0]["numberOfApplications"];
};
const count_hod_number_bursary_applications_status_date_data = async (
  date,
  userId,
) => {
  const connection = await db();

  const hod_bursary_applications = await connection
    .input("year", date)
    .input("userId", userId)
    .timed_query(
      count_hod_filtered_applications_by_date_query,
      "count_hod_number_bursary_applications_status_date_data",
    );
  return hod_bursary_applications["recordset"];
};
const count_hod_filtered_bursary_applications_data = async (userId) => {
  const connection = await db();

  const hod_bursary_applications = await connection
    .input("userId", userId)
    .timed_query(
      count_hod_filtered_applications_query,
      "count_hod_filtered_bursary_applications_data",
    );

  return hod_bursary_applications["recordset"];
};
const university_id_data = async (universityName) => {
  const connection = await db();
  const university = await connection
    .input("universityName", universityName)
    .timed_query(university_by_id_query, "university_id_data");
  return university["recordset"][0]["universityId"];
};
const save_student_invoice_data = async (applicationId, fileUploaded, userId,expenseCategory) => {
  const connection = await db();
  if (fileUploaded) {
    const studentInvoiceResult = await connection
      .input("file", fileUploaded)
      .input("applicationId", applicationId)
      .input("userId", userId)
      .input("status","Pending")
      .input("documentType","Invoice")
      .input("expenseCategory", expenseCategory)
      .timed_query(save_student_invoice_query, "save_student_invoice_data");
    return studentInvoiceResult["recordset"];
  }
};
const all_hod_bursary_applications_data = async (userId,year) => {
  const connection = await db();
  const hod_bursary_applications = await connection
    .input("userId", userId)
    .input("year", year==0?null:year)
    .timed_query(
      all_hod_bursary_applications_query,
      "all_hod_bursary_applications_data"
    );
  return hod_bursary_applications["recordset"];
}
const get_expenses_values_data = async (applicationId) => {
  const connection = await db();
  const expenses = await connection
    .input("applicationId", applicationId)
    .timed_query(get_expense_types_query, "get_expenses_values_data");
  return expenses["recordset"];
}

const get_faculty_requested_amounts_data = async(universityName, facultyName, year) => {
  const connection = await db();
  const requested_amounts = await connection
    .input("universityName", universityName)
    .input("facultyName", facultyName)
    .input("year", year)
    .timed_query(
      get_faculty_requested_amounts_query,
      "get_faculty_requested_amounts_data" 
    )
    return requested_amounts["recordset"]
}

const get_faculty_approved_amounts_data = async(universityName, facultyName, year) => {
  const connection = await db();
  const approved_amounts = await connection
    .input("universityName", universityName)
    .input("facultyName", facultyName)
    .input("year", year)
    .timed_query(
      get_faculty_approved_amounts_query,
      "get_faculty_approved_amounts_data"
    )
    return approved_amounts["recordset"]
}

const get_faculty_allocations_data = async(universityName, facultyName, year) => {
  const connection = await db();
  const faculty_allocations = await connection
  .input("universityName", universityName)
  .input("facultyName", facultyName)
  .input("year", year)
  .timed_query(
    departments_total_allocations_query,
    "get_faculty_allocations_data" 
  )
  return faculty_allocations["recordset"]
}

const get_faculty_departments_data = async(universityName, facultyName) => {
  const connection = await db();
  const departments = await connection
    .input("universityName", universityName|| null)
    .input("facultyName", facultyName || null)
    .timed_query(
      get_faculty_departments_query,
      "get_faculty_departments_data"
    )
    return departments["recordset"]
}

const update_total_fund_data = async(amount, userId)=> {

  const connection = await db();
  const totalFundInsert = await connection
  .input("amount",amount)
  .input("userId",userId)
  .timed_query(update_total_fund_query, "get_faculty_departments_query")
  return totalFundInsert["recordset"]
}
module.exports = {
  university_count_data,
  hod_bursary_applications_data,
  university_id_data,
  universities_with_active_bursaries_data,
  hod_bursary_applications_data,
  count_hod_bursary_applications_data,
  hod_application_by_date_data,
  count_hod_filtered_bursary_applications_data,
  count_hod_number_bursary_applications_status_date_data,
  count_hod_bursary_applications_by_date_data,
  active_bursary_by_university_data,
  universities_by_university_data,
  save_student_invoice_data,
  all_hod_bursary_applications_data,
  get_expenses_values_data,
  get_faculty_requested_amounts_data,
  get_faculty_approved_amounts_data,
  get_faculty_allocations_data,
  get_faculty_departments_data,
  update_total_fund_data
};
