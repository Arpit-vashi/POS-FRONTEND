import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../service/auth.service'; // Adjust the path as necessary
import { Router } from '@angular/router'; // Ensure Router is imported

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [MessageService],
})
export class LoginComponent {
    constructor(
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router // Inject the Router
    ) {}

    onSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        // Use bracket notation to access form values
        const username = form['username'].value; 
        const password = form['password'].value;
        this.login(username, password);
    }

    login(username: string, password: string) {
        this.authService.login(username, password).subscribe({
            next: (response) => {
                console.log('Response received:', response);
                this.handleResponse(response);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Login Successful',
                });
            },
            error: (error) => {
                console.error('Error:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Login Failed',
                });
            }
        });
    }

    handleResponse(response: any) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('email', response.email);
        localStorage.setItem('name', response.name);
        localStorage.setItem('roles', response.roles.join(', '));
        localStorage.setItem('username', response.username);
        localStorage.setItem('userID', response.userID);
        this.redirectUser(response.roles.join(', '));
    }

    redirectUser(roles: string) {
        if (roles.includes('CASHIER')) {
            this.router.navigate(['/sale']);
        } else if (roles.includes('MANAGER')) {
            this.router.navigate(['/inventory']);
        } else if (roles.includes('ADMIN')) {
            this.router.navigate(['/admin-dashboard']);
        }
    }
}
