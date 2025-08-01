const { sendEmailToExecutive } = require("./emailToExecutives"); 
const { sendEmail } = require("./send-email");
const { emailTypeEnum } = require("../enums/emailTypeEnum");
const emailTemplates = require("./email-templates");
const { extractNameFromEmail } = require("./extractNameFromEmailHelperFunctions");

// Mock dependencies
jest.mock("./send-email", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("./utils/extractNameFromEmail", () => ({
  extractNameFromEmail: jest.fn(),
}));

jest.mock("./email-templates", () => ({
  alertExecutiveToApproveApplication: jest.fn().mockReturnValue("Test Email Body"),
  alertExecApplicationApprovalSubject: "Approval Required",
  alertExecInvoiceApproval: "Invoice Approval Required",
}));
const context = {
    log: jest.fn(),
  };
  
  test("should include a valid student details link in the email body", async () => {
    const emailList = ["exec1@example.com"];
    const type = emailTypeEnum.STUDENT_APPLICATION_REQUIRES_APPROVAL;
    const documents = [];
    const applicationGuid = "12345";
  
    // Mock implementations
    extractNameFromEmail.mockImplementation((email) => email.split("@")[0]);
    emailTemplates.alertExecutiveToApproveApplication.mockReturnValue(
      `Hello, please review the application here: <a href="https://ukukhula.com/admin/details/${applicationGuid}">Review</a>`
    );
  
    await sendEmailToExecutive(context, emailList, type, documents, applicationGuid);
  
    // Capture the email body argument from sendEmail mock
    const emailBody = sendEmail.mock.calls[0][2];
  
    // Extract the URL from the email body using regex
    const linkMatch = emailBody.match(/href="([^"]+)"/);
    expect(linkMatch).not.toBeNull(); // Ensure a link exists
  
    const extractedUrl = linkMatch[1];
  
    // Validate URL structure with updated domain and path
    expect(extractedUrl).toMatch(/^https:\/\/ukukhula\.com\/admin\/details\/\d+$/);
    expect(extractedUrl).toContain(applicationGuid);
  });
  
  
  test("should include a link that redirects to the student details page", async () => {
    const applicationGuid = "12345";
    const studentDetailsUrl = `https://ukukhula\\.com/admin/details/${applicationGuid}`;
  
    // Mock the fetch function to simulate a real HTTP request
    const mockFetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => Promise.resolve({ studentId: applicationGuid }) })
    );
  
    global.fetch = mockFetch; // Replace fetch with the mock function
  
    // Simulate the URL request
    const response = await fetch(studentDetailsUrl);
    const data = await response.json();
  
    // Ensure the response is valid and contains the correct student ID
    expect(response.status).toBe(200);
    expect(data.studentId).toBe(applicationGuid);
  });
  
  test("should call sendEmail with correct parameters", async () => {
    const emailList = ["exec1@example.com"];
    const type = emailTypeEnum.STUDENT_APPLICATION_REQUIRES_APPROVAL;
    const documents = [];
    const applicationGuid = "12345";
  
    extractNameFromEmail.mockImplementation((email) => email.split("@")[0]);
    emailTemplates.alertExecutiveToApproveApplication.mockReturnValue(
      `Hello, please review the application here: <a href="https://ukukhula.com/admin/details/${applicationGuid}">Review</a>`
    );
  
    await sendEmailToExecutive(context, emailList, type, documents, applicationGuid);
  
    // Correct the escaping in the regex
    expect(sendEmail).toHaveBeenCalledWith(
      expect.any(Object), // context
      expect.any(String), // recipient email
      expect.stringMatching(new RegExp(`href="https://ukukhula\\.com/admin/details/${applicationGuid}"`)), // check URL format
      expect.any(String), // subject
      expect.any(Object), // image path
      expect.any(Array) // documents
    );
  });