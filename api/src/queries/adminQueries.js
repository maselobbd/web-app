const total_allocations_query = `SELECT SUM(amount) AS total_allocations, universities.universityName AS university
  FROM allocations
  INNER JOIN universityDepartments ON allocations.universityDepartmentId = universityDepartments.universityDepartmentId
  INNER JOIN universities ON universityDepartments.universityId = universities.universityId
  INNER JOIN universityStatus ON universities.universityStatusId = universityStatus.universityStatusId
  WHERE allocations.yearOfFunding = YEAR(GETDATE())
  AND universities.universityStatusId = (
      SELECT universityStatus.universityStatusId FROM universityStatus WHERE [status] = 'Active'
  )
  GROUP BY universities.universityName`;

const active_universities_query = `SELECT DISTINCT(universities.universityName)
    FROM universities
    INNER JOIN universityDepartments
    ON universities.universityId = universityDepartments.universityId
    WHERE universityDepartments.universityId = universities.universityId
    AND universities.universityName != 'BBD'
  ;`;

const admin_update_application_status_history_query = `
   BEGIN TRY
    BEGIN TRANSACTION;
    DECLARE @statusId INT;
    INSERT INTO applicationStatusHistory (userId, applicationId, statusId)
    VALUES (
        @userId,
        (SELECT applicationId FROM universityApplications WHERE applicationGuid = @applicationGuid),
        (SELECT statusId FROM applicationStatus WHERE [status] = @status)
    );

    SET @statusId = (SELECT statusId FROM applicationStatus WHERE [status] = @status);

    IF @statusId = (SELECT statusId FROM applicationStatus WHERE status = 'Approved')
    BEGIN
        INSERT INTO applicationStatusHistory (userId, applicationId, statusId)
        VALUES (
            @userId,
            (SELECT applicationId FROM universityApplications WHERE applicationGuid = @applicationGuid),
            (SELECT statusId FROM applicationStatus WHERE [status] = 'Awaiting fund distribution')
        );
    END

    COMMIT;
END TRY
BEGIN CATCH
    ROLLBACK;
    THROW;
END CATCH
`;

const hodUserId_query = `SELECT userId
FROM applicationStatusHistory
INNER JOIN universityApplications ua ON applicationStatusHistory.applicationId = ua.applicationId
AND ua.applicationGuid = @applicationGuid;`;

const admin_reject_student_application_query = `
  EXEC updateTablesAfterDecline
  @status,
  @applicationGuid,
  @userId,
  @reason,
  @motivation;
`;

const year_of_application_query = `SELECT
DISTINCT yearOfFunding
FROM
[dbo].[universityApplications]`;

const invoice_status_history_insert_query =
  "EXEC dbo.updateInvoicesStatusHistoryAfterContractSigned @userId, @applicationGuid, @status";

const get_applications_report_query = `
SELECT [First Name]
      ,[Surname]
      ,[Title]
      ,[Email]
      ,[ID Number]
      ,[Race]
      ,[Gender]
      ,[ID Url]
      ,[Contact Number]
      ,[Street Address]
      ,[Suburb]
      ,[City]
      ,[Postal Code]
      ,[Amount]
      ,[Average Grade]
      ,[Degree]
      ,[Year of Funding]
      ,[Application Motivation]
      ,CAST( [Date of Application] AT TIME ZONE 'UTC' AT TIME ZONE 'South Africa Standard Time' AS DATETIME ) AS [Date of Application]
      ,[University]
      ,[Faculty]
      ,[Department]
      ,[Year of Study]
      ,[Academic Transcript Url]
      ,[Matric Certificate Url]
      ,[Financial Statement Url]
      ,[Citizenship]
      ,[Agreed to Terms and Conditions]
      ,[Read Privacy Policy]
      ,[Status]
      ,[BBD Description]
      ,[University Description]
      ,CAST( [Status Date] AT TIME ZONE 'UTC' AT TIME ZONE 'South Africa Standard Time' AS DATETIME ) AS [Status Date]
      ,[Reason]
      ,[Declined Reason Motivation]
  FROM [applicationsReportView]
  WHERE (@year = 0 AND [Year of Funding] IN (select [Year of Funding] from applicationsReportView))
  OR ([Year of Funding] = @year);
`;

const distinct_years_of_funding_query =
  "SELECT DISTINCT(yearOfFunding) as year FROM totalFundHistory;";
const distinct_bursary_types_query =
  "SELECT bursaryType FROM bursaryTypes;";
const admin_dashboard_procedure = `EXEC GetGroupedApplicationDetails @universityName, @year, @fullName, @bursaryType`;

const active_bursaries_query = `EXEC [dbo].[GetActiveBursaryApplications] @universityName,@year,@fullName`;

const save_student_payment_query = `EXEC InsertPaymentAndStatusHistory @file, @applicationId, @userId, @paymentFor`;
const email_failed_student_application_query = `EXEC GetFailedStudentDetails @applicationGuid`;

const insert_expense_query = `EXEC InsertExpense
@accommodation,
@tuition,
@meals,
@other,
@otherDescription,
@applicationId,
@userId
`;

const get_application_documents =
  "EXEC getApplicationDocuments @applicationGuid, @documentType, @status";
const upload_admin_document =
  "EXEC insertAdminDocuments @file, @applicationId, @userId, @status, @documentType, @expenseCategory, @reason";
const get_expense_types = `SELECT * FROM [dbo].[InvoiceOrPaymentFor];`;
const get_expense_types_query = `SELECT TOP 1 accommodation,tuition,meals,other, expensesId FROM expenses
  INNER JOIN universityApplications on expenses.applicationId=universityApplications.applicationId
  WHERE universityApplications.applicationGuid=@applicationGuid
  GROUP BY
  expensesId,accommodation,tuition,meals,other
  ORDER BY expensesId  DESC;`;
const update_invoice_status_query = `UPDATE adminDocuments SET adminDocuments.isDeleted=@isRemoved WHERE applicationId=@applicationId AND expenseCategoryId=(SELECT InvoiceOrPaymentFor.InvoicePaymentForId FROM InvoiceOrPaymentFor WHERE [for]=@expenseCategory) `;
const get_student_questionnaire_responses_query =
  "EXEC GetStudentResponses @applicationId";
const get_expenses_for_application_query = `SELECT TOP (1000)
    [expensesId],
    [accommodation],
    [tuition],
    [meals],
    [other],
    [applicationId]
FROM
    [dbo].[expenses]
WHERE
    [applicationId] =@applicationId; `;

const students_to_nudge_query = `EXEC [dbo].[GetStudentDetailsForNudging] @year, @semesterDescription`;

const add_university_proc = `EXEC AddUniversity @university, @faculty`;
const all_universities_query = ` SELECT
universities.universityName,
STRING_AGG(universityDepartments.universityDepartmentName, ', ') AS departmentNames
FROM
universities
INNER JOIN
universityDepartments
ON
universities.universityId = universityDepartments.universityId
INNER JOIN
faculties
ON
faculties.facultyId = universityDepartments.facultyId
WHERE universityDepartments.departmentStatusId = (SELECT departmentStatusId FROM departmentStatus WHERE departmentStatus.departmentStatus='Active')
GROUP BY
universities.universityName  `;
const all_faculties_query = `SELECT facultyName FROM faculties`;
const add_department_proc = `EXEC add_department_proc @universityName, @facultyName, @departmentName, @userId, @newFaculty`;
const get_departments_and_university_query = `
WITH DepartmentDetails AS (
    SELECT
        u.universityName,
        d.universityDepartmentName AS DepartmentName,
        f.facultyName AS FacultyName,
        ds.departmentStatus AS Status
    FROM
        universities u
    LEFT JOIN
        universityDepartments d ON u.universityId = d.universityId
    LEFT JOIN
        faculties f ON f.facultyId = d.facultyId
    LEFT JOIN
        departmentStatus ds ON d.departmentStatusId = ds.departmentStatusId
    WHERE
        (ds.departmentStatus IN ('Active', 'Disabled') OR ds.departmentStatusId IS NULL)
        AND (f.facultyId IS NULL OR f.facultyName = @facultyName OR @facultyName IS NULL)
        AND (u.universityName = @universityName OR @universityName IS NULL)
)
SELECT
    universityName AS [UniversityName],
    (
        SELECT
            DepartmentName AS departmentName,
            Status AS status,
            FacultyName AS faculty
        FROM
            DepartmentDetails d
        WHERE
            d.universityName = u.universityName
        FOR JSON PATH
    ) AS Departments
FROM
    DepartmentDetails u
GROUP BY
    universityName;
`;

const get_students_to_nudge_query = `
DECLARE
    @semesterDescription VARCHAR(30),
    @targetYear INT,
    @needFinals BIT;
IF MONTH(GETDATE()) BETWEEN 7 AND 12
BEGIN
    SET @semesterDescription = 'First semester';
    SET @targetYear = YEAR(GETDATE());
    SET @needFinals = 1;
END
ELSE
BEGIN
    SET @semesterDescription = 'Second semester';
    SET @targetYear = YEAR(GETDATE()) - 1;
    SET @needFinals = 0;
END
;WITH TranscriptStatus AS (
    SELECT
      sa.applicationId,
      us.semesterDescription
    FROM academicTranscriptsHistory ath
    INNER JOIN studentApplications sa ON sa.studentApplicationId = ath.studentApplicationId
    INNER JOIN universitySemesters us ON ath.universitySemesterId = us.semesterId
)
SELECT DISTINCT
    YEAR(ash.createdAt) AS year,
    s.[name] + ' ' + s.surname AS fullName,
    s.email AS email,
    u.universityName AS universityName,
    ua.applicationGuid AS applicationGuid,
    ua.applicationId AS applicationId,
	bt.bursaryType,
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM TranscriptStatus ts
            WHERE ts.applicationId = ua.applicationId AND ts.semesterDescription = 'First semester'
        ) THEN 'Exists'
        ELSE 'Not Exists'
    END AS semesterOneTranscriptExists,
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM TranscriptStatus ts
            WHERE ts.applicationId = ua.applicationId AND ts.semesterDescription = 'Second semester'
        ) THEN 'Exists'
        ELSE 'Not Exists'
   END AS semesterTwoTranscriptExists
FROM
    universityApplications ua
INNER JOIN
    applicationStatusHistory ash ON ua.applicationId = ash.applicationId
INNER JOIN
	bursaryTypes bt ON ua.bursaryTypeId = bt.bursaryTypeId
INNER JOIN
    universityDepartments ud ON ua.universityDepartmentId = ud.universityDepartmentId
INNER JOIN
    students s ON ua.studentId = s.studentId
INNER JOIN
    universities u ON ud.universityId = u.universityId
INNER JOIN
    applicationStatus appStatus ON ash.statusId = appStatus.statusId
INNER JOIN
    (
     SELECT
         ish.applicationId,
         ish.statusId,
         ish.createdAt
     FROM invoiceStatusHistory AS ish
     INNER JOIN (
         SELECT
             applicationId,
             MAX(createdAt) AS latestInvCreatedAt
         FROM invoiceStatusHistory
         GROUP BY applicationId
     ) AS latest_inv ON ish.applicationId = latest_inv.applicationId AND ish.createdAt = latest_inv.latestInvCreatedAt
     INNER JOIN invoiceStatus invStatus ON ish.statusId = invStatus.statusId
     WHERE invStatus.status = 'Approved'
    ) AS latest_inv ON ua.applicationId = latest_inv.applicationId
WHERE
    appStatus.[status] = 'Approved'
	AND ua.applicationId IN (SELECT applicationId FROM vw_latestNudgedStudents)
    AND ash.createdAt = (
        SELECT MAX(createdAt)
        FROM applicationStatusHistory AS ashSub
        WHERE ashSub.applicationId = ua.applicationId
    )
    AND (
    (@needFinals = 1 AND (
     (
       NOT EXISTS (
         SELECT 1
         FROM TranscriptStatus ts
         WHERE ts.applicationId = ua.applicationId AND ts.semesterDescription = 'First semester'
       )
         AND YEAR(ash.createdAt) = @targetYear
       )
       OR
     (
       NOT EXISTS (
         SELECT 1
         FROM TranscriptStatus ts
         WHERE ts.applicationId = ua.applicationId AND ts.semesterDescription = 'Second semester'
       )
         AND YEAR(ash.createdAt) = @targetYear - 1
       )
     ))
     OR
    (@needFinals = 0 AND (
     NOT EXISTS (
       SELECT 1
       FROM TranscriptStatus ts
       WHERE ts.applicationId = ua.applicationId AND ts.semesterDescription = 'Second semester'
     )
       AND YEAR(ash.createdAt) = @targetYear
     ))
    )
ORDER BY
    ua.applicationId DESC;
`;

const declined_applications_query = `SELECT
    outerQuery.universityName,
    outerQuery.universityId,
    outerQuery.applicationCount,
    (
        SELECT
            CONCAT(student.name, ' ', student.surname) AS fullName,
            universityApplication.amount AS amount,
            universityApplication.applicationId AS applicationId,
            universityApplication.applicationGuid AS applicationGuid,
            applicationStatus.status AS status,
            declinedDetails.reason,
            declinedDetails.motivation
        FROM
            dbo.[universityApplications] AS universityApplication
        INNER JOIN
            dbo.[students] AS student ON universityApplication.studentId = student.studentId
        INNER JOIN
            dbo.[universityDepartments] AS universityDepartment ON universityApplication.universityDepartmentId = universityDepartment.universityDepartmentId
        INNER JOIN
            dbo.[universities] AS university ON universityDepartment.universityId = university.universityId
        INNER JOIN
            dbo.[applicationStatusHistory] AS applicationStatusHistory ON universityApplication.applicationId = applicationStatusHistory.applicationId
        INNER JOIN
            dbo.[applicationStatus] AS applicationStatus ON applicationStatusHistory.statusId = applicationStatus.statusId
        LEFT JOIN (
            SELECT
                ish.applicationId,
                invoiceStatus.status AS inv_status,
                ish.statusId,
                ish.createdAt AS invCreatedAt
            FROM
                dbo.invoiceStatusHistory AS ish
            INNER JOIN (
                SELECT
                    applicationId,
                    MAX(createdAt) AS latestInvCreatedAt
                FROM
                    dbo.invoiceStatusHistory
                GROUP BY
                    applicationId
            ) AS latest_inv ON ish.applicationId = latest_inv.applicationId
            AND ish.createdAt = latest_inv.latestInvCreatedAt
            LEFT JOIN
                dbo.invoiceStatus ON ish.statusId = invoiceStatus.statusId
        ) AS latest_inv ON universityApplication.applicationId = latest_inv.applicationId
        LEFT JOIN (
            SELECT
                drh.applicationStatusHistoryId,
                dr.reason,
                dm.motivation
            FROM
                dbo.declinedReasonsHistory AS drh
            INNER JOIN dbo.declinedReasons AS dr ON drh.reasonId = dr.reasonId
            INNER JOIN dbo.declinedMotivations AS dm ON drh.declinedReasonsHistoryId = dm.declinedReasonsHistoryId
        ) AS declinedDetails ON declinedDetails.applicationStatusHistoryId = applicationStatusHistory.applicationStatusHistoryId
        WHERE
            university.universityName = outerQuery.universityName
            AND applicationStatus.status IN ('Rejected', 'Terminated')
            AND applicationStatusHistory.createdAt = (
                SELECT MAX(createdAt)
                FROM dbo.[applicationStatusHistory] AS ASH
                WHERE ASH.applicationId = universityApplication.applicationId
            )
        FOR JSON PATH
    ) AS details
FROM
(
    SELECT
        university.universityName,
        university.universityId,
        COUNT(universityApplication.applicationId) AS applicationCount
    FROM
        dbo.[universityApplications] AS universityApplication
    INNER JOIN
        dbo.[universityDepartments] AS universityDepartment ON universityApplication.universityDepartmentId = universityDepartment.universityDepartmentId
    INNER JOIN
        dbo.[universities] AS university ON universityDepartment.universityId = university.universityId
    INNER JOIN
        dbo.[applicationStatusHistory] AS applicationStatusHistory ON universityApplication.applicationId = applicationStatusHistory.applicationId
    INNER JOIN
        dbo.[applicationStatus] AS applicationStatus ON applicationStatusHistory.statusId = applicationStatus.statusId
    WHERE
        applicationStatus.status IN ('Rejected', 'Terminated')
        AND applicationStatusHistory.createdAt = (
            SELECT MAX(createdAt)
            FROM dbo.[applicationStatusHistory] AS ASH
            WHERE ASH.applicationId = universityApplication.applicationId
        )
    GROUP BY
        university.universityName,
        university.universityId
) AS outerQuery;
`;

const average_for_cron_query = `SELECT academicTranscriptsHistory.academicTranscriptsHistoryId,
		docBlobName,
		semesterGradeAverage,
		universities.universityName,
		universities.averageToolConfidence,
		universityApplications.averageGrade,
		universityApplications.applicationGuid,
		semesters.semesterDescription
FROM academicTranscriptsHistory
INNER JOIN (
			SELECT semesterDescription,
			academicTranscriptsHistory.academicTranscriptsHistoryId
			FROM universitySemesters
			INNER JOIN academicTranscriptsHistory
			ON universitySemesters.semesterId = academicTranscriptsHistory.universitySemesterId
			WHERE semesterId = academicTranscriptsHistory.universitySemesterId
) AS semesters
ON academicTranscriptsHistory.academicTranscriptsHistoryId = semesters.academicTranscriptsHistoryId
INNER JOIN studentApplications
ON academicTranscriptsHistory.studentApplicationId = studentApplications.studentApplicationId
INNER JOIN universityApplications
ON studentApplications.applicationId = universityApplications.applicationId
INNER JOIN universityDepartments
ON universityApplications.universityDepartmentId = universityDepartments.universityDepartmentId
INNER JOIN universities
ON universityDepartments.universityId = universities.universityId
WHERE semesterGradeAverage IS NULL
`;

const update_calculated_averages_query =
  "EXEC UpdateAverage @academicTranscriptsHistoryId, @average";

const store_user_query = `EXEC StoreUserData @inviterUserId, @invitedEmail,  @university, @department, @faculty, @role, @rank,@invitedUserStatus`;

const update_application_bursary_amount_query = `EXEC UpdateApplicationAmount @applicationGuid, @newAmount, @userId`;

const get_invited_user_by_email = `SELECT TOP 1 invitedEmail,
	universities.universityName,
	roles.[role],
	ranks.[rank],
	faculties.facultyName,
	invitedUserDepts.universityDepartmentName
FROM invitedUsers
JOIN universities
ON invitedUsers.universityId = universities.universityId
JOIN roles
ON invitedUsers.roleId = roles.roleId
JOIN ranks
ON invitedUsers.rankId = ranks.rankId
JOIN faculties
ON invitedUsers.facultyId = faculties.facultyId
JOIN invitedUserStatus
ON invitedUsers.invitedStatusId = invitedUserStatus.invitedUserStatusId
LEFT JOIN (
	SELECT invitedUserId, universityDepartments.universityDepartmentName
	FROM invitedUsersDepartments
	JOIN universityDepartments
	ON invitedUsersDepartments.universityDepartmentId = universityDepartments.universityDepartmentId
) AS invitedUserDepts
ON invitedUsers.invitedUsersId = invitedUserDepts.invitedUserId
WHERE invitedEmail = @email
AND invitedUserStatus.[status] IN (
	'Accepted', 'Active'
);
`;

const post_existing_application_query = `EXEC dataTransfer @name, @surname, @email,@race,@gender, @contactNumber,@city,@idNumber,@universityDepartmentName,@averageGrade,@degreeName,@dateOfApplication,@bursaryAmount,@universityName, @yearOfStudy,@accommodation,@tuition,@meals,@Other,@otherDescription`;

const get_cron_config_query = "SELECT config FROM systemConfigurations WHERE configType = @configType";

const set_cron_config_query = "EXEC setCronConfig @config, @configType";
const get_studentProfileDetails_query = `DECLARE @role NVARCHAR(50);
SET @role = (SELECT role FROM roles WHERE role = 'student');
SELECT students.name AS givenName,
       students.surname,
       students.contactNumber,
       students.email AS emailAddress,
       universities.universityName AS university,
       bursaryTypes.bursaryType,
       faculties.facultyName AS faculty,
       universityDepartments.universityDepartmentName AS department,
       @role AS role,
       NEWID() AS id
FROM students
INNER JOIN universityApplications
ON universityApplications.studentId = students.studentId
INNER JOIN bursaryTypes ON bursaryTypes.bursaryTypeId = universityApplications.bursaryTypeId
INNER JOIN universityDepartments
ON universityDepartments.universityDepartmentId = universityApplications.universityDepartmentId
INNER JOIN universities
ON universities.universityId = universityDepartments.universityId
INNER JOIN faculties
ON faculties.facultyId = universityDepartments.facultyId
WHERE universityApplications.applicationId = @applicationId
AND @role = 'student';`;
const update_department_name_query = `EXEC  updateDepartmentProc @university,@oldDepartment,@newDepartment, @userId`;
const update_department_status_query = `EXEC updateDepartmentStatusProc @university, @department,@faculty, @status, @userId`;
const non_responsive_student_application_query = `SELECT
    s.email,
    s.name,
    ua.applicationGuid,
    ua.applicationId,
    bt.bursaryType,
    DATEDIFF(DAY, MAX(ash.createdAt), GETDATE()) AS DaysDifference
FROM
    students s
INNER JOIN
    universityApplications ua ON s.studentId = ua.studentId
INNER JOIN
    applicationStatusHistory ash ON ash.applicationId = ua.applicationId
INNER JOIN
    applicationStatus ast ON ash.statusId = ast.statusId
INNER JOIN bursaryTypes bt ON bt.bursaryTypeId = ua.bursaryTypeId
WHERE
    ast.status = 'Awaiting student response'
    AND ash.createdAt = (
        SELECT MAX(createdAt)
        FROM applicationStatusHistory
        WHERE applicationId = ua.applicationId
    )
GROUP BY
    s.email,
    s.name,
    ua.applicationGuid,
    ua.applicationId,
	bt.bursaryType;
`;
const average_grade_calculation_query = `UPDATE academicTranscriptsHistory
SET semesterGradeAverage = @semesterGradeAverage
WHERE studentApplicationId = (
    SELECT TOP 1 sa.studentApplicationId
    FROM studentApplications sa
    WHERE sa.applicationId = @applicationId
)
AND universitySemesterId = (
    SELECT semesterId
    FROM universitySemesters
    WHERE semesterDescription = @semesterDescription
);

`;

const get_applications_awaiting_exec_approval_query = `WITH LatestStatus AS (
    SELECT
        ash.applicationId,
        ash.statusId,
        ash.createdAt,
        ash.lastEmailSentTime,
        ROW_NUMBER() OVER (PARTITION BY ash.applicationId ORDER BY ash.createdAt DESC) AS rn
    FROM applicationStatusHistory AS ash
)
SELECT DISTINCT
    a.applicationId,
    a.applicationGuid,
    ls.statusId,
    s.[status],
    ls.createdAt,
    ls.lastEmailSentTime,
    ls.createdAt
FROM LatestStatus AS ls
JOIN applicationStatus AS s ON ls.statusId = s.statusId
JOIN universityApplications AS a ON ls.applicationId = a.applicationId
WHERE ls.rn = 1
AND s.[status] = 'Awaiting executive approval'
AND ls.createdAt <= DATEADD(DAY, -7, GETUTCDATE())
ORDER BY ls.createdAt DESC;
`;

const update_student_document_query=`EXEC updateDocumentAction @documentType,@previousFile,@newFile,@userId,@applicationGuid,@reasonForUpdate,@markAsDeleted,@actionType`

const get_maintenance_configuration_query = `SELECT config FROM systemConfigurations WHERE configType = @configType`

const update_last_email_sent_query = `
 INSERT INTO nudgeHistory (applicationId, nudgeReasonId, nudgerUserId, nudgedEmail)
VALUES ((SELECT applicationId FROM universityApplications WHERE applicationGuid = @applicationGuid), (SELECT nudgeReasonId FROM nudgeReason WHERE nudgeReason=@nudgeReason), @userId , @email);
`;

const get_all_allocations_data_per_university_query = `IF OBJECT_ID('vw_yearlySpending', 'V') IS NOT NULL
SELECT * FROM vw_yearlySpending WHERE amount > 0`

const get_all_applications_students_race_query = `IF OBJECT_ID('vw_activeApplicationsReportDetails', 'V') IS NOT NULL
SELECT * FROM vw_activeApplicationsReportDetails`

const save_file_query = `INSERT INTO [dbo].[adminDocuments](documentBlobName,amount,applicationId,documentTypeId, expenseCategoryId) VALUES(@file,@amount,@applicationId,(SELECT documentTypeId FROM documentTypes WHERE documentTypes.[type] = @documentType),4)`

const university_stats_query=`EXEC GetUniversityStats @universityName, @year, @rank, @bursaryType`

const bursaries_summary_query = `SELECT SUM(amount) AS FundAllocation, bt.bursaryType FROM allocations al inner join bursaryTypes bt
on bt.bursaryTypeId = al.bursaryTypeId
WHERE yearOfFunding = @year and bt.bursaryType = @bursaryType
group by bt.bursaryType`

const get_declined_reasons_query = `SELECT reason FROM declinedReasons`

module.exports = {
  total_allocations_query,
  active_universities_query,
  admin_update_application_status_history_query,
  hodUserId_query,
  admin_reject_student_application_query,
  invoice_status_history_insert_query,
  get_applications_report_query,
  admin_dashboard_procedure,
  active_bursaries_query,
  declined_applications_query,
  distinct_years_of_funding_query,
  distinct_bursary_types_query,
  save_student_payment_query,
  email_failed_student_application_query,
  insert_expense_query,
  get_expense_types,
  get_application_documents,
  upload_admin_document,
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
  year_of_application_query,
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
  get_maintenance_configuration_query,
  update_last_email_sent_query,
  get_maintenance_configuration_query,
  get_all_allocations_data_per_university_query,
  get_all_applications_students_race_query,
  save_file_query,
  university_stats_query,
  bursaries_summary_query,
  get_declined_reasons_query
};
