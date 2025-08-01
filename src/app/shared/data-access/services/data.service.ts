import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DepartmentAllocationsModel } from '../../../admin/data-access/models/departmentAllocation-model';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor() {}
  private dataSubject = new BehaviorSubject<any>(null);
  data$: Observable<any> = this.dataSubject.asObservable();
  private isFundSpreadSubject = new BehaviorSubject<boolean>(false);
  isFundSpread$ = this.isFundSpreadSubject.asObservable();
  private getUniversitySubject= new BehaviorSubject<any>(null);
  getUniversity$ = this.getUniversitySubject.asObservable();
  private nameSearchSubject = new BehaviorSubject<any>(null);
  nameSearch$ = this.nameSearchSubject.asObservable();
  private fromDetailsSubject = new BehaviorSubject<boolean>(false);
  fromDetails$ = this.fromDetailsSubject.asObservable();
  private triggerReloadSubject = new BehaviorSubject<any>(null);
  triggerReload$ = this.triggerReloadSubject.asObservable();
  private applicationGuidSubject = new BehaviorSubject<any>(null);
  applicationGuidSubject$ = this.applicationGuidSubject.asObservable();

  private showTranscriptUploadSubject = new BehaviorSubject<any>(null);
  showTranscriptUpload$ = this.showTranscriptUploadSubject.asObservable();

  setIsFundSpread(value: boolean) {
    this.isFundSpreadSubject.next(value);
  }

  private universityInfoSubject = new BehaviorSubject<any>(null);
  universityInfo$: Observable<any> = this.universityInfoSubject.asObservable();

  private universityDepartmentsSubject = new BehaviorSubject<any>(null);
  universityDepartments$: Observable<any> =
    this.universityDepartmentsSubject.asObservable();

  private universityDepartmentAllocationsModelSubject =
    new BehaviorSubject<any>(null);
  universityDepartmentAllocationsModel$: Observable<any> =
    this.universityDepartmentAllocationsModelSubject.asObservable();
  private tabsSubject = new BehaviorSubject<any>(null);
  tabdata$: Observable<any> = this.tabsSubject.asObservable();
  private dateSubject = new BehaviorSubject<any>(null);
  date$: Observable<any> = this.dateSubject.asObservable();
  private bursaryTypeSubject = new BehaviorSubject<string>('Ukukhula');
  bursaryType$: Observable<string> = this.bursaryTypeSubject.asObservable();
  private applicationSubject = new BehaviorSubject<any>(null);
  hasNewApplication$: Observable<any> = this.applicationSubject.asObservable();

  private currentTabSubject = new BehaviorSubject<any>(null);
  currentTab$: Observable<any> = this.currentTabSubject.asObservable();

  private backFileSubject = new BehaviorSubject<any>(null);
  backFile$: Observable<any> = this.backFileSubject.asObservable();

  private validBirthDateSubject = new BehaviorSubject<boolean>(false);
  validBirthDate$: Observable<any> = this.validBirthDateSubject.asObservable();

  private departmentSubject = new BehaviorSubject<any>(null);
  departmentSubject$:Observable<any> = this.departmentSubject.asObservable();

  private selectedUniversity = new BehaviorSubject<string | null>(null);

  
  setFromDetails(isFromList: boolean) {
    this.fromDetailsSubject.next(isFromList);
  }

  setSelectedUniversity(universityName: string | null) {
    this.selectedUniversity.next(universityName);
  }

  getSelectedUniversity() {
    return this.selectedUniversity.value;
  }
  
  sendAllocationUsageData(data: any) {
    this.dataSubject.next(data);
  }
  sendMicrosoftFormData(fullName: string, email: string) {
    const body = { fullName, email };
    this.dataSubject.next(body);
  }
  contentLoaded(data: boolean) {
    this.dataSubject.next(data);
  }

  sendUniversityInfo(universityInfo: any): void {
    this.universityInfoSubject.next(universityInfo);
  }

  sendUniversityDepartments(
    universityDepartments: DepartmentAllocationsModel[],
  ): void {
    this.universityDepartmentsSubject.next(universityDepartments);
  }

  sendUniversityDepartment(
    universityDepartmentAllocationsModel: DepartmentAllocationsModel,
  ): void {
    this.universityDepartmentAllocationsModelSubject.next(
      universityDepartmentAllocationsModel,
    );
  }
  tabState(data: any) {
    this.tabsSubject.next(data);
  }
  dateState(data: any) {
    this.dateSubject.next(data);
  }
  bursaryTypeState(data: string) {
    this.bursaryTypeSubject.next(data);
  }
  newApplicationData(hasNewApplication: boolean) {
    this.applicationSubject.next(hasNewApplication);
  }

  updateCurrentTab(tab: string): void {
    this.currentTabSubject.next(tab);
  }
  setUniversity(university:string, year:number)
  {
    this.getUniversitySubject.next({university,year});
  }
  searchName(fullName: string) {
    this.nameSearchSubject.next(fullName);
  }
  triggerReload(doReload: boolean) {
    this.triggerReloadSubject.next(doReload);
    this.triggerReloadSubject.complete();
  }

  setPersonalInfo(applicationGuid: string): void {
    this.applicationGuidSubject.next(applicationGuid);
  }

  updateShowTranscriptUpload(show: boolean): void {
    this.showTranscriptUploadSubject.next(show);
  }
  getCurrentSearchName(): string {
   return this.nameSearchSubject.getValue();
  }
  setBackFile(file: any): void {
    this.backFileSubject.next(file);
  }
  setValidBirthDate(valid: boolean): void {
    this.validBirthDateSubject.next(valid);
  }
  setDepartment(department:string)
  {
    this.departmentSubject.next(department)
  }

  getCurrentDepartment():string{
    return this.departmentSubject.getValue();
  }
}
