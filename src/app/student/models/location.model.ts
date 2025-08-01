export interface Location {
    type: string
    id: string
    score: number
    address: Address
  }
  
  export interface Address {
    streetName: string
    municipalitySubdivision: string
    municipality: string
    neighbourhood: string
    countrySecondarySubdivision: string
    countrySubdivision: string
    countrySubdivisionName: string
    countrySubdivisionCode: string
    postalCode: string
    countryCode: string
    country: string
    countryCodeISO3: string
    freeformAddress: string
    localName: string
  }
  