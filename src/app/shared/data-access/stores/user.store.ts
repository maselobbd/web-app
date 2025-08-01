import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserAttributes } from '../../../authentication/data-access/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private store = new BehaviorSubject<UserAttributes>(
    new Object() as UserAttributes,
  );
  private state$ = this.store.asObservable();

  set(user: UserAttributes) {
    this.store.next(user);
  }

  get() {
    return this.state$;
  }

  getLatestSnapshot() {
    this.store.getValue();
  }
}
