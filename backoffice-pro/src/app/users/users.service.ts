import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';

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
  private users = signal<IUser[]>([]);
  loadedUsers = this.users.asReadonly();

  loadUsers() {
    return this.fetchUsers('http://localhost:3000/users');
  }

  private fetchUsers(url: string) {
    return this.httpClient.get<{ users: IUser[] }>(url).pipe(
      map((resData) => {
        return resData.users;
      }),
    );
  }
}
