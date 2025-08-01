const bursariesApplicationsData = (bursaryApplicationsDetails) => {
  const data = bursaryApplicationsDetails.map((item) => ({
    universityId: item.universityId,
    universityName: item.universityName,
    details: JSON.parse(item.details),
  }));

  return data;
};

module.exports = { bursariesApplicationsData };
