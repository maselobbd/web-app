import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutScreenComponent } from './layout-screen/layout-screen.component';
import { UnauthorisedComponent } from '../shared/ui/unauthorised/unauthorised.component';
import { ForbiddenComponent } from '../shared/ui/forbidden/forbidden.component';
import { NotFoundComponent } from '../shared/ui/not-found/not-found.component';
import { MaintenancePageComponent } from '../shared/ui/maintenance-page/maintenance-page.component';
import { maintenanceResolver } from '../shared/utils/functions/routerDataResolvers.function';

const routes: Routes = [
  { 
    path: '',
    resolve: {
      maintenance: maintenanceResolver
    },
    component: LayoutScreenComponent },
  { path: 'unauthorised', component: UnauthorisedComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'not-found', component: NotFoundComponent },
  { 
    path:'maintenance',
    resolve: {
      maintenance: maintenanceResolver
    },
    component: MaintenancePageComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
