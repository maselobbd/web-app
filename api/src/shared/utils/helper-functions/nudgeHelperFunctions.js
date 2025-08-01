const { createTVP } = require('../../db-connections');

const mapStudentsPerBursaryType = (bursaryType, studentList) => {
  return studentList.filter(student => student.bursaryType.toLowerCase() === bursaryType.toLowerCase());
}

const filterBySemester = (studentList) => {
  return {
    firstSemester: studentList
    .filter(student => student.semesterOneTranscriptExists.toLowerCase() === 'not exists'),
    secondSemester: studentList
    .filter(student => student.semesterTwoTranscriptExists.toLowerCase() === 'not exists')
  }
}

const mapEmailList = (studentList) => {
  return studentList.map(student => ({
    address: student.email,
    displayName: student.fullName,
  }))
}

const getStudentsToNudgeTvp = (studentsToNudgeList) => {
  const nudgeHistoryColumns = [
    { name: 'applicationId', type: 'INT' },
    { name: 'nudgedEmail', type: 'VARCHAR', length: 256 }
  ];
  const studentsToNudgeTVP = createTVP(studentsToNudgeList, nudgeHistoryColumns, 'nudgeHistoryTVP');
  return studentsToNudgeTVP;
}

module.exports = {
  mapStudentsPerBursaryType,
  filterBySemester,
  mapEmailList,
  getStudentsToNudgeTvp,
}