const sumAmounts = (objectsWithAmounts) => {
  return (objectsWithAmounts.map(objectWithAmount => objectWithAmount.amount)).reduce((sumOfAmounts, amount) => sumOfAmounts + amount, 0)
}

const getDistinctYears = (objectsWithYears) => {
  return Array.from(new Set(objectsWithYears.map(objectWithYear => objectWithYear.year)));
}

const getDistinctBursaryTypes = (objectsWithBursaryTypes) => {
  return Array.from(new Set(objectsWithBursaryTypes.map(objectsWithBursaryType => objectsWithBursaryType.bursaryType)));
}

const getDistinctRaces = (students) => {
  return Array.from(new Set(students.map(student => student.race)))
}

const getDistinctUniversities = (objectWithUniversityName) => {
  const distinctUniversities = Array.from(new Set(objectWithUniversityName.map(objectWithUniversityName => objectWithUniversityName.universityName).filter(universityName => universityName !== "BBD")));
  return distinctUniversities.sort();
}

const filterByYear = (objectsWithYear, year) => {
  return objectsWithYear.filter(objectWithYear => objectWithYear.year === year);
}

const filterAllocationsByYear = (allocations) => {
  const distinctYears = getDistinctYears(allocations);
  return distinctYears.map(year => {
    const allocationByYear = {};
    allocationByYear[year] = sumAmounts(filterByYear(allocations, year));
    return allocationByYear;
  })
}

const filterActiveStudentsByYear = (students) => {
  const distinctYears = getDistinctYears(students);
  return distinctYears.map(year => {
    const studentsByYear = {};
    studentsByYear[year] = totalNumberOfActiveStudents(filterByYear(students, year));
    return studentsByYear
  })
}

const totalNumberOfActiveStudents = (students) => {
  const uniqueEmails = Array.from(new Set(students.map(student => student.email)));
  return uniqueEmails.length;
}

const countAndRatio = (studentsIncategory, allStudents) => {
  return {
      ratio: ( studentsIncategory.length / totalNumberOfActiveStudents(allStudents)) * 100,
      count: studentsIncategory.length,
  }
}

const filterByRace = (objectsWithRace, race) => {
  return objectsWithRace.filter(objectWithRace => objectWithRace.race === race);
}

const filterActiveStudentsByRace = (students, universityName="None") => {
  const distinctRaces = getDistinctRaces(students);
  return distinctRaces.map(race => {
    const countRatio = countAndRatio(filterByRace(students, race), students);
    return {
      race: race,
      ratio: countRatio.ratio,
      count: countRatio.count,
      universityName: universityName
    }
  })
}

const filterActiveStudentsByRaceAndYear = (students, universityName) => {
  const distinctYears = getDistinctYears(students)
  const studentRaces =  distinctYears.map(year => {
    const studentsByRaceByYear = {};
    studentsByRaceByYear[year] = filterActiveStudentsByRace(filterByYear(students, year), universityName);
    return studentsByRaceByYear;
  })
  return transformData(studentRaces);
}

const allAllocationByUniversity = (allocations) => {
  const distinctUniversities = getDistinctUniversities(allocations);
  return distinctUniversities.map(universityName => ({
    label: universityName,
    amount: sumAmounts(filterByUniversity(allocations, universityName))
  }));
}

const amountsByUniversityByYear = (objectsWithAmounts) => {
  const distinctYears = getDistinctYears(objectsWithAmounts);
  const distinctUniversities = getDistinctUniversities(objectsWithAmounts);
  const amountsByUniversityByYear =  distinctYears.map(year => {
    const amountsByYear = {};
    amountsByYear[year] = distinctUniversities.map(universityName => ({
      label: universityName,
      amount: sumAmounts(filterByUniversity(filterByYear(objectsWithAmounts, year), universityName))
    }))
    return amountsByYear;
  })
  return transformData(amountsByUniversityByYear);
}

const allAmountUsedByUniversity = (students, bursaryType=null) => {
  const distinctUniversities = getDistinctUniversities(students);
  return distinctUniversities.map(universityName => ({
    label: universityName,
    amount: sumAmounts(filterByUniversity(students, universityName, bursaryType))
  }))
}

const allStudentsByUniversity = (students) => {
  const distinctUniversities = getDistinctUniversities(students);
  return distinctUniversities.map(universityName => {
    const numberOfStudents = {};
    numberOfStudents[universityName] = totalNumberOfActiveStudents(filterByUniversity(students, universityName));
    return numberOfStudents;
  })
}

const allStudentsByUniversityByYear = (students) => {
  const distinctYears = getDistinctYears(students);
  return distinctYears.map(year => {
    const numberOfStudents = {};
    numberOfStudents[year] = allStudentsByUniversity(filterByYear(students, year));
    return numberOfStudents;
  })
}

const filterByUniversity = (objectsWithUniversity, universityName, bursaryType = null) => {
  return objectsWithUniversity.filter(object => {
    const universityMatch = object.universityName === universityName;
    const bursaryTypeMatch = !bursaryType || object.bursaryType === bursaryType;
    
    return universityMatch && bursaryTypeMatch;
  });
};

const allStudentsByRaceByUniversity = (students) => {
  const distinctUniversities = getDistinctUniversities(students);
  const activeRaces = [];
  distinctUniversities.forEach(universityName => {
    filterActiveStudentsByRace(filterByUniversity(students, universityName), universityName).forEach(activeRaceData => {
      activeRaces.push(activeRaceData);
    });
  })
  return activeRaces;
}

const filterStudentsByUniversityByRaceByYear = (students) => {
  const distinctUniversities = getDistinctUniversities(students);
  const activeRaceByUniversityByYear = distinctUniversities.map(universityName => filterActiveStudentsByRaceAndYear(filterByUniversity(students, universityName), universityName))
  return transformData(activeRaceByUniversityByYear);
}

const transformData = (data) => {
  const mergedData = {};
  data.flat().forEach(entry => {
      Object.keys(entry).forEach(year => {
          if (!mergedData[year]) {
              mergedData[year] = [];
          }
          mergedData[year] = mergedData[year].concat(entry[year]);
      });
  });
  return mergedData;
}

const predictedSpendingStudents = (students) => {
  return students.filter(student => !isNaN(parseInt(student.yearOfStudy.trim())) && (student.degreeDuration - student.yearOfStudy > 0));
}

const createRange = (start, end, step = 1) => {
  const length = Math.floor((end - start + step) / step);
  const range = Array.from({ length }, (_, i) => start + i * step);
  range.sort((a, b) => a - b);
  return range;
}

const computePredictedSpending = (students) => {
 const filteredStudents = predictedSpendingStudents(students);
  return filteredStudents.map(student => {
    let predictedValues = {};
    createRange((student.year + 1), (student.year + (student.degreeDuration - student.yearOfStudy)))
    .forEach(year => {
      predictedValues[`${year}`] = student.amount;
      Object.assign(student, { predictedValues: predictedValues })
    });
    return student;
  });
}

module.exports = {
  sumAmounts, filterAllocationsByYear,
  totalNumberOfActiveStudents, filterActiveStudentsByYear,
  filterActiveStudentsByRace, filterActiveStudentsByRaceAndYear,
  allAllocationByUniversity, amountsByUniversityByYear,
  allAmountUsedByUniversity, allStudentsByUniversity,
  allStudentsByUniversityByYear, allStudentsByRaceByUniversity,
  filterStudentsByUniversityByRaceByYear, getDistinctYears,
  getDistinctBursaryTypes, getDistinctRaces,
  computePredictedSpending, createRange,
  getDistinctUniversities,
}