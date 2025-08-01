import { Component, ContentChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { BackgroundImageService } from '../../data-access/services/background-image.service';
import { UserStore } from '../../data-access/stores/user.store';
import { Router } from '@angular/router';
import { Roles, UserAttributes } from '../../../authentication/data-access/models/auth.model';

@Component({
  selector: 'app-landing-screen',
  templateUrl: './landing-screen.component.html',
  styleUrl: './landing-screen.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class LandingScreenComponent {
  @ContentChild('adminContentProjection') adminContent: ElementRef | undefined;
  @ContentChild('studentContentProjection') studentContent: ElementRef | undefined;
  userRole!: Roles;
  isLoggedIn: boolean = false;
  userDetails!: UserAttributes;
  administrativeRoles = [Roles.admin, Roles.finance];
  isAdmin = false;
  url: string = '';
   hasAdminContent: boolean = false;
   hasStudentContent: boolean = false;
  @Input() backgroundImageUrl: string = '';
   rolesEnum: typeof Roles = Roles;
  constructor(
    private backgroundImageService: BackgroundImageService,
    private userStore: UserStore,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.backgroundImageUrl = this.backgroundImageService.getRandomBackgroundImage();
    this.url = this.router.url;
    this.userStore.get().subscribe((user) => {
      this.userRole = Roles[user.role as keyof typeof Roles];
      this.isLoggedIn = user.isLoggedIn;
      this.userDetails = user;
    });
  }

  ngAfterContentInit(): void {
    this.hasAdminContent = !!this.adminContent;
    this.hasStudentContent = !!this.studentContent;
  }
  successScreenRoute(): boolean {
    if (
      this.router.url.includes('legal/agreements/privacy-policy') ||
      this.router.url.includes('legal/agreements/terms-conditions') ||
      this.router.url.includes('/unauthorised') ||
      this.router.url.includes('/forbidden') ||
      this.router.url.includes('/maintenance') ||
      this.router.url.includes('/not-found')
    ) {
      return true;
    }
    return false;
  }
}
