const { db } = require("../shared/db-connections");
const {
  get_invited_users_queries,
  update_invited_user_status_query,
  update_invited_user_email_query,
  get_users_query,
  save_user_in_db_query,
  remove_user_query,
  get_student_query
} = require("../queries/userQueries");

const get_invited_users_data = async () => {
    const connection = await db();
    const invitedUsers = await connection
      .timed_query(get_invited_users_queries, "get_invited_users_queries");
    return invitedUsers["recordset"];
  };
const update_invited_user_status_data = async (email,status) =>{
  const connection = await db();
    const invitedUsers = await connection.input('email',email)
    .input("status",status)
      .timed_query(update_invited_user_status_query, "update_invited_user_status");
    return invitedUsers["recordset"];
}
const user_email_update_data = async (previousEmail,email) =>{
  const connection = await db();
  const updateEmail = await connection.input('email',email)
  .input("previousEmail",previousEmail)
    .timed_query(update_invited_user_email_query, "update_invited_user_email_query");
  return updateEmail["recordset"];
}
const get_users_from_db_data = async ()=>
{
  const connection = await db();
  const getUsers = await connection.timed_query(get_users_query,"get_users_query");
  return getUsers["recordset"];
}
const save_user_in_db_data = async (user) =>{
  const connection = await db();
  const saveUser = await connection.input("emailAddress",user.emailAddress.toLowerCase())
  .input("givenName", user.givenName || '')
  .input("surname", user.surname || '')
  .input("id", user.id)
  .input("University",user.University || user.university)
  .input("Department",user.Department || user.department)
  .input("Faculty",user.Faculty || user.faculty)
  .input("contactNumber",user.contactNumber ? user.contactNumber : null)
  .input("role",user.role)
  .input("rank",user.rank)
  .input("accountEnabled", user.accountEnabled)
  .timed_query(save_user_in_db_query,"save_user_in_db_query")
  return saveUser["recordset"]
}
const remove_user_from_lookup_table_data = async (userId)=>{
  const connection = await db();
  const removeUser = await connection.input("userId",userId)
  .timed_query(remove_user_query, "remove_user_from_lookup_table_data")
  return removeUser["recordset"];
}
const get_student_data = async(email) => {
  const connection = await db();
  const student = await connection.input("email", email)
    .timed_query(get_student_query, "get_student_data");
  return student["recordset"];
}
module.exports = {
    get_invited_users_data,
    update_invited_user_status_data,
    user_email_update_data,
    get_users_from_db_data,
    save_user_in_db_data,
    remove_user_from_lookup_table_data,
    get_student_data
}