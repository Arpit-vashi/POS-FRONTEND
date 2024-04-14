import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from '../service/auth.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];
    username: string | null = '';

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;
    constructor(public layoutService: LayoutService, private authService: AuthService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.fetchUsername();
    }

    private fetchUsername() {
        this.username = localStorage.getItem('username') || 'Unknown'; 
    }

    logout() {
        this.authService.logout();
        this.messageService.add({severity:'success', summary:'Logout Successful', detail:'You have been logged out.'});
    }
}
