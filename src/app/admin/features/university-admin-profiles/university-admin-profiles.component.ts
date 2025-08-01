import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UniversityDetails } from '../../data-access/models/university-details.model';
import { IUni } from '../../data-access/models/universityUsers-model';
import { Faculty } from '../../data-access/models/faculties-model';
import { UniversityData } from '../../../shared/data-access/models/universityProfiles.model';
import { Ranks, Roles } from '../../../authentication/data-access/models/auth.model';

@Component({
  selector: 'app-university-admin-profiles',
  templateUrl: './university-admin-profiles.component.html',
  styleUrls: ['./university-admin-profiles.component.scss'],
})
export class UniversityAdminProfilesComponent {
 
  @Input() universities: UniversityDetails[] = [];
  @Input() allUniversities: IUni[] = [];
  @Input() faculties: Faculty[] = [];
  @Input() extraUniversities: UniversityData[] = [];
  @Input() tabLabel!:string
  @Input() role!:Roles;
  @Input() rank!: Ranks;

}
