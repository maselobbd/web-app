function getGradeAverage(academicAverageStr) {
    const numbers = academicAverageStr.match(/\d+/g).map(Number);
    return (numbers[0] + numbers[1]) / 2;
  };

module.exports = { getGradeAverage }