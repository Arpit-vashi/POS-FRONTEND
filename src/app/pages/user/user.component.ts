import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { UserRequest } from '../../model/user/user-request.model';
import { UserResponse } from '../../model/user/user-response.model';
import { MessageService } from 'primeng/api';
import { PdfGeneratorComponent } from '../pdf-generator/pdf-generator.component';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
    editingIndex: number = null;

    @ViewChild(PdfGeneratorComponent) pdfGenerator: PdfGeneratorComponent;
    userForm: FormGroup;
    roles = [
        { label: 'Admin', value: 'Admin' },
        { label: 'Manager', value: 'Manager' },
        { label: 'Cashier', value: 'Cashier' },
    ];
    selectedRole: string;
    users: UserResponse[];
    clonedUsers: { [s: number]: UserResponse } = {};

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private messageService: MessageService
    ) {
        this.userForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
            role: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.refreshUsers();
    }

    onSubmit() {
        if (this.userForm.valid) {
            const selectedRoleValue = this.userForm.get('role').value.value;
            const userData: UserRequest = {
                username: this.userForm.get('username').value,
                password: this.userForm.get('password').value,
                name: this.userForm.get('fullName').value,
                email: this.userForm.get('email').value,
                phone: this.userForm.get('phone').value,
                role: selectedRoleValue,
            };

            this.userService.createUser(userData).subscribe(
                (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User created successfully',
                    });
                    this.userForm.reset();
                    this.refreshUsers();
                },
                (error) => {
                    console.error('Error creating user:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to create user',
                    });
                }
            );
        }
    }

    deleteUser(userId: number) {
        this.userService.deleteUser(userId).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User deleted successfully',
                });
                this.refreshUsers();
            },
            (error) => {
                console.error('Error deleting user:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete user',
                });
            }
        );
    }

    refreshUsers() {
        this.userService.getAllUsers().subscribe(
            (users) => {
                this.users = users;
            },
            (error) => {
                console.error('Error fetching users:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch users',
                });
            }
        );
    }

    onRowEditInit(user: UserResponse) {
        this.clonedUsers[user.userID] = { ...user };
    }

    onRowEditSave(user: UserResponse) {
        this.userService.updateUser(user.userID, user).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User is updated',
                });
                delete this.clonedUsers[user.userID];
            },
            (error) => {
                console.error('Error updating user:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update user',
                });
            }
        );
    }

    onRowEditCancel(user: UserResponse, index: number) {
        this.users[index] = this.clonedUsers[user.userID];
        this.editingIndex = null;
        delete this.clonedUsers[user.userID];
    }

    downloadPdf(): void {
        const pdfData = this.users.map((user) => {
            return {
                'User ID': user.userID,
                Username: user.username,
                'Full Name': user.name,
                Email: user.email,
                Phone: user.phone,
                Role: user.role,
            };
        });

        this.pdfGenerator.tableData = pdfData;
        this.pdfGenerator.fileName = 'User_List';
        this.pdfGenerator.generatePDF();
    }
}
