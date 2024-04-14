import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  email: string | null = null;
  name: string | null = null;
  roles: string | null = null;
  username: string | null = null;

  constructor(private authService: AuthService,) { }

  ngOnInit(): void {
    this.fetchAndLogUserData();
  }

  private fetchAndLogUserData(): void {
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');
    this.roles = localStorage.getItem('roles');
    this.username = localStorage.getItem('username');
  
    console.log('Email:', this.email);
    console.log('Name:', this.name);
    console.log('Roles:', this.roles);
    console.log('Username:', this.username);
  }
  
  logout() {
    this.authService.logout();
}
}
