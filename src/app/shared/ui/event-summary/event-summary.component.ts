import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventSummary } from '../../data-access/models/eventSummary.model';
import { ButtonAction } from '../../enums/buttonAction';
import { Router } from '@angular/router';
import { DataService } from '../../data-access/services/data.service';
import { status } from "../../enums/statusEnum";
import { Roles } from '../../../authentication/data-access/models/auth.model';
import { UserStore } from '../../data-access/stores/user.store';
import { EventPhoto } from "../../../student/models/photo.model";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { FileContents } from "../../data-access/models/file-contents.model";
import { dataUrl } from "../../enums/dataURIs";
import { eventFileTraverser } from "../../utils/functions/traverseDownloadedFiles.function";
import {DocumentStatus} from "../../enums/documentStatus";

@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html',
  styleUrl: './event-summary.component.scss'
})
export class EventSummaryComponent implements OnInit{
  @Input() event!: EventSummary;
  @Input() userRole!: Roles;
  @Input() year!: number;
  role!: string;
  isAdmin = false;
  userRoles!: Roles;
  administrativeRole = [Roles.admin, Roles.finance];
  eventPhoto!: EventPhoto;
  eventPhotoUrl!: SafeUrl | string;
  blobResult!: FileContents;
  buttonAction: typeof ButtonAction = ButtonAction;

  constructor(
    private router: Router,
    private userStore: UserStore,
    private shareDataService: DataService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {
    this.userStore.get().subscribe((user) => {
      this.role = user.role;
      this.userRoles = Roles[user.role as keyof typeof Roles];
      this.isAdmin = this.administrativeRole.includes(this.userRoles);
    });
  }

  ngOnInit(): void {
    this.eventPhoto = this.event.downloadedEventImage as EventPhoto ||
    { eventImage:{ base64: this.event.eventImage, fileExtention:'.png'} as FileContents } as EventPhoto;
    this.viewImage(this.event.eventImage);
  }

  navigateToEventDetailsPage(eventId: string | number) {
    this.shareDataService.setFromDetails(true);
    if (this.isAdmin) {
      this.router.navigate([`/admin/events/${eventId}`]);
    } else {
      this.router.navigate([`/application/student/events/${eventId}`]);
    }
  }

  protected readonly status = status;

  getEventStatus() {
    return this.event.eventStatus === 'Cancelled'
  }

  loadEventImage(): void {
    const { jpeg, png, jpg } = dataUrl;
    const filteredDataUrl = { jpg, png, jpeg };
    if (this.blobResult && this.blobResult.base64 && this.blobResult.fileExtention) {
      this.eventPhotoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        filteredDataUrl[this.blobResult.fileExtention as keyof typeof filteredDataUrl] + this.blobResult.base64
      ) as SafeUrl;
    }
    this.cdr.detectChanges();
  }

  viewImage(eventImage: string) {
    if (this.event.eventImage) {
      this.blobResult = eventFileTraverser(this.eventPhoto, eventImage);
      this.loadEventImage();
    }
  }

  showRsvpButton(event: EventSummary): boolean {
    return this.userRole === Roles.student && event.rsvp === DocumentStatus.PENDING;
  }

  protected readonly Roles = Roles;
}
