import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { IUser, UsersService } from '../users.service';
import { Observable, of } from 'rxjs';
import { inject } from '@angular/core';

export const userResolver: ResolveFn<IUser | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<IUser | null> => {
  const userService = inject(UsersService);
  const userId = route.paramMap.get('id');

  if (!userId || userId === 'new') {
    return of(null);
  }

  return userService.getUserById(userId);
};
