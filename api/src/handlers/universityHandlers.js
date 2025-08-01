const { getCacheInstance } = require("../shared/utils/cache");
const {
  university_count_data,
  count_hod_number_bursary_applications_status_date_data,
  hod_application_by_date_data,
  universities_with_active_bursaries_data,
  hod_bursary_applications_data,
  count_hod_filtered_bursary_applications_data,
  university_id_data,
  count_hod_bursary_applications_by_date_data,
  count_hod_bursary_applications_data,
  active_bursary_by_university_data,
  universities_by_university_data,
  all_hod_bursary_applications_data,
  get_faculty_departments_data,
  get_faculty_requested_amounts_data,
  get_faculty_approved_amounts_data,
  get_faculty_allocations_data,
  update_total_fund_data
} = require("../data-facade/universityData");
const { roles } = require("../shared/utils/enums/rolesEnum");
const { adminDashboardData, update_department_status_data } = require("../data-facade/adminData");
const { groupByStatus } = require("../shared/utils/helper-functions/statusSortHelperFunction");
const { filterByFacultyAndDepartment } = require("../shared/utils/helper-functions/groupByDepartmentsFacultiesHelperFunctions");
const { filterAmounts } = require("../shared/utils/helper-functions/allocationsHelperFunctions");
const { fund_allocations_data, move_funds_data } = require("../data-facade/allocationsData");
const bursaryTypes = require("../shared/utils/enums/bursaryTypesEnum");
const ResponseStatus = require("../shared/utils/enums/responseStatusEnum");
const ErrorMessages = require("../shared/utils/enums/internalServalErrorMessageEnum");

const cache = getCacheInstance();
const usersCacheKey = 'users';
let users;

const getUniversity = async (request, context, locals) => {
  try {
    const universities = await university_count_data();

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: universities,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getNumberHODNumberApplicationsByDateStatus = async (
  request,
  context,
  locals,
) => {
  try {
    const date = request.query.get("date");

    const hodBursaryApplications =
      await count_hod_number_bursary_applications_status_date_data(
        date,
        locals.userId,
      );
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: hodBursaryApplications,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getHODBursaryApplicationsByDate = async (request, context, locals) => {
  try {
    const date = request.query.get("date");
    const status = request.query.get("status");
    const hodBursaryApplications = await hod_application_by_date_data(
      date,
      status,
      locals.userId,
    );
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: hodBursaryApplications,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getUniversitiesWithActiveBursaries = async (request, context, locals) => {
  try {
    const universities = await universities_with_active_bursaries_data();

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: universities,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getHODBursaryApplications = async (request, context, locals) => {
  const status = request.query.get("status");
  try {
    const hodBursaryApplications = await hod_bursary_applications_data(
      status,
      locals.userId,
    );
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: hodBursaryApplications,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getHODNumberApplicationsByStatus = async (request, context, locals) => {
  try {
    const hodBursaryApplications =
      await count_hod_filtered_bursary_applications_data(locals.userId);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: hodBursaryApplications,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getUniversityId = async (request, context, locals) => {
  try {
    const name = request.query.get("name");
    const universityId = await university_id_data(name);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: universityId,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};
const getNumberOfHODApplicationsByDate = async (request, context, locals) => {
  try {
    const date = request.query.get("date");
    const hodBursaryApplications =
      await count_hod_bursary_applications_by_date_data(date, locals.userId);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: hodBursaryApplications,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};
const getNumberHODBursaryApplications = async (request, context, locals) => {
  try {
    const hodBursaryApplications = await count_hod_bursary_applications_data(
      locals.userId,
    );
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: hodBursaryApplications,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getUniversityByNameForActiveTab = async (request, context, locals) => {
  try {
    const university = request.query.get("university");
    const bursaryApplicationsDetails =
      await active_bursary_by_university_data(university);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: bursaryApplicationsDetails,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getUniversityByNameForApplicationsTab = async (
  request,
  context,
  locals,
) => {
  try {
    const university = request.query.get("university");
    const bursaryApplicationsDetails =
      await universities_by_university_data(university);
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: bursaryApplicationsDetails,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};
const getActiveUniversities = async (request, context, locals) => {
  try {
    const university = request.query.get("university");

    let info;
    if (university) {
      info = await getUniversityByNameForActiveTab(request, context, locals);
    } else {
      info = await getUniversitiesWithActiveBursaries(request, context, locals);
    }

    return {
      jsonBody: info.jsonBody,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getUniversitiesWithApplications = async (request, context, locals) => {
  try {
    const university = request.query.get("university");

    let info;
    if (university) {
      info = await getUniversityByNameForApplicationsTab(
        request,
        context,
        locals,
      );
    } else {
      info = await getUniversity(request, context, locals);
    }

    return {
      jsonBody: info.jsonBody,
    };
  } catch (error) {
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};
const AllHodData = async (request, context, locals) => {
  let year=request.query.get("year")
  let universityName = request.query.get("universityName");
  let department = request.query.get("department");
  let result;
  try {
    if(locals.role == roles.DEAN){
      const universityApplicationsData = await adminDashboardData(filteredData={universty:universityName, year:year, name:null, bursaryType:bursaryTypes.UKUKHULA});
      const dataToFilter=universityApplicationsData.find(university=>university.universityName.toLowerCase()===universityName.toLowerCase());
      result = {details:groupByStatus(filterByFacultyAndDepartment(dataToFilter.details,locals.faculty,department))};
    }else{
      const hodBursaryApplications = await all_hod_bursary_applications_data(
        locals.userId,year
      );
      result={details:groupByStatus(hodBursaryApplications)}
    }
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: result,
    };
  } catch (error) {
    context.log(error)
    return {
      status: ResponseStatus.ERROR,
      jsonBody:
        `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

const getDepartments = async(request,context,locals)=>{
  try {
    const universityName = request.query.get("universityName");
    const facultyName = request.query.get("facultyName");

    const departments = await get_faculty_departments_data(universityName, facultyName);

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody:departments
    }
  } catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    }
  }
}

const getFacultyDepartmentsAmount = async(request,context,locals)=>{
  try {
    const universityName = request.query.get("universityName");;
    const facultyName = request.query.get("facultyName");
    const year = request.query.get("year");

    const departments = (await get_faculty_departments_data(universityName, facultyName)).map(department => department.universityDepartmentName);
    const requestedAmounts = await get_faculty_requested_amounts_data(
      universityName, facultyName, year);
    const approvedAmounts = await get_faculty_approved_amounts_data(
      universityName, facultyName, year);
    const allocations = await get_faculty_allocations_data(
      universityName, facultyName, year);
    const facultyDepartmentsAmounts = filterAmounts(departments, allocations, requestedAmounts, approvedAmounts)


    return {
      status: ResponseStatus.SUCCESS,
      jsonBody:facultyDepartmentsAmounts
    }
  } catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    }
  }
}

const updateUniversityStatus = async (request, context, locals) => {
  let total = 0;
  try {
    const { university, status } = await request.json();
    const year = new Date().getFullYear();
    const data = await fund_allocations_data(year, university,'Ukukhula');
    const result = [];

    for (const department of data) {
      let totalDeptAll = Number(department.departmentTotalAllocationAmount) || 0;
      let totalDeptReq = Number(department.departmentTotalApprovedAmount) || 0;
      let totalDeptAppr = Number(department.departmentTotalRequestedAmount) || 0;
      let amountRemaining = totalDeptAll - (totalDeptReq + totalDeptAppr);
      total += Number(amountRemaining.toFixed(4));

      if (totalDeptAll > 0 && amountRemaining > 0) {
        await move_funds_data(locals.userId, -amountRemaining, department.departmentName, university,year)
      }
      try {
        const updateResult = await update_department_status_data(department.universityName, department.departmentName, department.faculty, status, locals.userId);
        result.push(updateResult);
      } catch (error) {
        throw new Error(`updating department: ${department.departmentName}`);
      }
    }
    if (total > 0) {
      await update_total_fund_data(total, locals.userId);
    }
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: result
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.internalServerError} ${error}`,
    };
  }
};

module.exports = {
  getUniversity,
  getUniversityByNameForApplicationsTab,
  getDepartments,
  getActiveUniversities,
  getHODBursaryApplications,
  getHODNumberApplicationsByStatus,
  getHODBursaryApplicationsByDate,
  getNumberHODNumberApplicationsByDateStatus,
  getNumberOfHODApplicationsByDate,
  getUniversityByNameForActiveTab,
  updateUniversityStatus,
  getFacultyDepartmentsAmount,
  AllHodData,
  getUniversitiesWithApplications,
  getUniversityId,
  getNumberHODBursaryApplications
}
