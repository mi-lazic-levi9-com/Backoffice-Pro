import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, take, tap, throwError } from 'rxjs';

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

  updateUser(userId: string, updatedUserData: Partial<IUser>) {
    const prevUsers = this.usersSignal();
    const userIndex = prevUsers.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return throwError(() => new Error(`User with id ${userId} not found.`));
    }

    // Optimistic update
    const updatedUsers = [...prevUsers];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      ...updatedUserData,
    };
    this.usersSignal.set(updatedUsers);

    return this.httpClient
      .put<{ user: IUser }>(`http://localhost:3000/users/${userId}`, updatedUserData)
      .pipe(
        tap((response) => {
          // If backend returns the final state, we can update again to be sure
          const finalUsers = [...this.usersSignal()];
          const finalUserIndex = finalUsers.findIndex((u) => u.id === userId);
          if (finalUserIndex !== -1) {
            finalUsers[finalUserIndex] = response.user;
            this.usersSignal.set(finalUsers);
          }
        }),
        catchError((error) => {
          // Rollback on error
          this.usersSignal.set(prevUsers);
          return throwError(
            () =>
              new Error(
                `Failed to update user ${userId}: ${error?.message ?? 'Unknown error occurred'}`,
              ),
          );
        }),
      );
  }

  createNewUser(newUserData: Omit<IUser, 'id' | 'image'>) {
    const tempId = `temp-${Date.now()}`;
    const tempUser: IUser = {
      ...newUserData,
      id: tempId,
      image: { src: 'default-user.jpg' }, // Placeholder image
    };

    // Optimistic update
    this.usersSignal.update((users) => [...users, tempUser]);

    return this.httpClient.post<{ user: IUser }>(`http://localhost:3000/users`, newUserData).pipe(
      tap((response) => {
        // Sync with real data from backend
        this.usersSignal.update((users) => {
          const userIndex = users.findIndex((u) => u.id === tempId);
          if (userIndex !== -1) {
            const updatedUsers = [...users];
            updatedUsers[userIndex] = response.user;
            return updatedUsers;
          }
          return users;
        });
      }),
      catchError((error) => {
        // Rollback on error
        this.usersSignal.update((users) => users.filter((u) => u.id !== tempId));
        return throwError(
          () => new Error(`Failed to create user: ${error?.message ?? 'Unknown error occurred'}`),
        );
      }),
    );
  }

  getUserById(id: string): Observable<IUser | null> {
    if (this.loadedUsers().length > 0) {
      const user = this.loadedUsers().find((u) => u.id === id);
      return of(user || null);
    } else {
      return this.loadUsers().pipe(
        take(1),
        map(() => {
          const user = this.usersSignal().find((u) => u.id === id);
          return user || null;
        }),
      );
    }
  }
}
