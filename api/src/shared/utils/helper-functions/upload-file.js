const { v4: uuidv4 } = require("uuid");
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

/**
 *
 * @param {String} file the file converted to base64 string.
 * @param {boolean} event flag to give file event image name.
 * @returns {String} uploadedFileName which is the name of the file in our blob storage
 *
 */
const uploadFile = async (file, event) => {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.Azure_Storage_AccountName,
    process.env.Azure_Storage_AccountKey,
  );

  const blobServiceClient = new BlobServiceClient(
    process.env.BLOB_URL,
    sharedKeyCredential,
  );

  const containerClient = blobServiceClient.getContainerClient(
    process.env.Azure_Storage_Container,
  );

  let uploadedFileName;
  const fileInfo = file.split(";")[0];
  const fileExtension = fileInfo.split("/")[1];
  const fileType = fileInfo.split("/")[0].split(":")[1];
  uploadedFileName = event ? `eventImages/${uuidv4()}.${fileExtension}` : `students/${uuidv4()}.${fileExtension}`;
  const fileBase64String = file.replace(/^.+,/, "");
  const fileBuffer = Buffer.from(fileBase64String, "base64");

  const blockBlobClient = containerClient.getBlockBlobClient(uploadedFileName);
  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: `${fileType}/${fileExtension}` },
  });

  return uploadedFileName;
};

module.exports = {
  uploadFile,
};
