const {
  total_amount_data,
  approved_amount_data,
  requested_amount_data,
  total_funds_for_university_hod_data,
  valid_department_data,
  total_allocated_amount_for_university_data,
  total_requested_amount_for_university_data,
  total_approved_amount_for_university_data,
  fund_allocations_data,
  get_fundTotal_allocated_unallocated_amounts_data,
  move_funds_data,
  insert_new_allocations_data,
  reallocations_data,
  insert_into_totalFundHistory_data
} = require("../data-facade/allocationsData");
const { distinct_year_of_study_data, distinct_bursary_types_data } = require("../data-facade/adminData");
const { get_faculty_allocations_data } = require("../data-facade/universityData");
const { student_min_max_allocation_data } = require("../data-facade/studentData");
const { getDistinctYears, getDistinctBursaryTypes } = require("../shared/utils/helper-functions/reportsHelperFunctions");
const { allocationsHelper } = require("../shared/utils/helper-functions/allocationsHelperFunctions");
const { roles } = require("../shared/utils/enums/rolesEnum");
const ResponseStatus = require("../shared/utils/enums/responseStatusEnum");
const ErrorMessages = require("../shared/utils/enums/internalServalErrorMessageEnum");
const validatorTypeEnum = require("../shared/utils/enums/validatorTypeEnum");
const feedbackMessages = require("../shared/utils/enums/feedbackMessagesEnum");
const bursaryTypes = require("../shared/utils/enums/bursaryTypesEnum");


const getApprovedTotalAndRequestedAmounts = async (
  request,
  context,
  locals,
) => {
  try {
    const bursaryType = bursaryTypes.UKUKHULA // Will mutate to accomodate other bursaries. Value must come from front end, feat not yet implemented
    const totalAllocation = await total_amount_data(bursaryType);

    const approvedAmount = await approved_amount_data(bursaryType, applicationStatus = 'Approved');

    const requestedAmount = await requested_amount_data(bursaryType);

    const allocationUsage = {
      totalAllocation: totalAllocation,
      approvedAmount: approvedAmount,
      requestedAmount: requestedAmount,
      maxAllocationPerStudent: 250000,
    };

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: allocationUsage,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
      ErrorMessages.internalServerError,
    };
  }
};

const GetTotalRequestedAmountForUniversityHOD = async (
  request,
  context,
  locals,
) => {
  try {
    const university = request.query.get("university");
    const department = request.query.get("department");
    const faculty = request.query.get("faculty");
    const year = Number(request.query.get("year"));
    const role = locals.role;
    const bursaryType = bursaryTypes.UKUKHULA;
    const data = {university,department,faculty,year,role,bursaryType}
    let allocations;

    const yearsOfFunding = await distinct_year_of_study_data();
    const departmentAmount = await total_funds_for_university_hod_data(
      data
    );

    allocations = {
      totalAllocation: departmentAmount[0]?.totalAllocationAmount || 0,
      approvedAmount: departmentAmount[0]?.totalApprovedAmount || 0,
      requestedAmount: departmentAmount[0]?.totalRequestedAmount || 0,
      maximumPerStudent: departmentAmount[0]?.maxPerStudent || 0,
      minimumPerStudent: departmentAmount[0]?.minPerStudent || 0,
      years: getDistinctYears(yearsOfFunding),

    };

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: allocations,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error.message}`,
    };
  }
};

const checkValidDepartment = async (request, context, locals) => {
  try {
    const university = request.query.get("university");
    const department = request.query.get("department");
    const faculty = request.query.get("faculty");
    const departmentState = await valid_department_data(
      university,
      department,
      faculty,
    );
    const result = departmentState > 0 ? true : false;

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: result,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError}  ${error.message}`,
    };
  }
};

const GetTotalRequestedAmountForUniversity = async (request, context, locals) => {
  try {
    const university = request.query.get("university");
    const year = Number(request.query.get("year"));
    const totalAllocation =
      await total_allocated_amount_for_university_data(university,year,bursaryTypes.UKUKHULA);
    const requestedAmount =
      await total_requested_amount_for_university_data(university,year,bursaryTypes.UKUKHULA);
    const approvedAmount =
      await total_approved_amount_for_university_data(university,year,bursaryTypes.UKUKHULA);
    const yearsOfFunding = await distinct_year_of_study_data();
    const distinctBursaryTypes = await distinct_bursary_types_data();

    const allocations = {
      totalAllocation: totalAllocation[0].total_allocation_amount,
      requestedAmount: requestedAmount[0].total_requested_amount,
      approvedAmount: approvedAmount[0].total_approved_amount,
      years: getDistinctYears(yearsOfFunding),
      bursaryTypes: getDistinctBursaryTypes(distinctBursaryTypes),
    };
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: allocations,
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error.message}`,
    };
  }
};

const GetFundAllocationsData = async (request, context, locals) => {
  try {
    const year = request.query.get("year");
    const activeUniversitiesDepartmentsFundAllocationsData = allocationsHelper(await fund_allocations_data(year,null,bursaryTypes.UKUKHULA));
    const universities = [...new Set(activeUniversitiesDepartmentsFundAllocationsData.map(
      departmentInfo => departmentInfo.universityName
    ))];
    const activeUniversitiesFundAllocationsData = universities.map(
      university => {
        let requestedAmount = 0
        let approvedAmount = 0
        let totalAllocatedAmount = 0
        for (let departmentInfo of activeUniversitiesDepartmentsFundAllocationsData) {
          if(university === departmentInfo.universityName) requestedAmount += departmentInfo.departmentTotalRequestedAmount;
          if(university === departmentInfo.universityName) approvedAmount += departmentInfo.departmentTotalApprovedAmount;
          if(university === departmentInfo.universityName) totalAllocatedAmount += departmentInfo.departmentTotalAllocationAmount;
        }
        return {
          universityName: university,
          universityTotalRequested: requestedAmount,
          universityTotalApproved : approvedAmount,
          universityTotalAllocated: totalAllocatedAmount
        }
      }
    )
    activeUniversitiesFundAllocationsData.sort((universityA, universityB) => universityB.universityTotalAllocated - universityA.universityTotalAllocated);
    activeUniversitiesDepartmentsFundAllocationsData.sort((departmentA, departmentB) => departmentB.departmentTotalAllocationAmount - departmentA.departmentTotalAllocationAmount)
    const fundAmounts = await get_fundTotal_allocated_unallocated_amounts_data(year);

    const minMaxResult = await student_min_max_allocation_data(roles.ADMIN, bursaryTypes.UKUKHULA, validatorTypeEnum.FUND_ALLOCATION);
    const fundAllocationValidators =  (minMaxResult && minMaxResult.length > 0) ? minMaxResult[0] : { minAmount: 0, maxAmount: 0 };

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        activeUniversitiesFundAllocationsData: activeUniversitiesFundAllocationsData,
        activeUniversitiesDepartmentsFundAllocationsData: activeUniversitiesDepartmentsFundAllocationsData,
        fundAmounts: fundAmounts[0] ? fundAmounts[0] : {
          fundTotal: 0,
          totalAllocated: 0,
          unallocatedAmount: 0
        },
        fundAllocationValidators
      }
    }
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: error
    }
  }
}

const GetFundAllocationsDataForDean = async (request, context, locals) => {
  try {
    const year = request.query.get("year");
    const universityName = request.query.get("universityName");
    const faculty = request.query.get("faculty");
    const data = await get_faculty_allocations_data(universityName, faculty, year);
    const totalAllocation = data.reduce(
      (sum, { total_department_allocation }) => sum + total_department_allocation,
      0
    );

    const result = [{ universityName, universityTotalAllocated: totalAllocation }];

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: { activeUniversitiesFundAllocationsData: result },
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: error,
    };
  }
};

const moveDepartmentFunds = async (request, context, locals) => {

  try {
    const fundsToMoveAttributes = await request.json();
    const moveFundsResponse = await move_funds_data(
      locals.userId,
      fundsToMoveAttributes.amount,
      fundsToMoveAttributes.departmentName,
      fundsToMoveAttributes.universityName,
      fundsToMoveAttributes.year
    )

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        message: "Allocations Inserted",
        exitNumber: moveFundsResponse,
      },
    }
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: "Internal Server Error"
    }
  }
}

const insertAllocationsForUniversity = async (request, context, locals) => {
  try {
    const newAllocations = await request.json();
    const allocations_insert_proc_results = await insert_new_allocations_data(
      locals.userId,
      newAllocations.amount,
      newAllocations.name,
      newAllocations.year,
      newAllocations.action
    );

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        message: "Allocations Inserted",
        exitNumber: allocations_insert_proc_results,
      },
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
      ErrorMessages.internalServerError,
    };
  }
};

const reallocationsHistory = async (request, context, locals) => {

  try {

    const reallocation = await request.json();
    const reallocationResponse = await reallocations_data(
      reallocation, locals.userId);

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        message: "Reallocation successful",
        exitNumber: reallocationResponse
      }
    }
  } catch(error) {
    context.log(error)
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        "An error occured" + error,
    };
  }
}

const addToTotalFund = async(request, context, locals) => {
  try {

    const totalFundDetails = await request.json();
    const totalFundInsertResponse = await insert_into_totalFundHistory_data(totalFundDetails, locals.userId)
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        message: feedbackMessages.ADDED_TO_FUND,
        totalFundInsertResponse: totalFundInsertResponse
      }
    }

  } catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        "An error occured" + error,
    };
  }
}

module.exports = {
  getApprovedTotalAndRequestedAmounts,
  get_faculty_allocations_data,
  getDistinctBursaryTypes,
  get_fundTotal_allocated_unallocated_amounts_data,
  getDistinctYears,
  GetTotalRequestedAmountForUniversity,
  GetFundAllocationsDataForDean,
  GetFundAllocationsData,
  GetTotalRequestedAmountForUniversityHOD,
  checkValidDepartment,
  addToTotalFund,
  moveDepartmentFunds,
  insertAllocationsForUniversity,
  reallocationsHistory
}
