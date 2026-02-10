import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map, Observable, of, switchMap, timer } from 'rxjs';

// This would typically be in its own file and make a real HTTP request
function emailIsTaken(control: AbstractControl): Observable<ValidationErrors | null> {
  // A mock API call that checks if the email is 'test@example.com'
  const checkEmail = (email: string) => {
    const isTaken = email === 'test@example.com';
    return of(isTaken);
  };

  return timer(500).pipe(
    switchMap(() => checkEmail(control.value)),
    map((isTaken) => (isTaken ? { emailIsTaken: true } : null)),
  );
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailIsTaken],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      {
        // validators: [equalPasswords],
      },
    ),
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    adress: new FormGroup({
      street: new FormControl('', {
        validators: [Validators.required],
      }),
      number: new FormControl('', {
        validators: [Validators.required],
      }),
      postalCode: new FormControl('', {
        validators: [Validators.required],
      }),
      city: new FormControl('', {
        validators: [Validators.required],
      }),
    }),
    source: new FormArray([new FormControl(false), new FormControl(false), new FormControl(false)]),
    role: new FormControl<'student' | 'teacher' | 'employee' | 'founder' | 'other'>('student', {
      validators: [Validators.required],
    }),
    agree: new FormControl(false, {
      validators: [Validators.required],
    }),
  });

  get emailControl() {
    return this.form.controls.email;
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
