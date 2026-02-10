import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { IUser, UsersService } from './users.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  usersService = inject(UsersService);
  private destroyRef = inject(DestroyRef);
  isFetching = signal(false);
  users = signal<IUser[]>([]);

  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.usersService.loadUsers().subscribe({
      next: (users) => {
        this.users.set(users);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
