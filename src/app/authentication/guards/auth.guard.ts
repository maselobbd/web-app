import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../data-access/services/auth.service';
import { inject } from '@angular/core';
import { Roles } from '../data-access/models/auth.model';
import { UserStore } from '../../shared/data-access/stores/user.store';

const adminRoutes: string[] = ['/admin'];
const universityRoutes: string[] = ['/dashboard', '/application'];
const financeRoutes: string[] = ['/finance'];

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userStore = inject(UserStore);

  const isLoggedIn = authService.loggedIn();
  const rolesEnum: typeof Roles = Roles;
  let userRole: Roles=Roles.HOD;
  const administrativeRoles = [rolesEnum.admin, rolesEnum.finance];


  userStore.get().subscribe((user) => (userRole = Roles[user.role as keyof typeof Roles || user.rank as keyof typeof Roles]));

  // TODO: Implement this switch statement when the roles have been established
  //        Assume no role == university
  // case Roles[Roles.finance]:
  //   // If it is a finance user, they are unauthorised to view admin or university routes
  //   if (
  //     adminRoutes.some((route) => state.url.includes(route)) ||
  //     universityRoutes.some((route) => state.url.includes(route))
  //   ) {
  //     return router.createUrlTree(['']);
  //   }
  //   break;

  // case Roles[Roles.admin]:
  //   // If it is an admin user, they are unauthorised to view university routes
  //   if (universityRoutes.some((route) => state.url.includes(route))) {
  //     return router.createUrlTree(['unauthorised']);
  //   }
  //   break;
  // }
  if (
    adminRoutes.some((route) => state.url.includes(route)) &&
    !administrativeRoles.includes(userRole)
  ) {
    return router.createUrlTree(['unauthorised']);
  }

  return isLoggedIn;
};
