export enum AdditionaInfoMessageType {
  REQUIRED = 'is a required field',
  INVALID_ID = '*Invalid ID Number',
  INVALID_ADDRESS = '*Please fill in all address fields',
  INVALID_CONTACT_NUMBER = '*Invalid contact number',
  GRADE_AVERAGE_LOW = '*Minimum grade average is 50',
  GRADE_AVERAGE_TOO_HIGH = '*Maximum grade average is 100',
  INVALID_POSTAL_CODE = '*Invalid Postal Code. Postal Code may only contain numbers and letters.',
  HELP_MESSAGE='*If you need help please contact Ukukhula@bbd.co.za',
  INVALID_GRADE_AVERAGE = '*Please enter a valid grade average',
  CITIZENSHIP = '*Only one citizenship confirmation may be checked',
  INVALID_ENTRY='*Numbers are not allowed',
  INVALID_DEGREE = '*Please enter a valid degree',
  INVALID_STUDENT = 'Unfortunately we can not help you at this time, please contact Ukukhula@bbd.co.za.',
  INCORRECT_INFO = 'If the information above is incorrect or incomplete, please contact Ukukhula@bbd.co.za to update the correct details.',
  REQUIRED_RESPONSE = '*Response is a required field',
  MIN_AGE = "*You must be 18 or older.",
  No_FUNDS_MESSAGE= 'Error: It looks like you have run out of funds for this year. Please contact  Ukukhula@bbd.co.za if you require further assistance.',
  NO_DEPARTMENTS_MESSAGE= 'Nothing here yet. Please contact your administrator for further assistance.',
  INVALID_SA_POSTAL_CODE = 'Please enter a valid South African postal code.',
  REVERT_REASON_REQUIRED = `*Reason is required.`,
  REVERT_STAGE_REQUIRED = `*You must select a revert stage.`,
  MAINTENANCE_HEADING = `We're busy doing some maintenance`,
  MAINTENANCE_SUBHEADING = `Sorry! We'll be back soon!`,
  APPLICATION_FORM_MESSAGE = `Please provide student details before requesting for funds.`,
  APPLICATION_RENEWAL_FORM_MESSAGE = `Please provide student details before requesting for funds.','Please confirm the students you would like to renew funding for, the year you would like to fund the students for, and the amount of funding you would like them to receive`,
  NO_STUDENTS_TO_NUDGE = "Currently, there are no students eligible for nudging. Please check again later.",
  NO_ADMIN_MESSAGE = "You don’t have an admin assigned to this department! Please assign one by adding a profile.",
  NO_BURSARS_MESSAGE = "There are currently no students listed under this department.",
  NO_EVENTS = "Currently, there are no events. Please check again later.",
  CREATE_EVENT_FORM_MESSAGE = "Create a new event and add all the students who you would like to send an invite to the event.",
  REQUIRED_BURSARY_TIER = 'Bursary tier is a required field',
  REQUIRED_BURSARY_AMOUNT = 'Bursary amount is a required field',
  DEPARTMENT_REQUIRED = 'Department is a required field',
  FACULTY_REQUIRED = 'Faculty is a required field',
  EMAIL_REQUIRED = 'Email is a required field',
  UNIVERSITY_REQUIRED = 'University is a required field',
  NO_INVITEES = "No invitees match the selected criteria.",
  INVALID_DEGREE_DURATION = "*Duration cannot be less than year of study",
  INVALID_YEAR_OF_STUDY = "*Year of study cannot be greater than degree duration",
}

export enum SLOGANS {
  UKUKHULA_SLOGAN = `Empower your most talented students with the funds they need to propel
        their growth and future in the tech industry.`
}

export enum Logout {
  MESSAGE = "Logout successful"
}
