import { Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { SearchBarService } from '../../data-access/services/search-bar.service';
import { FormControl } from '@angular/forms';
import { Location } from '../../../student/models/location.model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  
  overlayOpen: any;
  @Input() control!: FormControl
  @Output() updateAddress: EventEmitter<Location> = new EventEmitter();
  constructor(private searchBarService: SearchBarService){
    this.overlayOpen = this.searchBarService.overlayOpen;
  }
  
  updateForm($event: Location) {
  this.updateAddress.emit($event)
  } 
}
