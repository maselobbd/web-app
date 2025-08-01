const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");


async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
}

const downloadFile = async (documentBlobName) => {
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


  const [folder, file] = documentBlobName.split('/');
  const [fileName, fileExtention] = file.split('.');

  const blockBlobClient = containerClient.getBlobClient(documentBlobName);

  const downloadResponse = await blockBlobClient.download();

  const downloaded = await streamToBuffer(downloadResponse.readableStreamBody);

  return {
    fileName,
    fileExtention,
    base64: downloaded.toString('base64')
  };
};


module.exports = {
  downloadFile,
};
