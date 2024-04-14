import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
          return false;
        }

        const requiredRoles = route.data['roles'] as Array<string>;
        if (requiredRoles) {
          const userRoles = localStorage.getItem('roles');
          const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

          if (!hasRequiredRole) {
            this.router.navigate(['/not-authorized']);
            return false;
          }
        }

        return true;
      })
    );
  }
}
