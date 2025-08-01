
const get_invited_users_queries = `SELECT 
    iu.invitedEmail as emailAddress,
    uni.universityName AS University,
    iu.createdAt,
    r.role AS role,
    rk.rank AS rank,
    f.facultyName AS Faculty,
	ud.universityDepartmentName as Department,
    s.status AS InvitedStatus,
	-1 as id,
    '-' as givenName,
    '-' as surname
FROM 
    [dbo].[invitedUsers] iu
INNER JOIN 
    [dbo].[universities] uni ON iu.universityId = uni.universityId
INNER JOIN 
    [dbo].[roles] r ON iu.roleId = r.roleId
INNER JOIN 
    [dbo].[ranks] rk ON iu.rankId = rk.rankId
INNER JOIN 
    [dbo].[faculties] f ON iu.facultyId = f.facultyId
INNER JOIN 
    [dbo].[invitedUserStatus] s ON iu.invitedStatusId = s.invitedUserStatusId
LEFT JOIN [dbo].[invitedUsersDepartments] iud ON iud.invitedUserId = iu.invitedUsersId
LEFT JOIN [dbo].[universityDepartments] ud ON ud.universityDepartmentId = iud.universityDepartmentId
WHERE s.status IN (SELECT status FROM [dbo].[invitedUserStatus] WHERE status IN ('Pending','Accepted')) OR  iud.invitedUserId is null`
const update_invited_user_status_query = `UPDATE invitedUsers
SET invitedStatusId = (SELECT invitedUserStatusId FROM invitedUserStatus WHERE status = @status)
WHERE invitedEmail = @email
`
const update_invited_user_email_query = `UPDATE invitedUsers
SET invitedEmail = @email
WHERE invitedEmail = @previousEmail
`
const save_user_in_db_query = `MERGE INTO [dbo].[userInformation] AS target
USING (VALUES 
    (@givenName, @surname, @emailAddress, @id, @contactNumber, @role, @rank, @Faculty, @University, @Department,@accountEnabled)
) AS source ([givenName], [surname], [emailAddress], [id], [contactNumber], [role], [rank], [Faculty], [University], [Department],[accountEnabled])
ON (target.[id] = source.[id] OR target.[emailAddress] = source.[emailAddress])
WHEN MATCHED THEN
    UPDATE SET
        target.[givenName] = source.[givenName],
        target.[surname] = source.[surname],
        target.[emailAddress] = source.[emailAddress],
        target.[ContactNumber] = COALESCE(source.contactNumber, target.contactNumber),
        target.[role] = source.[role],
        target.[Rank] = source.[rank],
        target.[Faculty] = source.[Faculty],
        target.[University] = source.[University],
        target.[Department] = source.[Department],
        target.[accountEnabled] = source.[accountEnabled],
        target.[id] = COALESCE(source.[id], target.[id])
WHEN NOT MATCHED BY TARGET THEN
    INSERT ([givenName], [surname], [emailAddress], [id], [contactNumber], [role], [rank], [Faculty], [University], [Department],[accountEnabled])
    VALUES 
    (source.[givenName], source.[surname], source.[emailAddress], source.[id], 
     source.[contactNumber], source.[role], source.[rank], source.[Faculty], 
     source.[University], source.[Department], source.[accountEnabled]);
`;

const remove_user_query =`DELETE FROM [dbo].[userInformation] WHERE id = @userId;`;

const get_student_query = `SELECT students.[name], 
	students.surname, bursaryTypes.bursaryType, 
	students.email, students.contactNumber
FROM students
INNER JOIN invitedUsers 
ON students.email = invitedUsers.invitedEmail
INNER JOIN universityApplications 
ON students.studentId = universityApplications.studentId
INNER JOIN bursaryTypes 
ON universityApplications.bursaryTypeId = bursaryTypes.bursaryTypeId
WHERE students.email = @email;
`

const get_users_query = `SELECT * FROM userInformation`
module.exports = {
    get_invited_users_queries,
    update_invited_user_status_query,
    update_invited_user_email_query,
    get_users_query,
    save_user_in_db_query,
    remove_user_query,
    get_student_query
}
