const universities_applications_count_query = `
SELECT [universityId]
      ,[universityName]
  FROM [dbo].[universities]
  INNER JOIN universityStatus as UniversityStatus  ON UniversityStatus.universityStatusId = universities.universityStatusId
  WHERE UniversityStatus.status = 'Active';
`;

const universities_applications_by_university_query = `SELECT [universityId]
      ,[universityName]
  FROM [dbo].[universities]
  INNER JOIN universityStatus as UniversityStatus  ON UniversityStatus.universityStatusId = universities.universityStatusId
  WHERE UniversityStatus.status = 'Active'
  AND universities.universityName LIKE '%' || @university || '%';
`;
const hod_active_bursary_applications_query = `
  SELECT  (SELECT universityId FROM universityDepartments
  WHERE universityDepartmentId = universityApplications.universityDepartmentId) AS id, CONCAT(students.name, ' ', students.surname) AS fullName
  , CAST( dateOfApplication AT TIME ZONE 'UTC' AT TIME ZONE 'South Africa Standard Time' AS DATETIME ) as date,
  amount FROM students inner join universityApplications on students.studentId = universityApplications.studentId
  INNER JOIN applicationStatusHistory on universityApplications.applicationId = applicationStatusHistory.applicationId
  WHERE applicationStatusHistory.userId = @userId
  AND (SELECT status FROM applicationStatus WHERE applicationStatus.statusId=applicationStatusHistory.statusId)='Approved';`;

const university_by_id_query = `SELECT universityId FROM universities WHERE universityName = @universityName;`;

const universities_with_active_bursaries_query = `SELECT
universities.universityId AS universityId,
universities.universityName AS universityName,
COUNT(DISTINCT universityApplications.applicationId) AS numberOfApplications
FROM
universities
INNER JOIN
universityDepartments ON universities.universityId = universityDepartments.universityId
INNER JOIN
universityApplications ON universityDepartments.universityDepartmentId = universityApplications.universityDepartmentId
INNER JOIN
applicationStatusHistory ON universityApplications.applicationId = applicationStatusHistory.applicationId
INNER JOIN
applicationStatus ON applicationStatusHistory.statusId = applicationStatus.statusId
INNER JOIN
(
    SELECT
        ish.applicationId,
        invoiceStatus.status AS inv_status,
        MAX(ish.createdAt) AS latestInvCreatedAt
    FROM
        invoiceStatusHistory AS ish
    INNER JOIN
        invoiceStatus ON ish.statusId = invoiceStatus.statusId
    WHERE
        invoiceStatus.status = 'Approved'
    GROUP BY
        ish.applicationId, invoiceStatus.status
) AS latest_inv ON universityApplications.applicationId = latest_inv.applicationId
INNER JOIN
students ON universityApplications.studentId = students.studentId
WHERE
applicationStatus.status = 'Approved'
AND applicationStatusHistory.createdAt = (
    SELECT MAX(createdAt)
    FROM applicationStatusHistory AS ash
    WHERE ash.applicationId = universityApplications.applicationId
)
GROUP BY
universities.universityId, universities.universityName;`;

const hod_filter_bursary_applications_query = `
EXEC GetLatestApplicationData @userId, @status;
`;

const count_hod_bursary_applications_by_date_query = `SELECT COUNT(DISTINCT ash.applicationId) as numberOfApplications
FROM dbo.[applicationStatusHistory] ash
JOIN dbo.[applicationStatusHistory] app ON ash.applicationId = app.applicationId
JOIN dbo.[universityApplications] uniApp ON app.applicationId = uniApp.applicationId
WHERE ash.userId = @userId
AND ash.statusId NOT IN (SELECT statusId FROM applicationStatus WHERE status = 'Draft'  OR status='Approved')
AND uniApp.yearOfFunding = @date;`;
const count_hod_bursary_applications_query = `
SELECT COUNT(DISTINCT app.applicationId) AS numberOfApplications
FROM dbo.[applicationStatusHistory] ash
JOIN dbo.[applicationStatusHistory] app ON ash.applicationId = app.applicationId
WHERE ash.userId = @userId
AND ash.statusId NOT IN (SELECT statusId FROM applicationStatus WHERE status = 'Draft' OR status='Approved');`;
const count_hod_filtered_applications_by_date_query = `

EXEC CountLatestApplicationData @userId,@year
`;

const count_hod_filtered_applications_query = `
EXEC CountLatestApplicationData @userId
`;

const filter_hod_applications_by_year = `
EXEC GetLatestApplicationData @userId, @status, @year
;
`;
const filter_active_bursaries_by_university_query = `SELECT
universities.universityId AS universityId,
universities.universityName AS universityName,
COUNT(universityApplications.applicationId) AS numberOfApplications
FROM
universities
INNER JOIN
universityDepartments ON universities.universityId = universityDepartments.universityId
INNER JOIN
universityApplications ON universityDepartments.universityDepartmentId = universityApplications.universityDepartmentId
INNER JOIN
applicationStatusHistory ON universityApplications.applicationId = applicationStatusHistory.applicationId
INNER JOIN
applicationStatus ON applicationStatusHistory.statusId = applicationStatus.statusId
WHERE
applicationStatus.status = 'Approved'
AND universities.universityName LIKE '%' || @university || '%'
GROUP BY
universities.universityId, universities.universityName;`;
const save_student_invoice_query = `EXEC insertAdminDocuments @file, @applicationId, @userId,@status,@documentType ,@expenseCategory`;
const all_hod_bursary_applications_query = `EXEC GetLatestHODApplicationData @userId, @year`;
const get_expense_types_query = `SELECT TOP 1 accommodation,tuition,meals,other, expensesId FROM expenses
  INNER JOIN universityApplications on expenses.applicationId=universityApplications.applicationId
  WHERE universityApplications.applicationId=@applicationId
  GROUP BY 
  expensesId,accommodation,tuition,meals,other
  ORDER BY expensesId  DESC;`;
const departments_total_allocations_query = `
SELECT SUM(amount) AS total_department_allocation, universityDepartmentName
FROM allocations
JOIN universityDepartments
ON allocations.universityDepartmentId = universityDepartments.universityDepartmentId
JOIN faculties
ON universityDepartments.facultyId = faculties.facultyId
JOIN universities
ON universityDepartments.universityId = universities.universityId
WHERE universityName = @universityName
AND facultyName = @facultyName
AND allocations.yearOfFunding = @year
GROUP BY universityDepartmentName
`
const get_faculty_requested_amounts_query = "EXEC GetDeanRequestedDepartmentAmounts @universityName, @facultyName, @year"
const get_faculty_approved_amounts_query = "EXEC GetDeanApprovedDepartmentAmounts @universityName, @facultyName, @year"
const get_faculty_departments_query = `
  SELECT universityDepartmentName
FROM universityDepartments
JOIN faculties
ON universityDepartments.facultyId = faculties.facultyId
JOIN universities
ON universityDepartments.universityId = universities.universityId
WHERE universityName = @universityName or @universityName IS NULL
AND facultyName = @facultyName OR @facultyName IS NULL`

const update_total_fund_query =`
INSERT INTO [dbo].[totalFundHistory] (amount, userId)
VALUES(@amount,@userId)
`
module.exports = {
  universities_applications_count_query,
  hod_active_bursary_applications_query,
  university_by_id_query,
  universities_with_active_bursaries_query,
  count_hod_bursary_applications_query,
  hod_filter_bursary_applications_query,
  filter_hod_applications_by_year,
  count_hod_filtered_applications_query,
  count_hod_filtered_applications_by_date_query,
  count_hod_bursary_applications_by_date_query,
  universities_applications_by_university_query,
  save_student_invoice_query,
  all_hod_bursary_applications_query,
  get_expense_types_query,
  departments_total_allocations_query,
  get_faculty_requested_amounts_query,
  get_faculty_approved_amounts_query,
  get_faculty_departments_query,
  update_total_fund_query
};
