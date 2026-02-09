import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<{ email: string } | null>(null);
  user$ = this.userSubject.asObservable();

  login(email: string) {
    this.userSubject.next({ email });
  }

  logout() {
    this.userSubject.next(null);
  }
}
