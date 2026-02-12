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
  users = this.usersService.loadedUsers;

  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.usersService.loadUsers().subscribe({
      complete: () => {
        this.isFetching.set(false);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onDelete(userId: string, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    const subscription = this.usersService.removeUser(userId).subscribe({
      next: () => {
        console.log('deleting user with id ', userId);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
