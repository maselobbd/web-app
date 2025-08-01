const student_information_query = `
SELECT students.studentId, students.[name] AS firstName, students.surname
AS lastName, students.email
AS Email, universities.universityName
AS University,universityApplications.applicationId,
faculties.facultyName AS Faculty, max(applicationStatusHistory.createdAt)
AS applicationStatusHistoryDate,
bt.bursaryType as bursaryType
FROM students INNER JOIN universityApplications
ON students.studentId = universityApplications.studentId INNER JOIN universityDepartments
ON universityApplications.universityDepartmentId = universityDepartments.universityDepartmentId INNER JOIN universities
ON universityDepartments.universityId = universities.universityId INNER JOIN faculties
ON universityDepartments.facultyId = faculties.facultyId
INNER JOIN bursaryTypes bt ON universityApplications.bursaryTypeId = bt.bursaryTypeId
INNER JOIN applicationStatusHistory ON applicationStatusHistory.applicationId = universityApplications.applicationId
INNER JOIN (
    SELECT
        applicationId,
        MAX(createdAt) AS latestCreatedAt
    FROM
        applicationStatusHistory
    GROUP BY
        applicationId
) AS latestStatus
ON universityApplications.applicationId = latestStatus.applicationId
  AND latestStatus.latestCreatedAt=applicationStatusHistory.createdAt
WHERE universityApplications.applicationGuid=@applicationGuid
AND applicationStatusHistory.statusId = (SELECT statusId FROM applicationStatus WHERE status='Awaiting student response')
GROUP BY
students.studentId, students.[name] ,students.surname, students.email, universities.universityName
,universityApplications.applicationId,
faculties.facultyName,bt.bursaryType
`;

const gender_query = "SELECT gender FROM genders";

const get_student_emails_query = `
  SELECT s.name, s.surname,
    s.email,ash.applicationId, max(ash.createdAt)
    FROM applicationStatusHistory AS ash
  INNER JOIN universityApplications AS ua
  ON ash.applicationId=ua.applicationId
  INNER JOIN students AS s
  ON ua.studentId=s.studentId
  INNER JOIN applicationStatus AS uas
  ON ash.statusId=uas.statusId
    WHERE uas.status='Pending'
    GROUP BY s.name, s.surname,
    s.email,ash.applicationId;
`;

const update_application_status_history_query = `
  INSERT INTO applicationStatusHistory (userId, applicationId, statusId)
   VALUES (@userId, @applicationId, (SELECT statusId FROM applicationStatus WHERE status=@status));
`;

const student_information_by_applicationId_procedure = `EXEC GetStudentApplicationDetailsByApplicationId @applicationGuid`;

const get_student_documents_information = `EXEC getIndividualStudentDocuments @applicationguid, @year, @userRole`;

const get_questionnaire_questions_query =
  "SELECT questionId, question FROM questions ORDER BY questionId ASC";

const change_document_status_query = `INSERT INTO invoiceStatusHistory
(userId,applicationId, statusId)
VALUES (@userId, @applicationId,
(SELECT statusId FROM invoiceStatus WHERE status = @status));
SELECT  top 1 ua.applicationGuid
FROM universityApplications ua
INNER JOIN invoiceStatusHistory ish ON ua.applicationId = ish.applicationId
WHERE ish.applicationId = @applicationId; `;

const upload_recent_academic_transcript_query = `EXEC uploadTranscriptAfterNudge @applicationGuid, @docBlobName, @semesterDescription`

const get_averages_query = `EXEC GetAverages @applicationGuid`;

const get_titles_query = "SELECT title FROM titles;"

const get_student_guid_query = `SELECT applicationGuid
FROM universityApplications
INNER JOIN students
ON students.studentId = universityApplications.studentId
WHERE students.email = @emailAddress`

const update_student_details_query = "EXEC updateStudentDetails @newName, @newSurname, @newEmail, @newContactNumber, @name, @surname, @email, @contactNumber, @department, @faculty, @university"
const insert_profile_picture_query = 'EXEC InsertStudentProfilePicture @studentId, @profilePictureBlobName'

const get_student_documents_years_query = `SELECT DISTINCT YEAR(createdAt) AS documentYears
FROM academicTranscriptsHistory`

const get_remaining_requests_query=`SELECT currentNumRequests FROM locationRequests`;
const reset_num_requests_query=`UPDATE locationRequests
SET currentNumRequests = @numRequests`
const get_application_status_history_query=`
SELECT *
FROM vw_ApplicationStatusHistoryWithDates
WHERE applicationGuid = @applicationGuid;`

const get_application_invoice_status_history_query=`
SELECT *
FROM vw_InvoiceStatusHistoryWithDates
WHERE applicationGuid = @applicationGuid;
`

const get_application_fund_distribution_history_query=`SELECT
    ish.invoiceStatusHistoryId,
    ish.userId,
    ish.applicationId,
    ua.applicationGuid,
    'Funds distributed' AS status,
    FORMAT(
        (ish.createdAt AT TIME ZONE 'UTC') AT TIME ZONE 'South Africa Standard Time',
        'MMM dd, yyyy hh:mm tt'
    ) AS fromDate,
    FORMAT(
        LEAD(ish.createdAt, 1, '9999-12-31') OVER (
            PARTITION BY ish.applicationId
            ORDER BY ish.createdAt
        ) AT TIME ZONE 'UTC' AT TIME ZONE 'South Africa Standard Time',
        'MMM dd, yyyy hh:mm tt'
    ) AS ToDate
FROM
    expenses ex
INNER JOIN
	invoiceStatusHistory ish ON ex.applicationId = ish.applicationId
INNER JOIN
    invoiceStatus s ON s.statusId = ish.statusId
INNER JOIN
    universityApplications ua ON ua.applicationId = ish.applicationId
	where applicationGuid = @applicationGuid AND [status] = 'Pending';
`

const get_application_details_update_history_query = `SELECT
    sh.studentsHistoryId,
    sh.changedBy AS userId,
    ua.applicationId,
    ua.applicationGuid,
    'Bursary details edited' AS status,
    FORMAT(
        (sh.changeDate AT TIME ZONE 'UTC') AT TIME ZONE 'South Africa Standard Time',
        'MMM dd, yyyy hh:mm tt'
    ) AS fromDate,
    FORMAT(
        LEAD(sh.changeDate, 1, '9999-12-31') OVER (
            PARTITION BY sh.applicationGuid
            ORDER BY sh.changeDate
        ) AT TIME ZONE 'UTC' AT TIME ZONE 'South Africa Standard Time',
        'MMM dd, yyyy hh:mm tt'
    ) AS ToDate
FROM
    studentsHistory sh
INNER JOIN
	universityApplications ua ON sh.applicationGuid = ua.applicationGuid
	where sh.applicationGuid = @applicationGuid AND sh.changeType = 'POST_UPDATE'`

const get_document_updates_history_query = `SELECT
    dh.documentHistoryId,
    dh.userId,
    dh.applicationId,
    ua.applicationGuid,
    [at].actionType AS status,
	dt.type,
    FORMAT(
        (dh.createdAt AT TIME ZONE 'UTC') AT TIME ZONE 'South Africa Standard Time',
        'MMM dd, yyyy hh:mm tt'
    ) AS fromDate,
    FORMAT(
        LEAD(dh.createdAt, 1, '9999-12-31') OVER (
            PARTITION BY dh.applicationId
            ORDER BY dh.createdAt
        ) AT TIME ZONE 'UTC' AT TIME ZONE 'South Africa Standard Time',
        'MMM dd, yyyy hh:mm tt'
    ) AS ToDate
FROM
    documentHistory AS dh
INNER JOIN
	universityApplications ua ON dh.applicationId = ua.applicationId
INNER JOIN
	actionTypes [at] ON dh.actionTypeId = [at].actionTypeId
INNER JOIN
	documentTypes dt ON dt.documentTypeId = dh.documentTypeId
	where ua.applicationGuid = @applicationGuid`

const can_renew_application_query = `
SELECT
    CASE
        WHEN (SELECT COUNT(StudentID)
              FROM universityApplications
              WHERE StudentID IN (
                  SELECT StudentID
                  FROM universityApplications
                  WHERE applicationGuid = @applicationGuid
              )
              AND yearOfFunding IN (YEAR(GETDATE()) - 1, YEAR(GETDATE()))
             ) >= 2 THEN 0
        ELSE 1
    END AS isRenewed;`

const get_student_min_max_allocation_query = `
    DECLARE @roleId INT;
    DECLARE @bursaryTypeId INT;
    SELECT @roleId = roleId FROM roles WHERE [role] = @role;
    SELECT @bursaryTypeId = bursaryTypeId FROM bursaryTypes WHERE bursaryType = @bursaryType;
    WITH MinAmountCTE AS (
    SELECT
        minAmount,
        createdAt,
        ROW_NUMBER() OVER (PARTITION BY minAmount ORDER BY createdAt DESC) AS rn
    FROM maxStudentAllocationAmount msaa
    WHERE msaa.allocatedForRoleId = @roleId
      AND msaa.bursaryTypeId = @bursaryTypeId
      AND msaa.allocatorGuid = @allocatorGuid
),
MaxAmountCTE AS (
    SELECT
        maxAmount,
        createdAt,
        ROW_NUMBER() OVER (PARTITION BY maxAmount ORDER BY createdAt DESC) AS rn
    FROM maxStudentAllocationAmount mapd
    WHERE mapd.allocatedForRoleId = @roleId
      AND mapd.bursaryTypeId = @bursaryTypeId
      AND mapd.allocatorGuid = @allocatorGuid
)
SELECT
    minAmountCTE.minAmount,
    maxAmountCTE.maxAmount
FROM MinAmountCTE minAmountCTE
JOIN MaxAmountCTE maxAmountCTE
    ON minAmountCTE.rn = 1 AND maxAmountCTE.rn = 1;
`

const get_student_events_query = `EXEC GetStudentEvents @studentId`

module.exports = {
  student_information_query,
  gender_query,
  get_student_emails_query,
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
};
