import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.isLoggedIn$.pipe(
      map(isLoggedIn => {
        if (state.url.includes('/login') && isLoggedIn) {
          // Redirect to '/sale' if user is already logged in and tries to access '/login'
          this.router.navigate(['/sale']);
          return false;
        } else if (!isLoggedIn) {
          // If user is not logged in and tries to access any protected route
          this.router.navigate(['/login']);
          return false;
        } else {
          // Check if the current route requires specific roles
          const requiredRoles = route.data['roles'] as Array<string>;
          if (requiredRoles) {
            const userRoles = localStorage.getItem('roles');
            if (userRoles) {
              const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
              if (!hasRequiredRole) {
                // Redirect to '/not-authorized' if user does not have the required role
                this.router.navigate(['/not-authorized']);
                return false;
              }
            } else {
              // Redirect to '/not-authorized' if no roles are stored in localStorage
              this.router.navigate(['/not-authorized']);
              return false;
            }
          }
        }
        // Allow access if all checks pass
        return true;
      })
    );
  }
}
