import { Inject, Injectable } from '@angular/core';
import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import {
  AccountInfo,
  InteractionStatus,
  RedirectRequest,
  CacheLookupPolicy,
  EventMessage,
  EventType,
} from '@azure/msal-browser';
import { Observable, Subject } from 'rxjs';
import { catchError, filter, map, takeUntil } from 'rxjs/operators';
import { UserStore } from '../../../shared/data-access/stores/user.store';
import { observe } from '../../../shared/utils/functions/observe.function';
import { CacheService } from '../../../shared/data-access/services/cache.service';
import { cacheKeysEnum } from '../../../shared/enums/cacheKeysEnum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _destroying$ = new Subject<void>();
  isLoggedIn: boolean = false;

  constructor(
    @Inject(MSAL_GUARD_CONFIG)
    private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private userStore: UserStore,
    private cacheService: CacheService
  ) {
    this.updateLoggedInStatus();
  }

  updateLoggedInStatus() {
    this.msalBroadcastService.msalSubject$.subscribe((eventMessage: EventMessage) => {
      if(eventMessage.eventType === EventType.INITIALIZE_END) {
        this.getActiveAccount();
        this.msalBroadcastService.inProgress$
        .pipe(
          filter(
            (status: InteractionStatus) => status === InteractionStatus.None,
          ),
          takeUntil(this._destroying$),
        )
        .subscribe(() => {
          this.checkAndSetActiveAccount();
        });
      }
    })
  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  getActiveAccount(): AccountInfo | null {
    const activeAccount: AccountInfo | null = this.authService.instance.getActiveAccount();
    this.updateUserStore(activeAccount);
    return activeAccount;
  }

  getAccessToken(): string {
    return this.authService.instance.getActiveAccount()?.idToken ?? '';
  }

  loggedIn(): boolean {
    this.checkAndSetActiveAccount();
    return this.isLoggedIn;
  }

  private checkAndSetActiveAccount() {
    let activeAccount = this.getActiveAccount();

    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
      this.updateUserStore(this.authService.instance.getActiveAccount());
    } else if (activeAccount) {
      this.updateUserStore(activeAccount);
    } else {
      this.clearUserStore();
    }
  }

  private updateUserStore(account: AccountInfo | null): void {
    if(account) {
        this.isLoggedIn = true;
        this.userStore.set({
        isLoggedIn: true,
        name: (account?.idTokenClaims?.['given_name'] as string)|| '' ,
        surname:   (account?.idTokenClaims?.['family_name'] as string) || '',
        email: account?.idTokenClaims?.emails![0] || '',
        userId: account?.idTokenClaims?.oid || '',
        rank: (account?.idTokenClaims?.['extension_Rank'] as string) || '',
        secondInCharge:
          (account?.idTokenClaims?.['extension_Secondincharge'] as string) || '',
        token: account?.idToken || '',
        university:
          (account?.idTokenClaims?.['extension_University'] as string) || '',
        yearsOfExperience: Number(
          account?.idTokenClaims?.['extension_YearsOfExperience'] || 0,
        ),
        role: (account?.idTokenClaims?.['extension_role'] as string) || '',
        faculty: (account?.idTokenClaims?.['extension_Faculty'] as string) || '',
        department:
          (account?.idTokenClaims?.['extension_Department'] as string) || '',
      });
    }
  }

  private clearUserStore(): void {
    this.isLoggedIn = false;
    this.userStore.set({
      isLoggedIn: false,
      name: '',
      surname:'',
      email: '',
      userId: '',
      rank: '',
      secondInCharge: '',
      token: '',
      yearsOfExperience: 0,
      role: '',
      university: '',
      faculty: '',
      department: '',
    });
  }

  updateToken(): void {
    try {
      this.authService.acquireTokenSilent({
        forceRefresh: true,
        cacheLookupPolicy: CacheLookupPolicy.Skip, // THIS CAUSES THE InteractionRequiredAuthError ERROR in incognito mode or maybe after token expires??!!
        scopes: [],
        account: this.authService.instance.getAllAccounts()[0],
      });
      this.checkAndSetActiveAccount();
    } catch (error: any) {
      this.authService.acquireTokenRedirect({
        scopes: [],
      });
    }
  }

  getIdToken(): Observable<void | string> {
    return this.authService
      .acquireTokenSilent({
        scopes: [],
        account: this.authService.instance.getAllAccounts()[0],
      })
      .pipe(
        map((account) => {
          return account?.idToken ?? '';
        }),
        catchError((err) => {
          return this.authService.instance.acquireTokenRedirect({
            scopes: [],
          });
        }),
      );
  }

  logout() {
    observe(this.authService.logoutRedirect({
      postLogoutRedirectUri: '/',
    })).subscribe(data => {
      if(data) this.clearUserStore();
    });
    this.cacheService.clear(cacheKeysEnum.studentDetails);
    this.destroy();
  }

  destroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}