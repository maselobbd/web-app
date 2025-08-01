import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IndividualUniversityToViewData } from '../models/fundAllocations-model';

@Injectable({
  providedIn: 'root'
})
export class UniversityFundsService {
  
  viewIndividualUniversitySource: BehaviorSubject<IndividualUniversityToViewData>;
  viewIndividualUniversity: Observable<IndividualUniversityToViewData>; 

  constructor() { 
    this.viewIndividualUniversitySource = new BehaviorSubject<IndividualUniversityToViewData>({ individualUniversityView: false, universityName: "" });
    this.viewIndividualUniversity = this.viewIndividualUniversitySource.asObservable();
  }

  updateView( update: IndividualUniversityToViewData) {
    this.viewIndividualUniversitySource.next(update);
  }
}
