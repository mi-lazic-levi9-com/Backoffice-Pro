import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser, UsersService } from '../users.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.css'],
})
export class UserDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  user = signal<IUser | undefined>(undefined);
  isNewUserForm = signal(false);
  editForm!: FormGroup;

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId === 'new') {
      this.isNewUserForm.set(true);
      this.initializeForm();
    } else if (userId) {
      const subscription = this.usersService.loadUsers().subscribe({
        next: (users) => {
          this.user.set(users.find((u) => u.id === userId));
        },
        complete: () => {
          this.initializeForm(this.user()!);
        },
      });

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  }

  initializeForm(user?: IUser): void {
    this.editForm = this.fb.group({
      firstName: [user?.firstName, Validators.required],
      lastName: [user?.lastName, Validators.required],
      email: [user?.email, [Validators.required, Validators.email]],
      address: [user?.address, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.isNewUserForm()) {
      this.usersService.createNewUser(this.editForm.value).subscribe(() => {
        this.router.navigate(['/dashboard/users']);
      });
    } else {
      const currentUser = this.user();
      if (this.editForm.valid && currentUser) {
        const updatedUser: IUser = {
          ...currentUser,
          ...this.editForm.value,
        };
        this.usersService.updateUser(updatedUser.id, updatedUser).subscribe(() => {
          this.router.navigate(['/dashboard/users']);
        });
      }
    }
  }

  onCancel(): void {
    if (this.user()) {
      this.initializeForm(this.user()!);
    }
  }

  onGoBack(): void {
    this.location.back();
  }
}
