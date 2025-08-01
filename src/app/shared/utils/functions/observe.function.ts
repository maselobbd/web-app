import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IResponse } from '../../data-access/models/response.models';

type ErrorFunction = (arg: any) => void;

export function observe<T>(
  source: Observable<T>,
  onError?: ErrorFunction,
): Observable<IResponse<T>> {
  return source.pipe(
    map((data: T) => {
      return { results: data } as IResponse<T>;
    }),
    catchError((err) => {
      if (onError) {
        onError(err);
      }
      let error = 'Bad Request';
      if (err.status !== 400) {
        error = err.message;
      }
      return of({
        errors: [error],
      }) as Observable<IResponse<T>>;
    }),
  );
}
