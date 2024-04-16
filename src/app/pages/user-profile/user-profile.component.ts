import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordChangeService } from '../../service/password-change.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [DialogService, MessageService]
})
export class UserProfileComponent implements OnInit {
  email: string | null = null;
  name: string | null = null;
  roles: string | null = null;
  username: string | null = null;
  userID: string | null = null;
  displayModal: boolean = false;
  passwordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private passwordChangeService: PasswordChangeService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.passwordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.fetchAndLogUserData();
  }

  fetchAndLogUserData(): void {
    this.email = localStorage.getItem('email');
    this.name = localStorage.getItem('name');
    this.roles = localStorage.getItem('roles');
    this.username = localStorage.getItem('username');
    this.userID = localStorage.getItem('userID')

    console.log(this.userID)
  }

  showChangePasswordDialog(): void {
    this.displayModal = true; // Trigger display of the dialog
  }

  changePassword(): void {
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Passwords do not match or are invalid'});
      return;
    }

    let userId = parseInt(this.userID);
    console.log(userId)
    if (userId) {
      this.passwordChangeService.changePassword(userId, this.passwordForm.value.newPassword).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Password changed successfully'});
          this.displayModal = false;
          this.passwordForm.reset();
        },
        error: (error) => {
          this.messageService.add({severity: 'error', summary: 'Failed', detail: 'Failed to change password: ' + error.message});
        }
      });
    } else {
      this.messageService.add({severity: 'error', summary: 'Failed', detail: 'No user ID found.'});
    }
  }
  

  cancelChange(): void {
    this.displayModal = false;
    this.passwordForm.reset();
  }
  
  logout() {
    this.authService.logout();
}
}
