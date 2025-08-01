import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { ConfigurationService } from '../../../home/data-access/services/configuration.service';
import { Observable } from 'rxjs';
import { IResponse } from '../../data-access/models/response.models';

export const maintenanceResolver: ResolveFn<Observable<IResponse<boolean>>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<IResponse<boolean>> => {
  const configurationService = inject(ConfigurationService);
  return configurationService.getMaintenanceValue('Maintenance');
};