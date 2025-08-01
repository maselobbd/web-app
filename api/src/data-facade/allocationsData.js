const { db } = require("../shared/db-connections");
const {
  approved_amount_query,
  requested_amount_query,
  total_allocation_amount_query,
  total_requested_amount_for_university_query,
  total_approved_amount_for_university_query,
  total_allocation_for_university_query,
  total_requested_amount_for_university_departments_query,
  fund_allocations_query,
  total_amount_for_university_hod_query,
  valid_department_query,
  move_funds_query,
  insert_new_allocations_query,
  reallocations_query,
  get_fundTotal_allocated_unallocated_amounts_query,
  add_to_total_fund_only_query
} = require("../queries/allocationsQueries");

const {active_universities_query} = require("../queries/adminQueries");

const total_amount_data = async (bursaryType = 'BBD') => {
  const totalAllocationQuery = total_allocation_amount_query;
  const connection = await db();
  const totalAllocation = await connection
  .input("bursaryType", bursaryType)
  .timed_query(
    totalAllocationQuery,
    "total_amount_data",
  );

  return totalAllocation["recordset"][0]["total_allocation_amount"];
};

const approved_amount_data = async (bursaryType,status) => {
  const appAmountQuery = approved_amount_query;
  const connection = await db();
  const approvedAmount = await connection
  .input("bursaryType", bursaryType)
  .input("status",status)
  .timed_query(
    appAmountQuery,
    "approved_amount_data",
  );

  return approvedAmount["recordset"][0]["total_approved_amount"];
};

const requested_amount_data = async () => {
  const reqAmountQuery = requested_amount_query;
  const connection = await db();
  const requestedAmount = await connection.timed_query(
    reqAmountQuery,
    "requested_amount_data",
  );

  return requestedAmount["recordset"][0]["total_requested_amount"];
};

const total_requested_amount_for_university_data = async (university,year,bursaryType) => {
  const connection = await db();
  const applications = await connection
    .input("university", university)
    .input("year",year)
    .input("bursaryType", bursaryType)
    .timed_query(
      total_requested_amount_for_university_query,
      "total_requested_amount_for_university_data",
    );

  return applications["recordset"];
};
const total_funds_for_university_hod_data = async (data) => {
  const connection = await db();
  const applications = await connection
    .input("university", data.university)
    .input("faculty", data.faculty)
    .input("department", data.department)
    .input("year",data.year)
    .input("role",data.role)
    .input("bursaryType",data.bursaryType)
    .timed_query(
      total_amount_for_university_hod_query,
      "total_funds_for_university_hod_data",
    );

  return applications["recordset"];
};
const total_approved_amount_for_university_data = async (university,year, bursaryType) => {
  const connection = await db();
  const applications = await connection
    .input("university", university)
    .input("year",year)
    .input("bursaryType", bursaryType)
    .timed_query(
      total_approved_amount_for_university_query,
      "total_approved_amount_for_university_data",
    );

  return applications["recordset"];
};

const valid_department_data = async (university, department, faculty) => {
  const connection = await db();
  const applications = await connection
    .input("university", university)
    .input("faculty", faculty)
    .input("department", department)
    .timed_query(valid_department_query, "valid_department_data");
  return applications["recordset"].length;
};

const total_allocated_amount_for_university_data = async (university,year,bursaryType) => {
  const connection = await db();
  const applications = await connection
    .input("university", university)
    .input("year", year )
    .input("bursaryType", bursaryType)
    .timed_query(
      total_allocation_for_university_query,
      "total_allocated_amount_for_university_data",
    );

  return applications["recordset"];
};

const fund_allocations_data = async (year, university = null,bursaryType=null) => {
  const connection = await db();
  const response = await connection
    .input("year", year)
    .input("universityName",university)
    .input("bursaryType",bursaryType)
    .timed_query(
    fund_allocations_query,
    "fund_allocations_data"
  )

  return response["recordset"];
}

const move_funds_data = async (userId, amount, departmentName, universityName, year) => {
  const connection = await db();
  const move_funds_response_data = await connection
    .input("userId", userId)
    .input("amount", amount)
    .input("departmentName", departmentName)
    .input("universityName", universityName)
    .input("year", year)
    .timed_query(move_funds_query, "move_funds_data")
  return move_funds_response_data;
}

const insert_new_allocations_data = async (
  userId,
  amount,
  universityName,
  year,
  action
) => {
  const connection = await db();
  const response = await connection
    .input("userId", userId)
    .input("amount", amount)
    .input("universityName", universityName)
    .input("year", year)
    .input("action", action)
    .timed_query(insert_new_allocations_query, "insert_new_allocations_data");

  return response["recordset"];
};

const reallocations_data = async(reallocations, userId) => {

  const connection = await db();
  const reallocationResponse = await connection
    .input("university", reallocations["university"])
    .input("entities", reallocations["entities"])
    .input("userId", userId)
    .input("moneyReallocated", reallocations["moneyReallocated"])
    .input("fromOldAllocation", reallocations["fromOldAllocation"])
    .input("fromNewAllocation", reallocations["fromNewAllocation"])
    .input("toOldAllocation", reallocations["toOldAllocation"])
    .input("toNewAllocation", reallocations["toNewAllocation"])
    .input("from", reallocations["from"])
    .input("to", reallocations["to"])
    .timed_query(
      reallocations_query,
      "reallocations_data"
    )

    return reallocationResponse["recordset"][0]["newReallocationId"]
}

const get_fundTotal_allocated_unallocated_amounts_data = async(year) => {
  const connection = await db();
  const fundAmounts = await connection
    .input("year", year)
    .timed_query(
      get_fundTotal_allocated_unallocated_amounts_query,
      "get_fundTotal_allocated_unallocated_amounts_data"
    );
  return fundAmounts["recordset"];
}

const insert_into_totalFundHistory_data = async(totalFundDetails, userId) => {
  const connection = await db();
  const totalFundInsertResponse = await connection
    .input("userId", userId)
    .input("amount", totalFundDetails.amount)
    .input("year", totalFundDetails.year)
    .timed_query(
      add_to_total_fund_only_query,
      "insert_into_totalFundHistory_data"
    )
    return totalFundInsertResponse["rowsAffected"];
}

module.exports = {
  total_amount_data,
  requested_amount_data,
  approved_amount_data,
  total_requested_amount_for_university_data,
  total_approved_amount_for_university_data,
  total_allocated_amount_for_university_data,
  total_funds_for_university_hod_data,
  valid_department_data,
  move_funds_data,
  insert_new_allocations_data,
  reallocations_data,
  get_fundTotal_allocated_unallocated_amounts_data,
  insert_into_totalFundHistory_data,
  fund_allocations_data
};
