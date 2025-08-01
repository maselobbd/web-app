import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SharedModule } from './shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalRedirectComponent,
  MsalService,
} from '@azure/msal-angular';
import {
  InteractionType,
  LogLevel,
} from '@azure/msal-browser';
import { AuthenticationHeaderInterceptor } from './shared/data-access/interceptors/http.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { FormGroupDirective } from '@angular/forms';
import { LoaderInterceptor } from './shared/data-access/interceptors/loader.interceptor';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ErrorHandler } from '@angular/core';
import { ErrorHandlingService } from './shared/data-access/services/error-handling.service';
import { AppSettingsService } from './shared/data-access/services/app-settings.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { ImagePreloadService } from './shared/data-access/services/imagePreload.service';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

export function loggerCallback(
  logLevel: LogLevel,
  message: string,
  containsPii: boolean,
) {
  // Check if log message contains Personally Identifiable Information (PII) to prevent PII from being logged to console
  if (containsPii) {
    return;
  }
  switch (logLevel) {
    case LogLevel.Error:
      console.error(message);
      break;
    case LogLevel.Warning:
      console.warn(message);
      break;
    case LogLevel.Info:
      console.info(message);
      break;
    case LogLevel.Verbose:
    case LogLevel.Trace:
      // Do nothing - Change if debugging is needed
      break;
  }
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(`https://microsoft.com/`, [``]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [],
    },
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    FlexLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    MsalModule,
    MatDialogModule,
    StoreModule.forRoot({ router: routerReducer }),
    EffectsModule.forRoot({}),
    StoreDevtoolsModule.instrument({ name: 'Ukukhula', maxAge: 25, logOnly: !isDevMode() }),
    StoreRouterConnectingModule.forRoot({}),
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationHeaderInterceptor,
      multi: true,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    FormGroupDirective,
    {
      provide: ErrorHandler,
      useClass: ErrorHandlingService
    },
    AppSettingsService,
    ImagePreloadService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],

})
export class AppModule { }
