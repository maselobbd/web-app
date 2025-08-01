import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { Roles } from '../../../authentication/data-access/models/auth.model';
import { EventDetails, PreviewEventFormData } from '../../data-access/models/eventDetails.model';
import { InviteeFilters, InviteeInformation, RsvpDetails } from '../../data-access/models/inviteeInformation.model';
import { ImagePaths } from '../../../admin/enums/imagePaths';
import { UserStore } from '../../data-access/stores/user.store';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../data-access/services/events.service';
import { EventLocation } from '../../data-access/models/location.model';
import { LoaderService } from '../../data-access/services/loader.service';
import { hasValidResults } from '../../utils/functions/checkData.function';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarMessage } from '../../enums/snackBarMessage';
import { SnackBarDuration } from '../../enums/snackBarDuration';
import { EventPhoto } from '../../../student/models/photo.model';
import { FileContents } from '../../data-access/models/file-contents.model';
import { dataUrl } from '../../enums/dataURIs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { eventFileTraverser } from '../../utils/functions/traverseDownloadedFiles.function';
import { ButtonAction } from '../../enums/buttonAction';
import { EditEventDetailsComponent } from '../../../admin/ui/edit-event-details/edit-event-details.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogDimensions } from '../../enums/dialogDimensions';
import { Locations } from '../../../admin/data-access/models/location.model';
import { EventInvitees, GroupedBursars } from '../../../admin/data-access/models/eventInvitees.model';
import { EventLocationTypes, EventsTitles } from "../../../admin/enums/eventsMessages";
import { distinctUntilChanged, first, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectEventDetailsData, selectEventsPrePopulatedData } from '../../../states/events/events.selector';
import { eventDetails, eventsPrePopulatedData, eventSummaryList, studentEventsList } from '../../../states/events/events.action';
import { EventUpdate } from '../../../admin/data-access/models/eventUpdate.model';
import { reloadComponent } from '../../utils/functions/reloadComponent';
import { DialogTitles } from '../../enums/dialog-titles';
import { DialogType } from '../../enums/dialogType';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';
import { UploadProfilePictureComponent } from '../upload-profile-picture/upload-profile-picture.component';
import { documentTypeName } from '../../../university-dashboard/enums/documentType.model';
import { file } from '@rxweb/reactive-form-validators';
import { DataService } from '../../data-access/services/data.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit{
  role: string = '';
  userRoles!: Roles;
  isAdmin = false;
  email: string = '';
  isLoading: boolean = false;
  administrativeRole = [Roles.admin, Roles.finance];
  event!: EventDetails;
  selectedDate: number = 0;
  rsvpFilters!: InviteeFilters;
  eventLocations!: EventLocation[];
  groupedBursars: GroupedBursars[] = [];
  locations!: Locations[];
  eventTypes: string[] = [];
  eventGuid: string = '';
  eventPhoto!: EventPhoto;
  blobResult!: FileContents;
  bursars: EventInvitees[] = [];
  eventPhotoUrl!: SafeUrl | string;
  displayMeetingUrl: boolean = false;
  EventsDetails$!: Observable<EventDetails>;
  EventPrePopulatedData$!: Observable<{bursars: EventInvitees[], locations: Locations[], eventTypes: string[]}>;
  readonly dialog = inject(MatDialog);
  readonly ImagePaths = ImagePaths;
  readonly ButtonAction = ButtonAction;
  @Input() previewEvent?: PreviewEventFormData;
  @Input() isPreview: boolean = false;

  constructor(
    private userStore: UserStore,
    private route: ActivatedRoute,
    private eventService: EventsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private loader: LoaderService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private shareDataService: DataService,
    private store: Store,
  ) {
    this.userStore.get().subscribe((user) => {
      this.role = user.role;
      this.email = user.email;
      this.userRoles = Roles[user.role as keyof typeof Roles];
      this.isAdmin = this.administrativeRole.includes(this.userRoles);
    });
  }

  ngOnInit(): void {
    this.loader.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    if (this.isPreview && this.previewEvent) {
      this.event = this.mapPreviewEvent(this.previewEvent);
      this.eventLocations = this.event.locations ?? [];
      this.rsvpFilters = this.event.inviteeFilters ?? {
        rsvp: [],
        university: [],
        dietaryRequirements: []
      };
      this.eventPhotoUrl = this.event.eventImage;
      return;
    }
    this.route.params.subscribe((params) => {
      this.eventGuid = params['id'];
      this.eventDetailsDataSubscription(this.eventGuid);
    });
  
    if (this.isAdmin) this.eventsPrepopulatedDataSubscription();
    this.shareDataService.date$.subscribe((year) => {
      this.selectedDate = year;
    });
  }

  eventDetailsDataSubscription(eventGuid: string) {
    this.EventsDetails$ = this.store.pipe(select(selectEventDetailsData(eventGuid)));
    this.EventsDetails$.pipe(first()).subscribe((data) => {
      if ( !data ) {
        const encodedEmail = encodeURIComponent(this.email);
        this.isAdmin ? this.store.dispatch(eventDetails({eventGuid: eventGuid}))
          : this.store.dispatch(eventDetails({eventGuid: eventGuid, email: encodedEmail}));
      }
    });
    this.store.select(selectEventDetailsData(eventGuid)).subscribe((data) => {
      this.event = data as EventDetails;
      this.eventLocations = this.sortLocations(this.event.locations);
      this.rsvpFilters = this.event.inviteeFilters ? this.event.inviteeFilters : {rsvp:[], university:[], dietaryRequirements:[]};
      this.eventPhoto = this.event.downloadedEventImage as EventPhoto || { eventImage:{ base64: this.event.eventImage, fileExtention:`.${this.event.imageExtension}`} as FileContents } as EventPhoto;
      this.viewDocument(this.event.eventImage);
    });   
  }

  eventsPrepopulatedDataSubscription() {
    this.EventPrePopulatedData$ = this.store.pipe(select(selectEventsPrePopulatedData()));
  
    this.EventPrePopulatedData$.subscribe((data) => {
      if (!data || data.bursars.length === 0 && data.locations.length === 0 && data.eventTypes.length === 0) {
        this.store.dispatch(eventsPrePopulatedData());
      } else {
        this.bursars = data.bursars || [];
        this.locations = data.locations || [];
        this.eventTypes = data.eventTypes || [];
      }
    });
  }

  loadProfileImage(): void {
    const {jpeg,jpg,png}=dataUrl;
    const filteredDataUrl = { jpg, png, jpeg };
    if (this.blobResult && this.blobResult.base64 && this.blobResult.fileExtention) {
      this.eventPhotoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        filteredDataUrl[this.blobResult.fileExtention as keyof typeof filteredDataUrl] + this.blobResult.base64
      ) as SafeUrl;
    }
    this.cdr.detectChanges();
  }

  viewDocument(profilePhoto: string): void {
    if (this.event.eventImage) {
      const fileData = eventFileTraverser(this.eventPhoto, profilePhoto);
      this.blobResult = fileData;
      this.loadProfileImage();
    }
  }

  goBack() {
    if (this.isAdmin) {
      this.router.navigate(['/admin/events']);
    } else {
      this.router.navigate(['/application/student/events']);
    }
  }

  isValidAddress(location: EventLocation): boolean {
    return location.address.addressLine2 !== 'N/A' && location.location !== EventsTitles.ONLINE_MEETING_CHECK;
  }

  getAddressLine1(location: EventLocation): string {
    return (location.address.addressLine1 && location.address.addressLine1 !== 'N/A')
      ? location.address.addressLine1 : '-';
  }

  isValidMeetingUrl(location: EventLocation): boolean {
    return !!location.meetingUrl && location.location === EventsTitles.ONLINE_MEETING_CHECK;
  }

  isValidImage(): boolean {
    return this.event.eventImage !== EventsTitles.NOT_AVAILABLE;
  }

  getNotes(rsvpDetails: RsvpDetails) {
    const notes = rsvpDetails.notes === 'N/A' ? `-` : rsvpDetails.notes;
    return notes;
  }

  eventNotEditable() {
    if (this.event.eventStatus) return ['Cancelled', 'Past'].includes(this.event.eventStatus);
    return !this.isPreview;
  }

  handleNewInvitees(invitees: EventUpdate): void {
    this.eventService.updateEvent(this.eventGuid, invitees).subscribe((response) => {
      if (!response.errors) {
        this.snackBar.open(
          'Invitees added successfully!',
          'Dismiss',
          {
            duration: SnackBarDuration.DURATION,
            panelClass: ['success-snackbar'],
          },
        );
        this.store.dispatch(eventDetails({ eventGuid: this.eventGuid }));
        this.store.dispatch(eventSummaryList({ year: this.selectedDate }));
      } else {
        this.snackBar.open(
          'Error adding invitees. Please try again.',
          'Dismiss',
          {
            duration: SnackBarDuration.DURATION,
            panelClass: ['error-snackbar'],
          },
        );
      }
    });
  }

  sortLocations(locations: EventLocation[]): EventLocation[] {
    if (!locations) return [];

    return [...locations].sort((locationOne, locationTwo) => {
      const locationOneOnline = locationOne.location.trim().toLowerCase() === EventsTitles.ONLINE_MEETING_CHECK.toLowerCase();
      const locationTwoOnline = locationTwo.location.trim().toLowerCase() === EventsTitles.ONLINE_MEETING_CHECK.toLowerCase();

      if (locationOneOnline && !locationTwoOnline) return 1;
      if (!locationOneOnline && locationTwoOnline) return -1;
      return 0;
    });
  }

  mapPreviewEvent(formData: PreviewEventFormData): EventDetails {
    return {
      eventName: formData.eventName,
      eventType: formData.eventType,
      eventImage: formData.eventImage?.filebytes ? formData.eventImage.filebytes : EventsTitles.NOT_AVAILABLE,
      downloadedEventImage: formData.eventImage?.filebytes ? formData.eventImage.filebytes : EventsTitles.NOT_AVAILABLE,
      startDate: formData.startDateTime ?? '',
      endDate: formData.endDateTime ?? '',
      eventDescription: formData.description,
      locations: this.mapLocations(formData),
      invitees: this.mapInvitees(formData.invitees),
      inviteeFilters: {
        rsvp: [],
        university: [],
        dietaryRequirements: formData.dietaryRequirements ? ['Yes'] : []
      }
    };
  }

  mapLocations(formData: PreviewEventFormData): EventLocation[] {
    const locations: EventLocation[] = [];
    if (
      formData.eventLocationType === EventLocationTypes.PHYSICAL ||
      formData.eventLocationType === EventLocationTypes.BOTH
    ) {
      formData.physicalLocations.forEach(loc => {
        locations.push({
          location: loc.locationName ?? 'Physical Location',
          address: {
            addressLine1: loc.addressLineOne ?? '',
            addressLine2: loc.addressLineTwo ?? '',
            suburb: loc.suburb ?? '',
            city: loc.city ?? '',
            code: loc.code
          },
          meetingUrl: ''
        });
      });
    }

    if (
      formData.eventLocationType === EventLocationTypes.ONLINE ||
      formData.eventLocationType === EventLocationTypes.BOTH
    ) {
      locations.push({
        location: EventsTitles.ONLINE_MEETING_CHECK,
        address: {
          addressLine1: '',
          addressLine2: '',
          suburb: '',
          city: '',
          code: '0'
        },
        meetingUrl: formData.meetingUrl ?? ''
      });
    }
    return locations.filter(location =>
      location.location !== EventsTitles.ONLINE_MEETING_CHECK || location.meetingUrl.trim().length > 0
    );
  }

  mapInvitees(invitees: PreviewEventFormData['invitees']): InviteeInformation[] {
    return invitees.map(inv => ({
      firstName: inv.name ?? '',
      surname: inv.surname ?? '',
      studentId: inv.studentId,
      universityName: inv.universityName ?? '',
      rsvp: 'Pending',
      location: '',
      dietaryRequirements: '',
      allergies: '',
      notes: ''
    }));
  }

  openImageUpload(): void {
      const dialofRef = this.dialog.open(UploadProfilePictureComponent, {
        maxWidth: DialogDimensions.MAXWIDTH,
        maxHeight: DialogDimensions.MAXHEIGHT,
        width: DialogDimensions.WIDTH_FIFTY,
        data: {isEventImage: true, event:this.event, title:DialogTitles.UPDATE_EVENT_IMAGE, documentType:documentTypeName.EVENT_IMAGE}
      });
      dialofRef.afterClosed().subscribe((data:{studentId:number, file:string})=>{
        const changedFields: EventUpdate = {eventImage: data.file, isCancelled: false};
        this.eventService.updateEvent(this.eventGuid, changedFields).subscribe((response) =>  {
          if (!response.errors) {
            this.snackBar.open(
              'Event image updated successfully!',
              'Dismiss',
              {
                duration: SnackBarDuration.DURATION,
                panelClass: ['success-snackbar'],
              },
            );
            this.store.dispatch(eventDetails({ eventGuid: this.eventGuid }));
            this.store.dispatch(eventSummaryList({ year: this.selectedDate }));
          } else {
            this.snackBar.open(
              'Error updating event image. Please try again.',
              'Dismiss',
              {
                duration: SnackBarDuration.DURATION,
                panelClass: ['error-snackbar'],
              },
            );
          }
        });
      })
    }
  
  openEditEventDialog() {
    const dialogRef = this.dialog.open(EditEventDetailsComponent, {
      maxWidth: DialogDimensions.MAXWIDTH,
      maxHeight: DialogDimensions.MAXHEIGHT,
      width: '90%',
      data: {
        startDate: this.event.startDate,
        endDate: this.event.endDate,
        allLocations: this.eventLocations,
        locations: this.locations,
        eventTypes: this.eventTypes
      },
    });
    
    dialogRef.afterClosed().subscribe(changedFields => {
      if (changedFields) {
        this.eventService.updateEvent(this.eventGuid, changedFields).subscribe((response) =>  {
          if (!response.errors) {
            this.snackBar.open(
              'Event updated successfully!',
              'Dismiss',
              {
                duration: SnackBarDuration.DURATION,
                panelClass: ['success-snackbar'],
              },
            );
            this.store.dispatch(eventDetails({ eventGuid: this.eventGuid }));
            this.store.dispatch(eventSummaryList({ year: this.selectedDate }));
          } else {
            this.snackBar.open(
              'Error updating event. Please try again.',
              'Dismiss',
              {
                duration: SnackBarDuration.DURATION,
                panelClass: ['error-snackbar'],
              },
            );
          }
        });
      }
    });
  }

  cancelEvent() {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      maxWidth: DialogDimensions.MAXWIDTH,
      maxHeight: DialogDimensions.MAXHEIGHT,
      width: '30%',
      data: {
        title: 'Cancel event',
        message: DialogTitles.CONFIRM_EVENT_DELETION,
        dialogType: DialogType.CONFIRM
      }
    });
    dialogRef.afterClosed().subscribe(confirmation=> {
      if (confirmation) {
        const changedFields: EventUpdate = {isCancelled: true};
        this.eventService.updateEvent(this.eventGuid, changedFields).subscribe((response) => {
          if (!response.errors) {
            this.goBack();
          } else {
            this.snackBar.open(
              'Error updating event. Please try again.',
              'Dismiss',
              {
                duration: SnackBarDuration.DURATION,
                panelClass: ['error-snackbar'],
              },
            );
          }
        });
      }
    });
  }
}
