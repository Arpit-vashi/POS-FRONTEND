import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { PasswordChangeService } from '../../service/password-change.service';
import { UserResponse } from '../../model/user/user-response.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ConfirmationService, MessageService, DialogService]
})
export class ChangePasswordComponent implements OnInit {
  users: UserResponse[] = [];
  displayModal: boolean = false;
  passwordForm: FormGroup;
  selectedUserId: number | null = null;
  selectedUsername: string | null = null;

  constructor(
    private userService: UserService,
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
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(users => this.users = users);
  }

  showChangePasswordDialog(userId: number): void {
    this.selectedUserId = userId;
    
    this.displayModal = true;
  }

  changePassword(): void {
    // Ensure passwords match before proceeding
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Passwords do not match or are invalid'});
      console.error('Password change error: Passwords do not match.');
      return;
    }
    // Log the data to be sent
    if (this.selectedUserId) {
      console.log(`Attempting to change password for user ID: ${this.selectedUserId}`);
      console.log(`New Password: ${this.passwordForm.value.newPassword}`); // Be cautious about logging sensitive data in production
  
      this.passwordChangeService.changePassword(this.selectedUserId, this.passwordForm.value.newPassword).subscribe({
        next: () => {
          console.log('Password successfully changed for user ID:', this.selectedUserId);
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Password changed successfully'});
          this.displayModal = false;
          this.passwordForm.reset();
        },
        error: (error) => {
          console.error('Failed to change password:', error);
          this.messageService.add({severity: 'error', summary: 'Failed', detail: 'Failed to change password: ' + error.message});
        }
      });
    } else {
      console.error('Password change error: No user ID selected.');
    }
  }

  cancelChange(): void {
    this.displayModal = false;
    this.passwordForm.reset();
    this.messageService.add({severity: 'info', summary: 'Cancelled', detail: 'Password change cancelled'});
  }
}  
