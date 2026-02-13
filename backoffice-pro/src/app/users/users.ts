import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UsersService } from './users.service';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private router = inject(Router);

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
    this.usersService
      .removeUser(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          console.log('deleting user with id ', userId);
        },
      });
  }

  addUser() {
    this.router.navigate(['dashboard/users/new']);
  }
}
