const filterAmounts = (departments, allocations, requestedAmounts, approvedAmounts) => {
    return departments.map(department =>{ 
        const totalAllocated = (allocations.filter(dept => dept.universityDepartmentName === department))[0]
        const totalRequested = (requestedAmounts.filter(dept => dept.universityDepartmentName === department))[0]
        const totalApproved = (approvedAmounts.filter(dept => dept.universityDepartmentName === department))[0]
        return {
        departmentName: department,
        departmentTotalAllocationAmount: totalAllocated ? totalAllocated.total_department_allocation : 0,
        departmentTotalRequestedAmount: totalRequested ? totalRequested.total_requested_amount : 0,
        departmentTotalApprovedAmount: totalApproved ? totalApproved.total_approved_amount : 0
      }})
}

const allocationsHelper = (departmentInformation) => {
  const departments = []
  for (let department of departmentInformation) {
    if(department.universityName !== 'BBD') {
      departments.push({
          universityName: department.universityName,
          departmentName: department.departmentName,
          departmentTotalRequestedAmount: department.departmentTotalRequestedAmount 
          ? department.departmentTotalRequestedAmount : 0,
          departmentTotalApprovedAmount: department.departmentTotalApprovedAmount
          ? department.departmentTotalApprovedAmount : 0,
          departmentTotalAllocationAmount: department.departmentTotalAllocationAmount
          ? department.departmentTotalAllocationAmount : 0 
      })
    }
  }
  return departments
}

module.exports = { filterAmounts, allocationsHelper } 