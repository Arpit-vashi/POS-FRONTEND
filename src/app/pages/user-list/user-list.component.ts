import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { RoleService } from '../../service/role.service';
import { UserRequest } from '../../model/user/user-request.model';
import { UserResponse } from '../../model/user/user-response.model';
import { RoleResponse } from '../../model/role/role-response.model';
import { MessageService } from 'primeng/api';
import { PdfGeneratorComponent } from '../pdf-generator/pdf-generator.component';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{
  @ViewChild(PdfGeneratorComponent) pdfGenerator: PdfGeneratorComponent;
  userForm: FormGroup;
  roles: RoleResponse[];
  users: UserResponse[];
  clonedUsers: { [s: number]: UserResponse } = {};
selectedRole: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private messageService: MessageService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      role: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.refreshUsers();
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(
      roles => this.roles = roles,
      error => this.messageService.add({
        severity: 'error', summary: 'Error', detail: 'Failed to load roles',
      })
    );
  }

  onRoleChange(roles: any[]): void {
    this.userForm.get('role').setValue(roles);
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const selectedRole = this.userForm.value.role;
      const userData: UserRequest = {
        username: this.userForm.value.username,
        password: this.userForm.value.password,
        name: this.userForm.value.fullName,
        email: this.userForm.value.email,
        phone: this.userForm.value.phone,
        roles: [selectedRole]
      };
      
      // Log the form data
      console.log('Form data being sent:', userData);
  
      this.userService.createUser(userData).subscribe(
        response => {
          this.messageService.add({
            severity: 'success', summary: 'Success', detail: 'User created successfully'
          });
          this.userForm.reset();
          this.refreshUsers();
        },
        error => {
          console.error('Error creating user:', error);
          this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Failed to create user',
          });
        }
      );
    }
  }
  
  

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(
      response => {
        this.messageService.add({
          severity: 'success', summary: 'Success', detail: 'User deleted successfully'
        });
        this.refreshUsers();
      },
      error => {
        console.error('Error deleting user:', error);
        this.messageService.add({
          severity: 'error', summary: 'Error', detail: 'Failed to delete user',
        });
      }
    );
  }

  extractRoleName(selectedRole: any): string {
    return selectedRole ? selectedRole.roleName : '';
}

  refreshUsers(): void {
    this.userService.getAllUsers().subscribe(
      users => {
        this.users = users;
        console.log('Data being displayed in the table:', this.users); // Logging the users array
      },
      error => {
        console.error('Error fetching users:', error);
        this.messageService.add({
          severity: 'error', summary: 'Error', detail: 'Failed to fetch users',
        });
      }
    );
  }

  onRowEditInit(user: UserResponse): void {
    this.clonedUsers[user.userID] = { ...user };
  }

  onRowEditSave(user: UserResponse): void {
    const userRequest: UserRequest = {
      username: user.username,
      password: 'somePassword', 
      name: user.name,
      email: user.email,
      phone: user.phone,
      roles: user.roles.map(role => role.roleID)
    };
  
    this.userService.updateUser(user.userID, userRequest).subscribe(
      response => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User updated successfully'
        });
        delete this.clonedUsers[user.userID];
      },
      error => {
        console.error('Error updating user:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update user: ' + error.message
        });
      }
    );
  }
  

  onRowEditCancel(user: UserResponse, index: number): void {
    this.users[index] = this.clonedUsers[user.userID];
    delete this.clonedUsers[user.userID];
  }

  downloadPdf(): void {
    const pdfData = this.users.map(user => ({
      'User ID': user.userID,
      Username: user.username,
      'Full Name': user.name,
      Email: user.email,
      Phone: user.phone,
      Role: user.roles.map(role => role.roleName).join(', ')
    }));

    this.pdfGenerator.tableData = pdfData;
    this.pdfGenerator.fileName = 'User_List';
    this.pdfGenerator.generatePDF();
  }

}
