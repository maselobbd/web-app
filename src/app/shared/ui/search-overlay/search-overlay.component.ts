import { Component, EventEmitter, Output } from '@angular/core';
import { SearchBarService } from '../../data-access/services/search-bar.service';
import { Location } from '../../../student/models/location.model';

@Component({
  selector: 'app-search-overlay',
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.scss',
})
export class SearchOverlayComponent {


  searches: any;
  @Output() searchSelection: EventEmitter<Location> =
  new EventEmitter<Location>();
  constructor(private searchBarService: SearchBarService) {
    this.searches = searchBarService.search;
  }

  formatAddressToString(response: Location): string | null {
    const addressParts = [];
  
    addressParts.push(response.address.streetName);
  
    if (response.address.municipality) {
      addressParts.push(response.address.municipality);
    }
  
    if (response.address.postalCode) {
      addressParts.push(response.address.postalCode);
    }
  
    if (response.address.countrySubdivision) {
      addressParts.push(response.address.countrySubdivision);
    }
  
    return addressParts.join(', ');
  }
  
  hasStreet(response: Location): boolean {
    if (!response.address.streetName || !response.address.postalCode) {
      return false;
    } 
    return true;
    }
  

  onItemClick(item: Location) {
    this.searchBarService.overlayOpen.set(false);
    this.searchBarService.result.set(item)
    this.searchSelection.emit(item);
    }
}
