import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  image: {
    src: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);
  private usersSignal = signal<IUser[]>([]);
  loadedUsers = this.usersSignal.asReadonly();

  loadUsers() {
    return this.fetchUsers('http://localhost:3000/users');
  }

  private fetchUsers(url: string) {
    return this.httpClient.get<{ users: IUser[] }>(url).pipe(
      map((resData) => {
        return resData.users;
      }),
      tap((users) => this.usersSignal.set(users)),
    );
  }

  removeUser(userId: string) {
    const prevUsers = this.usersSignal();

    //optimistic update
    if (prevUsers.some((u) => u.id === userId)) {
      this.usersSignal.set(prevUsers.filter((u) => u.id !== userId));
    }

    return this.httpClient.delete(`http://localhost:3000/users/${userId}`).pipe(
      catchError((error) => {
        //because of optimistic update
        this.usersSignal.set(prevUsers);
        return throwError(
          () =>
            new Error(
              `Failed to delete user ${userId}: ${error?.message ?? 'Unknown error occurred'}`,
            ),
        );
      }),
    );
  }
}
