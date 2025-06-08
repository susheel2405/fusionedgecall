import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private loggedIn = false;

  // login(username: string, password: string): boolean {
  //   if (username === 'admin' && password === 'admin') {
  //     this.loggedIn = true;
  //     return true;
  //   }
  //   return false;
  // }

  // logout(): void {
  //   this.loggedIn = false;
  // }

  // isAuthenticated(): boolean {
  //   return this.loggedIn;
  // }

  private readonly AUTH_KEY = 'isAuthenticated';

  login(username: string, password: string): boolean {
    if (username === 'admin@gmail.com' && password === 'admin') {
      localStorage.setItem(this.AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }
}
