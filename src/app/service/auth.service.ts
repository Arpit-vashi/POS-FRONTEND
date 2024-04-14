import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:8080/auth/api/v1'; // Base URL for auth endpoints
  private isLoggedInSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const token = localStorage.getItem('accessToken');
    this.isLoggedInSubject = new BehaviorSubject<boolean>(!!token);
  }

  // Observable to expose the login status
  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Login method
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post<any>(`${this.authUrl}/login`, loginData).pipe(
      tap(response => {
        // Assume the response object has a token
        if (response && response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('email', response.email);
          localStorage.setItem('name', response.name);
          localStorage.setItem('roles', response.roles.join(', '));
          localStorage.setItem('username', response.username);
          this.isLoggedInSubject.next(true); // Update the login status
        }
      }),
      catchError(error => {
        // Handle error
        throw 'Login failed due to server error'; // Rethrow or handle as needed
      })
    );
  }

  // Logout method
  logout(): void {
    const accessToken = localStorage.getItem('accessToken');
    const options = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      })
    };

    this.http.post(`${this.authUrl}/logout`, {}, options).subscribe({
      next: () => this.clearLocalStorageAndNavigate(),
      error: (error) => {
        console.error('Logout failed', error);
        this.clearLocalStorageAndNavigate(); // Optionally clear on error
      }
    });
  }

  // Helper method to clear local storage and navigate to login
  private clearLocalStorageAndNavigate() {
    localStorage.clear();
    this.isLoggedInSubject.next(false); // Update the login status
    this.router.navigate(['/login']);
  }
}
