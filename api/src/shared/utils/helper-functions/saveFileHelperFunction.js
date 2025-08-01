const { upload_admin_documents_data, save_file_data } = require("../../../data-facade/adminData");
const { uploadFile } = require("./upload-file");

async function saveFile(data,userId)
{
  const { file, applicationId, documentStatus, documentType, expenseCategory, reason } = data;
  const base64String = file["filebytes"] || '';
    
  const documentUrl = base64String ? await uploadFile(base64String) : file;
  const uploadedDocuments = await upload_admin_documents_data(
    documentUrl,
    applicationId,
    userId,
    documentType,
    documentStatus,
    expenseCategory,
    reason || ''
  );
  return uploadedDocuments["recordset"]
}

async function instantFileSave(file,applicationId) {
  const blobFileName = await uploadFile(file.value);
  await save_file_data(blobFileName, applicationId, file.type);
}

module.exports = {saveFile, instantFileSave}