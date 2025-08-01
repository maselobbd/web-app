import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Details } from '../../../admin/data-access/models/details-model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Universities } from '../../../admin/data-access/models/universities-model';
import { UserStore } from '../../data-access/stores/user.store';
import { Roles } from '../../../authentication/data-access/models/auth.model';

@Component({
  selector: 'app-university-bursary-details',
  templateUrl: './university-bursary-details.component.html',
  styleUrl: './university-bursary-details.component.scss',
})
export class UniversityBursaryDetailsComponent {
  @Input() selectedTab: string = '';
  @Input() details: any;
  @Input() universityInput: string = '';
  detailsToShow: Details[] = [];
  detailsSubscription: Subscription | undefined;
  selectedUniversityId: number | null = null;
  noDetailsMessage: string | undefined;
  numberOfApplicants: number | undefined;

  @Output() numberOfActiveApplications: EventEmitter<number> =
    new EventEmitter<number>();
  universityToShow: Universities[] = [];
  isLoading: boolean = true;
  rolesEnum: typeof Roles = Roles;
  userRole!: Roles;

  constructor(
    private router: Router,
    private userStore: UserStore,
  ) {}
  ngOnInit() {
      this.detailsToShow = this.details;
    this.userStore.get().subscribe((user) => {
      this.userRole = Roles[user.role as keyof typeof Roles];
    });
  }

  ngOnDestroy(): void {
    if (this.detailsSubscription) {
      this.detailsSubscription.unsubscribe();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  }

  navigateToDetailsPage(applicationGuid: any) {
    if (this.userRole === this.rolesEnum.admin) {
      this.router.navigate(['/admin/studentDetails', applicationGuid]);
    } else {
      this.router.navigate(['/dashboard/studentDetails', applicationGuid]);
    }
  }
}