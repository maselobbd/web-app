const attachBlobBaseUrl = (blobName) => {
  return blobName
    ? `${process.env.BLOB_URL}/${process.env.Azure_Storage_Container}/${blobName}`
    : "";
};

const process_applications_report_data = (applicationsReportData) => {
  const processedData = applicationsReportData.map((application) => {
    application["ID Url"] = attachBlobBaseUrl(application["ID Url"]);
    application["Academic Transcript Url"] = attachBlobBaseUrl(
      application["Academic Transcript Url"],
    );
    application["Matric Certificate Url"] = attachBlobBaseUrl(
      application["Matric Certificate Url"],
    );
    application["Financial Statement Url"] = attachBlobBaseUrl(
      application["Financial Statement Url"],
    );
    application["Citizenship"] = application["Citizenship"]
      ? "South African"
      : "Not South African";
    application["Agreed to Terms and Conditions"] = Number(
      application["Agreed to Terms and Conditions"],
    )
      ? "Yes"
      : "No";
    application["Read Privacy Policy"] = Number(
      application["Read Privacy Policy"],
    )
      ? "Yes"
      : "No";
    return application;
  });

  return processedData;
};

module.exports = {
  process_applications_report_data,
};
