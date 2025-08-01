const approved_amount_query =
  `SELECT sum(amount) AS total_approved_amount FROM universityApplications
  INNER JOIN applicationStatusHistory ON universityApplications.applicationId = applicationStatusHistory.applicationId
  INNER JOIN applicationStatus ON applicationStatusHistory.statusId = applicationStatus.statusId
  INNER JOIN bursaryTypes ON bursaryTypes.bursaryTypeId = universityApplications.bursaryTypeId
  AND (@bursaryType IS NULL OR bursaryTypes.bursaryType = @bursaryType)
  AND applicationStatus.[status] = @status`;

const requested_amount_query =
  `SELECT sum(amount) AS total_requested_amount FROM universityApplications
  INNER JOIN applicationStatusHistory ON universityApplications.applicationId = applicationStatusHistory.applicationId
  INNER JOIN applicationStatus ON applicationStatusHistory.statusId = applicationStatus.statusId
  INNER JOIN bursaryTypes ON bursaryTypes.bursaryTypeId = universityApplications.bursaryTypeId
  AND (@bursaryType IS NULL OR bursaryTypes.bursaryType = @bursaryType)
  AND applicationStatus.[status] IN (select value from STRING_SPLIT(@status,','));`;
const total_amount_for_university_hod_query = `EXEC GetDepartmentFund @university, @faculty, @department, @year,@role,@bursaryType`;
const total_allocation_amount_query =
  "SELECT amount AS total_allocation_amount FROM allocations a WHERE a.bursaryTypeId = (SELECT bursaryTypeId FROM bursaryTypes WHERE bursaryType = @bursaryType);";
const valid_department_query = ` SELECT universityDepartments.universityDepartmentId
FROM universityDepartments
INNER JOIN faculties ON faculties.facultyId = universityDepartments.facultyId
INNER JOIN universities ON universities.universityId = universityDepartments.universityId
WHERE universities.universityName = @university
AND faculties.facultyName = @faculty
AND universityDepartments.universityDepartmentName = @department
AND universityDepartments.departmentStatusId = (SELECT departmentStatusId FROM departmentStatus ds WHERE ds.departmentStatus = 'Active');
`;
const total_requested_amount_for_university_query =
  "EXEC GetTotalRequestedAmountForUniversity @university, @year, @bursaryType";
const total_approved_amount_for_university_query =
  "EXEC GetTotalApprovedAmountForUniversity @university, @year,@bursaryType";
const total_allocation_for_university_query =
  "EXEC  GetTotalAllocationAmountForUniversity @university,@year,@bursaryType";

const active_universities_departments_allocations_query =
  `SELECT SUM(amount) AS total_allocations, universityDepartments.universityDepartmentName
  FROM allocations
  INNER JOIN universityDepartments ON allocations.universityDepartmentId = universityDepartments.universityDepartmentId
  INNER JOIN universities ON universityDepartments.universityId = universities.universityId
  WHERE universities.universityName = @uniName AND allocations.yearOfFunding = YEAR(GETDATE())
  GROUP BY universityDepartments.universityDepartmentName`

const total_requested_amount_for_university_departments_query =
  "EXEC GetTotalRequestedAmountForDepartments @university"

const total_approved_amount_for_university_departments_query =
"EXEC GetTotalApprovedAmountForDepartments @university"


const fund_allocations_query = "EXEC dbo.GetFundAllocationsData @year, @universityName,@bursaryType"

const move_funds_query = "EXEC dbo.MoveFundsProc @userId, @amount, @departmentName, @universityName, @year"

const reallocations_query = `EXEC ReallocationsInsert @university, @entities, @userId,
    @moneyReallocated, @fromOldAllocation, @fromNewAllocation, @toOldAllocation, @toNewAllocation, @from, @to`

const insert_new_allocations_query =
  "EXEC AllocationsInsert @userId, @amount, @universityName, @year, @action";

const get_fundTotal_allocated_unallocated_amounts_query = `
SELECT SUM(amount) AS fundTotal,
(SELECT SUM(amount) AS totalAllocated FROM allocations WHERE yearOfFunding = @year) AS totalAllocated,
((SELECT SUM(amount) FROM totalFundHistory WHERE yearOfFunding = @year) - (COALESCE((SELECT SUM(amount) AS totalAllocated FROM allocations WHERE yearOfFunding = @year), 0))) AS unallocatedAmount
FROM totalFundHistory WHERE yearOfFunding = @year`

const add_to_total_fund_only_query = "EXEC TotalFundInsert @userId, @amount, @year"

module.exports = {
  approved_amount_query,
  requested_amount_query,
  total_allocation_amount_query,
  total_requested_amount_for_university_query,
  total_approved_amount_for_university_query,
  total_allocation_for_university_query,
  active_universities_departments_allocations_query,
  total_requested_amount_for_university_departments_query,
  total_approved_amount_for_university_departments_query,
  fund_allocations_query,
  total_amount_for_university_hod_query,
  valid_department_query,
  move_funds_query,
  reallocations_query,
  insert_new_allocations_query,
  get_fundTotal_allocated_unallocated_amounts_query,
  add_to_total_fund_only_query
};
