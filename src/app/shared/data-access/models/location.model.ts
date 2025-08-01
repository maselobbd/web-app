export interface EventLocation {
  location: string,
  address: Address,
  meetingUrl: string
}

export interface Address {
  addressLine1?: string,
  addressLine2: string,
  suburb: string,
  city: string,
  code: string
}
