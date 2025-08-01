import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { SnackBarMessage } from '../../enums/snackBarMessage';
import { SnackBarDuration } from '../../enums/snackBarDuration';
@Injectable({
  providedIn: 'root',
})
export class CacheService {
  public lastInteractedItem$ = new BehaviorSubject<any>(null);

  constructor(private Snackbar: MatSnackBar) {}

  set(key: string, data: any): void {
    try {
      const stringifiedData = JSON.stringify(data);
      sessionStorage.setItem(key, stringifiedData);
      this.lastInteractedItem$.next(data);
    } catch (e) {
      this.Snackbar.open(SnackBarMessage.FAILURE, 'Close', { duration: SnackBarDuration.DURATION });
    }
  }

  get<T = any>(key: string): T {
    try {
      const stringifiedData = sessionStorage.getItem(key);
      if (stringifiedData) {
        const data = JSON.parse(stringifiedData);
        this.lastInteractedItem$.next(data);
        return data as T;
      }

      this.lastInteractedItem$.next(null);
      return '' as T; 
    } catch (e) {
      this.lastInteractedItem$.next(null);
      return '' as T;
    }
  }
  clear(key: string): void {
    try {
      sessionStorage.removeItem(key); 
      this.lastInteractedItem$.next(null);
    } catch (e) {
      
      this.lastInteractedItem$.next(null); 
    }
  }
}
