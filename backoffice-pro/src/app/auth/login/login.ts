import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { STORED_EMAIL } from '../../../constants';
import { CommonModule } from '@angular/common';

let initialEmail = '';
const storedEmail = window.localStorage.getItem(STORED_EMAIL);
if (storedEmail) {
  initialEmail = JSON.parse(storedEmail).email;
}

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return {
    doesNotContainQuestionMark: true,
  };
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  reactiveForm = new FormGroup({
    email: new FormControl(initialEmail, {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), mustContainQuestionMark],
    }),
  });

  get emailControl() {
    return this.reactiveForm.controls.email;
  }

  get passwordControl() {
    return this.reactiveForm.controls.password;
  }

  onSubmit() {
    const { email, password } = this.reactiveForm.value;
    if (email === 'admin@example.com' && password === '123456?') {
      this.router.navigate(['dashboard']);
    } 
  }

  ngOnInit(): void {
    const subscription = this.reactiveForm.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        window.localStorage.setItem(STORED_EMAIL, JSON.stringify({ email: value.email }));
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
