import { CanActivateFn, Router } from '@angular/router';

export const successGuard: CanActivateFn = (route, state) => {
  const previousUrl = state.url;
  const timestamp = previousUrl.match(/\d+/)?.[0];
  const isPreviousApplicationRoute =
    timestamp && isWithinOneMinute(parseInt(timestamp));
  if (!isPreviousApplicationRoute) {
    return false;
  }
  return true;
};

function isWithinOneMinute(timestamp: number): boolean {
  const currentTimestamp = Date.now();
  const oneMinuteInMillis = 60 * 1000;
  return Math.abs(currentTimestamp - timestamp) <= oneMinuteInMillis;
}
