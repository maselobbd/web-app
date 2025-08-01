const processStudentAverages = (rawAverages) => {
    if (!rawAverages || !Array.isArray(rawAverages) || rawAverages.length === 0) {
      return []; 
    }
  
    const validAverages = rawAverages.filter(avg => avg && avg.uploadDate != null);
  
    const matricEntry = validAverages.find(avg => avg.semesterDescription === "Matric");
    const otherEntries = validAverages.filter(avg => avg.semesterDescription !== "Matric");
  
    const latestOtherEntriesMap = new Map();
    otherEntries.forEach(avg => {
      if (avg && avg.semesterDescription != null) { 
        const existing = latestOtherEntriesMap.get(avg.semesterDescription);
        if (!existing || new Date(avg.uploadDate) > new Date(existing.uploadDate)) {
          latestOtherEntriesMap.set(avg.semesterDescription, avg);
        }
      }
    });
  
    let processedAverages = [];
    if (matricEntry) {
      processedAverages.push(matricEntry);
    }
    processedAverages.push(...latestOtherEntriesMap.values());
  
    const hasFirstOrSecondSemester = processedAverages.some(
      avg => avg.semesterDescription === "First semester" || avg.semesterDescription === "Second semester"
    );
  
    if (hasFirstOrSecondSemester) {
      processedAverages = processedAverages.filter(
        avg => avg.semesterDescription !== "Initial Transcript"
      );
    }
  
    return processedAverages;
  };

  module.exports = { processStudentAverages };