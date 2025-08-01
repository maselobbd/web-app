import { Injectable, signal } from '@angular/core';
import { Location } from '../../../student/models/location.model';

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {

  overlayOpen =signal(false);
  result = signal<Location>({
    type: '',
    id: '',
    score: 0,
    address: {
      streetName: '',
      municipalitySubdivision: '',
      municipality: '',
      neighbourhood: '',
      countrySecondarySubdivision: '',
      countrySubdivision: '',
      countrySubdivisionName: '',
      countrySubdivisionCode: '',
      postalCode: '',
      countryCode: '',
      country: '',
      countryCodeISO3: '',
      freeformAddress: '',
      localName: ''
    }
  });
  search = signal<Location[]>([])
  searchCount = signal<number>(0);

  constructor() { }
}
