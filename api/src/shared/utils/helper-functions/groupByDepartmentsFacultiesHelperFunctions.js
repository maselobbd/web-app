function filterByFacultyAndDepartment(data, desiredFaculty, desiredDepartment) {
  const result = [];
  if (!Array.isArray(data)) {
    data = JSON.parse(data);
  }

  for(const entry of data) {
    if (
      entry.universityDepartmentName.toLowerCase() === desiredDepartment.toLowerCase()
    ) {
      result.push(entry);
    }
  }
  return result;
}
module.exports = { filterByFacultyAndDepartment };
