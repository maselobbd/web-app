import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { authGuard } from './authentication/guards/auth.guard';
import { NavbarComponent } from './shared/ui/navbar/navbar.component';
import { SideNavMenuComponent } from './shared/ui/side-nav-menu/side-nav-menu.component';
import { NavbarLayoutResolverComponent } from './shared/ui/navbar-layout-resolver/navbar-layout-resolver.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutResolverComponent,
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'dashboard',
    component: NavbarLayoutResolverComponent,
    canActivate: [MsalGuard, authGuard],
    loadChildren: () =>
      import('./university-dashboard/university-dashboard.module').then(
        (m) => m.UniversityDashboardModule,
      ),
  },
  {
    path: 'admin',
    component: SideNavMenuComponent,
    canActivate: [MsalGuard, authGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'application',
    component: NavbarComponent,
    canActivate: [MsalGuard, authGuard],
    loadChildren: () =>
      import('./application/application.module').then(
        (m) => m.ApplicationModule,
      ),
  },
  {
    path: 'reviews',
    component: NavbarComponent,
    loadChildren: () =>
      import('./student/student.module').then((m) => m.StudentModule),
  },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy:PreloadAllModules})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
