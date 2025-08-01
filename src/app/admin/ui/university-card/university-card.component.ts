import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { UniversityData } from '../../data-access/models/university-card-info.model';

@Component({
  selector: 'app-university-card',
  templateUrl: './university-card.component.html',
  styleUrl: './university-card.component.scss',
})
export class UniversityCardComponent {
  @Input() university!: UniversityData;
  @Input() year!: number;
  @Input() viewType!: string;
  @Output() selectedUniversity: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() {}
  onCardClick(university: UniversityData) {
    this.selectedUniversity.emit(university);
  }
}
