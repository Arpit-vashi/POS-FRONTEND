import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          this.router.navigate(['/sale']);
          return false;
        }
        return true;
      })
    );
  }
}
