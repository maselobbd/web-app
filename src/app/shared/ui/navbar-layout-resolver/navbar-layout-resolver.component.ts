import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../authentication/data-access/services/auth.service'; // replace with your actual path
import { Router } from '@angular/router';
import { Roles, UserAttributes } from '../../../authentication/data-access/models/auth.model';
import { UserStore } from '../../data-access/stores/user.store';

@Component({
  selector: 'app-layout-resolver',
  templateUrl: './navbar-layout-resolver.component.html',
})
export class NavbarLayoutResolverComponent implements OnInit {
  userRole!: Roles;
  isLoggedIn: boolean = false;
  userDetails!: UserAttributes;
  administrativeRoles = [Roles.admin, Roles.finance];
  isAdmin = false;
  url: string = '';

  constructor(
    private authService: AuthService,
    private userStore: UserStore,
    private router: Router
  ) {}

  ngOnInit() {
    this.url = this.router.url;
    this.userStore.get().subscribe((user) => {
      this.userRole = Roles[user.role as keyof typeof Roles];
      this.isLoggedIn = user.isLoggedIn;
      this.userDetails = user;
      this.isAdmin = this.administrativeRoles.includes(this.userRole);
    });
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }
}
