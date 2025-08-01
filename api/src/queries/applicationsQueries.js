const universities_query = "SELECT universityName FROM universities";
const degrees_query = "SELECT degreeName FROM degrees";
const races_query = "SELECT race FROM races";
const years_of_funding_query =
  "SELECT yearOfFunding FROM allocations WHERE allocations.universityDepartmentId = (SELECT universityDepartmentId FROM universityDepartments WHERE universityDepartmentName = @universityDepartmentName)";
const select_gender_by_id_query = `SELECT genderId FROM genders WHERE gender = @gender`;
const select_degree_by_id_query =
  "SELECT degreeId FROM degrees WHERE degreeName = @degreeName";
const select_race_by_id_query = "SELECT raceId FROM races WHERE race = @race";
const select_department_by_id_query =
  "SELECT universityDepartmentId FROM universityDepartments WHERE universityDepartmentName = @universityDepartmentName";

const insert_application_query =
  "INSERT INTO universityApplications (applicationId, universityId, degreeId, yearOfFunding, amount) VALUES (@applicationId, @universityId, @degreeId, @yearOfFunding, @amount)";
const insert_student_query =
  "INSERT INTO students (name, surname, title, email, idDocumentName, raceId, genderId) VALUES ( @name, @surname, @title, @email, @idDocumentName, @raceId, @genderId)";
const insert_application_status_history_query =
  "INSERT INTO applicationStatusHistory (userId, applicationId, statusId, createdAt) VALUES (@userId, @applicationId, @statusId, @createdAt)";

const application_procedure = `EXEC ApplicationAction @applicationId, @name, @surname, @title, @email, @idDocumentName, @race, @gender, @degreeName, @university,@faculty,@department, @yearOfFunding, @amount, @averageGrade,@motivation ,@status, @userId, @userRole, @isRenewal, @yearOfStudy, @bursaryType, @bursaryTier;`;

const select_incomplete_application_query = `SELECT
students.name,
students.surname,
students.email,
universityApplications.yearOfFunding,
universityApplications.amount,
universityApplications.motivation,
applicationStatusHistory.applicationId
FROM
students
INNER JOIN
universityApplications ON universityApplications.studentId = students.studentId
INNER JOIN
applicationStatusHistory ON universityApplications.applicationId = applicationStatusHistory.applicationId
INNER JOIN
applicationStatus ON applicationStatusHistory.statusId = applicationStatus.statusId
WHERE
applicationStatus.status = 'Draft'
AND applicationStatusHistory.userId = @userId
AND applicationStatusHistory.createdAt = (
    SELECT MAX(createdAt)
    FROM applicationStatusHistory AS ash
    WHERE ash.applicationId = universityApplications.applicationId
);
`;
const select_application_id_query = `SELECT applicationId FROM universityApplications inner join students on universityApplications.studentId=students.studentId WHERE students.email = @email`;
const select_application_id_top_by_userid = `SELECT TOP 1 applicationId
FROM applicationStatusHistory
WHERE applicationStatusHistory.userId = @userId
AND applicationStatusHistory.statusId = (SELECT statusId FROM applicationStatus WHERE status = 'Draft')`;

const delete_application_query = `UPDATE applicationStatusHistory
SET statusId = (SELECT statusId FROM applicationStatus WHERE status = 'Removed')
FROM applicationStatusHistory AS ash
INNER JOIN applicationStatus AS oldStatus ON ash.statusId = oldStatus.statusId
WHERE oldStatus.status = 'Draft'
AND ash.applicationId = @applicationId;`;

const student_application_query =
  "EXEC StudentApplicationTablesUpdates @applicationId, @studentId, @title, @other, @name, @surname, @gender, @idNumber, @race, @contactNumber, @streetAddress, @suburb, @city, @postalCode, @degree, @gradeAverage, @yearOfStudy, @userId, @applicationAcceptanceConfirmation, @citizenship, @termsAndConditions, @privacyPolicy, @idDocumentName, @academicTranscriptDocumentName, @financialStatementDocumentName, @MatricDocumentName,@dateOfBirth, @questionnaireResponseJson, @questionnaireStatus, @complexFlat, @degreeDuration, @confirmHonors;";
const update_application_query = `EXEC [dbo].[update_application_fields]
@applicationGuid,
@name,
@surname,
@email,
@contactNumber,
@yearOfFunding,
@address,
@code,
@city,
@suburb,
@university,
@faculty,
@degree,
@yearOfStudy,
@degreeDuration,
@confirmHonors,
@department,
@userId
`;
const check_existing_details_query = `SELECT TOP 1 applicationStatus.status
FROM students
INNER JOIN universityApplications on students.studentId=universityApplications.studentId
INNER JOIN(
            SELECT
                applicationId,
			    statusId,
                MAX(createdAt) AS latestCreatedAt
            FROM
                applicationStatusHistory
            GROUP BY
                applicationId,statusId
        ) AS latest_st ON  universityApplications.applicationId= latest_st.applicationId
INNER JOIN applicationStatus on latest_st.statusId = applicationStatus.statusId
WHERE students.name=@name AND students.surname=@surname AND students.email=@email AND YEAR(latest_st.latestCreatedAt)=YEAR(GETDATE()) AND applicationStatus.status NOT IN (SELECT status FROM applicationStatus WHERE status='Removed' OR status='Draft')
GROUP BY
applicationStatus.status,latest_st.applicationId
ORDER BY
latest_st.applicationId
DESC`;

const update_request_count_query = `
  UPDATE locationRequests
  SET currentNumRequests = currentNumRequests + @count 
`

const hod_to_nudge_query = `select * from vw_RenewalApplicationsSummary`

const applicants_pending_renewal = `select vra.applicationGuid, yearOfFunding,yearOfStudy, amount, ua.applicationId, studentEmail AS email,studentName AS name,studentSurname AS surname,degreeName,studentId,confirmHonors from vw_RenewalApplicationsSummary vra
INNER JOIN universityApplications ua on vra.applicationGuid = ua.applicationGuid
INNER JOIN studentApplications sa on sa.applicationId = ua.applicationId 
WHERE vra.userId = @userId`

const onboard_query = `EXEC onboardStudentProc @email, @firstName,@lastName, @idNumber,@gender,@race,@title, @phoneNumber, @addressLine,@cityTown, @postalCode, @complexFlat, @suburbDistrict, @degree, @gradeAverage,@yearOfStudy,@universityFaculty,@bursaryType, @bursaryAmount, @bursarUniversity, @bursarDepartment, @bursaryTier, @proofOfIdFile, @contractFile, @paymentFile, @invoiceFile, @userId`
module.exports = {
  universities_query,
  degrees_query,
  years_of_funding_query,
  select_gender_by_id_query,
  select_degree_by_id_query,
  select_race_by_id_query,
  select_department_by_id_query,
  insert_application_query,
  insert_student_query,
  insert_application_status_history_query,
  races_query,
  select_incomplete_application_query,
  select_application_id_query,
  select_application_id_top_by_userid,
  application_procedure,
  delete_application_query,
  student_application_query,
  update_application_query,
  check_existing_details_query,
  update_request_count_query,
  hod_to_nudge_query,
  applicants_pending_renewal,
  onboard_query
};
