import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule, loggerCallback } from './app/app.module';
import { MSAL_INSTANCE } from '@azure/msal-angular';
import { BrowserCacheLocation, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { theming } from './theme/theme';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;
const currentUrl = encodeURIComponent(window.location.href)

interface Config {
   tenantName: string;
   clientId: string;
   redirectUrl: string;
   policyId: string;
}

const httpClient = new HttpClient(new HttpXhrBackend({build: () => new XMLHttpRequest()}));

async function getConfigurations(currentUrl: string) {
  const response = httpClient.get(`${window.location.origin}/api/config?config=msal&currentUrl=${currentUrl}`)
  return await lastValueFrom(response);
}

const configurations = getConfigurations(currentUrl);
configurations.then(configResponse => {
    const config: Config = configResponse ? configResponse as Config : {
      tenantName: "",
      clientId: "",
      redirectUrl: "",
      policyId: ""
    };
    platformBrowserDynamic([
      {
        provide: MSAL_INSTANCE,
        useValue: new PublicClientApplication({
            auth: {
              clientId: config.clientId,
              authority: `https://${config.tenantName}.b2clogin.com/tfp/${config.tenantName}.onmicrosoft.com/${config.policyId}`,
              knownAuthorities: [`${config.tenantName}.b2clogin.com`],
              redirectUri: config.redirectUrl, // Uri must be registered on Azure. Points to window.location.origin by default.
              navigateToLoginRequestUrl: false,
            },
            cache: {
              cacheLocation: BrowserCacheLocation.LocalStorage,
              storeAuthStateInCookie: isIE, // set to true for IE 11
            },
            system: {
              loggerOptions: {
                loggerCallback,
                logLevel: LogLevel.Warning,
                piiLoggingEnabled: false,
              },
              allowPlatformBroker: false,
            },
          })
      }
    ])
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
      theming(currentUrl)
  }
)
