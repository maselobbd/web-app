export enum FundAllocationsMessages {
    REQUIRED = "is a required field",
    UNIQUE = "input must be unique.",
    MIN_AMOUNT = "*Amount may only be a minimum of",
    MAX_AMOUNT = "*Amount may only be a maximum of",
    UNIQUE_CHOICE = "*Select Department input must be unique.",
    INVALID_AMOUNT = "Please enter a valid amount.",
    GENERIC_ERROR = "Something went wrong, please try again later.",
    NO_DEPT_ALLOCATIONS = "Please fund a universiry(s) before viewing.",
    UNALLOCATED_LESS = "Amount is greater than available funds to allocate by: ",
    CAPPED = "*New allocation for university is over maximun per university."
}
