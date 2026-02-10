import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<{ email: string } | null>(null);
  user$ = this.userSubject.asObservable();

  isAuthenticated$ = this.user$.pipe(map((user) => !!user));

  login(email: string) {
    this.userSubject.next({ email });
  }

  logout() {
    this.userSubject.next(null);
  }

  get isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
