const { EmailClient } = require("@azure/communication-email");
const fs = require("fs");
const path = require("path");
const { imagePathsEnum } = require("../enums/imagePathsEnum");
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
const domainSenderAddress = process.env.DOMAIN_SENDER_ADDRESS;
const replDomainSenderAddress = process.env.REPL_DOMAIN_SENDER_ADDRESS
const defaultImagePath = imagePathsEnum.DEFAULT_HEADER;

const sendEmail = async (
  context,
  recipients,
  message,
  subject,
  headerImagePath = defaultImagePath,
  documents = [],
  useReplAddress = false
) => {
  try {
    if (!recipients || recipients.length < 1 || !message || !subject) {
      throw new Error("Missing required parameters");
    }
    const mailerHeaderImagePath = fs.readFileSync(
      path.resolve(__dirname, headerImagePath.path),
      "base64",
    );

    const emailClient = new EmailClient(connectionString);

    const attachments = [
      {
        name: headerImagePath.name,
        contentType: "image/png",
        contentInBase64: mailerHeaderImagePath,
      },
    ];

    const sharedKeyCredential = new StorageSharedKeyCredential(
      process.env.Azure_Storage_AccountName,
      process.env.Azure_Storage_AccountKey,
    );

    const blobServiceClient = new BlobServiceClient(
      process.env.BLOB_URL,
      sharedKeyCredential,
    );
    for (const docPath of documents) {
      const blobName = docPath.blobName.split("/").pop();
      let documentType = docPath.type+`.${blobName.split(".").pop().toLowerCase()}`
      const containerClient = blobServiceClient.getContainerClient(
        process.env.Azure_Storage_Container,
      );
      const blobClient = containerClient.getBlobClient(docPath.blobName);
      const downloadBlockBlobResponse = await blobClient.download();
      const downloadedData = await streamToBase64(
        downloadBlockBlobResponse.readableStreamBody,
      );
      const contentType = getContentType(blobName);
    
      attachments.push({
        name: documentType,
        contentType: contentType,
        contentInBase64: downloadedData,
      });
    }

    const emailMessage = {
      senderAddress: useReplAddress? replDomainSenderAddress : domainSenderAddress,
      content: {
        subject: subject,
        html: message,
        trackingOptions:{
          trackLinks:true
        }
      },
      recipients: { to: recipients },
      attachments,
      replyTo: [{address:process.env.REPLY_EMAIL}],
      disableUserEngagementTracking: false
    };

    emailClient.beginSend(emailMessage).catch((sendError) => {
      context.log(sendError);
    });
    return { status: 200 };
  } catch (error) {
    context.log(error);
    return { status: 500 };
  }
};

async function streamToBase64(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => chunks.push(data));
    readableStream.on("end", () =>
      resolve(Buffer.concat(chunks).toString("base64")),
    );
    readableStream.on("error", reject);
  });
}

function getContentType(filename) {
  const extension = filename.split(".").pop().toLowerCase();
  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

module.exports = { sendEmail };
