import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "./../../service/auth.service";

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent {

  constructor(private authService: AuthService) {}

    navigateToLogin() {
      this.authService.logout();
    }

}
