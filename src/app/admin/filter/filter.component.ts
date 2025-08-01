import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UniversitiesService } from '../data-access/services/universities.service';
import { IResponse } from '../../shared/data-access/models/response.models';
import { Universities } from '../data-access/models/universities-model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BursaryApplicationsService } from '../data-access/services/bursaryApplications.service';
import { Years } from '../data-access/models/years-model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Input() details: any[] = [];
  searchName: string = '';
  searchYear: number | undefined;
  searchUniversity: string = '';
  universities: any[] = [];
  noUniversitiesMessage: string | undefined;
  years: Years[] = [];
  @Input() year!: string;
  @Output() yearSelected = new EventEmitter<number>();
  filterForm = new FormGroup({
    year: new FormControl('', Validators.required),
    university: new FormControl(''),
  });

  @Output() fullName = new EventEmitter<string>();
  @Output() university = new EventEmitter<string>();
  @Output() Year = new EventEmitter<number>();

  selectedUniversity: any;
  selectedYear: any;

  constructor(
    private universitiesService: UniversitiesService,
    private bursaryApplicationsService: BursaryApplicationsService,
  ) {}

  ngOnInit() {
    this.getUniversities();
    this.getYears();
    if (this.year) {
      this.filterForm.get('year')?.patchValue(this.year);
    }
  }

  getYears(): void {
    this.bursaryApplicationsService
      .getYears()
      .subscribe((response: IResponse<Years[]>) => {
        if (response.results) {
          this.years = response.results;
        } else if (response.errors) {
          this.noUniversitiesMessage = 'No universities found.';
        }
      });
  }

  getUniversities(): void {
    this.universitiesService
      .getUniversities()
      .subscribe((response: IResponse<Universities[]>) => {
        if (response.results) {
          this.universities = response.results;
          this.universities.push({universityId: 0, universityName: 'All'});
        } else if (response.errors) {
          this.noUniversitiesMessage = 'No universities found.';
        }
      });
  }

  onSearchNameChange() {
    this.onFullNameChange();
    if (
      this.details &&
      this.details.length > 0 &&
      this.searchName.trim() !== ''
    ) {
      const filteredDetails = this.details.filter((s: { fullName: string }) =>
        s.fullName.toLowerCase(),
      );
      this.details = filteredDetails;
    }
  }

  onFullNameChange() {
    this.fullName.emit(this.searchName);
  }
  onUniversityChange(university: string) {
    if (!university) {
      university = '';
    } else {
      this.university.emit(university);
    }
  }

  onYearChange(year: any) {
    this.Year.emit(year);
  }
  submitSearch() {
    const fullName = this.searchName.trim();
    this.fullName.emit(fullName);
  }
}
