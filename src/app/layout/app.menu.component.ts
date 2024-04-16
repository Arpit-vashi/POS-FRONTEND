import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../service/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService
    ) {}

    // ngOnInit() {
    //     this.model = [
    //         {
    //             items: [
    //                 {
    //                     label: 'Sales',
    //                     icon: 'pi pi-fw pi-shopping-bag',
    //                     routerLink: ['/sale'],
    //                 },
    //                 {
    //                     label: 'Product',
    //                     icon: 'pi pi-fw pi-inbox',
    //                     items: [
    //                         {
    //                             label: 'Managae Products',
    //                             icon: 'pi pi-fw pi-tags',
    //                             routerLink: ['/product'],
    //                         },
    //                         {
    //                             label: 'Inventory',
    //                             icon: 'pi pi-fw pi-bars',
    //                             routerLink: ['/inventory'],
    //                         },
    //                         {
    //                             label: 'Print Barcodes',
    //                             icon: 'pi pi-fw pi-book',
    //                             routerLink: ['/print-Barcode'],
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     label: 'Supplier',
    //                     icon: 'pi pi-fw pi-user-plus',
    //                     routerLink: ['/supplier'],
    //                 },
    //                 {
    //                     label: 'Customers',
    //                     icon: 'pi pi-fw pi-user',
    //                     routerLink: ['/customer'],
    //                 },
    //                 {
    //                     label: 'Vouchers',
    //                     icon: 'pi pi-fw pi-ticket',
    //                     routerLink: ['/voucher'],
    //                 },
    //                 {
    //                     label: 'Billing',
    //                     icon: 'pi pi-fw pi-th-large',
    //                     items: [
    //                         {
    //                             label: 'Invoice',
    //                             icon: 'pi pi-fw pi-book',
    //                             routerLink: ['/invoice'],
    //                         },
    //                         {
    //                             label: 'Return',
    //                             icon: 'pi pi-fw pi-refresh',
    //                             routerLink: ['/return'],
    //                         },
    //                         {
    //                             label: 'Purchase Order',
    //                             icon: 'pi pi-fw pi-box',
    //                             routerLink: ['/purchase-order'],
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     label: 'User',
    //                     icon: 'pi pi-fw pi-id-card',
    //                     routerLink: ['/user'],
    //                 },
    //                 {
    //                     label: 'Admin Dashboard',
    //                     icon: 'pi pi-fw pi-chart-bar',
    //                     routerLink: ['/admin-dashboard'],
    //                 },
    //                 {
    //                     label: 'Utils',
    //                     icon: 'pi pi-fw pi-th-large',
    //                     items: [
    //                         {
    //                             label: 'Excel To CSV',
    //                             icon: 'pi pi-fw pi-file-excel',
    //                             routerLink: ['/excel'],
    //                         },
    //                         {
    //                             label: 'CSV to Excel',
    //                             icon: 'pi pi-fw pi-file',
    //                             routerLink: ['/csv'],
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //     ];
    // }

    ngOnInit() {
        this.setupMenu();
    }

    private setupMenu() {
        const roles = this.getUserRoles();

        if (roles.includes('ADMIN')) {
            this.model = [
                        {
                            items: [
                                {
                                    label: 'Admin Dashboard',
                                    icon: 'pi pi-fw pi-chart-bar',
                                    routerLink: ['/admin-dashboard'],
                                },
                                {
                                    label: 'Sales',
                                    icon: 'pi pi-fw pi-shopping-bag',
                                    routerLink: ['/sale'],
                                },
                                {
                                    label: 'Product',
                                    icon: 'pi pi-fw pi-inbox',
                                    items: [
                                        {
                                            label: 'Managae Products',
                                            icon: 'pi pi-fw pi-tags',
                                            routerLink: ['/product'],
                                        },
                                        {
                                            label: 'Inventory',
                                            icon: 'pi pi-fw pi-bars',
                                            routerLink: ['/inventory'],
                                        },
                                        {
                                            label: 'Print Barcodes',
                                            icon: 'pi pi-fw pi-book',
                                            routerLink: ['/print-Barcode'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Supplier',
                                    icon: 'pi pi-fw pi-user-plus',
                                    routerLink: ['/supplier'],
                                },
                                {
                                    label: 'Customers',
                                    icon: 'pi pi-fw pi-user',
                                    routerLink: ['/customer'],
                                },
                                {
                                    label: 'Vouchers',
                                    icon: 'pi pi-fw pi-ticket',
                                    routerLink: ['/voucher'],
                                },
                                {
                                    label: 'Billing',
                                    icon: 'pi pi-fw pi-th-large',
                                    items: [
                                        {
                                            label: 'Invoice',
                                            icon: 'pi pi-fw pi-book',
                                            routerLink: ['/invoice'],
                                        },
                                        {
                                            label: 'Return',
                                            icon: 'pi pi-fw pi-refresh',
                                            routerLink: ['/return'],
                                        },
                                        {
                                            label: 'Purchase Order',
                                            icon: 'pi pi-fw pi-box',
                                            routerLink: ['/purchase-order'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Manage Users',
                                    icon: 'pi pi-fw pi-users',
                                    items: [
                                        {
                                            label: 'User',
                                            icon: 'pi pi-fw pi-id-card',
                                            routerLink: ['/user'],
                                        },
                                        {
                                            label: 'Reset Password',
                                            icon: 'pi pi-fw pi-unlock',
                                            routerLink: ['/reset-password'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Utils',
                                    icon: 'pi pi-fw pi-th-large',
                                    items: [
                                        {
                                            label: 'Excel To CSV',
                                            icon: 'pi pi-fw pi-file-excel',
                                            routerLink: ['/excel'],
                                        },
                                        {
                                            label: 'CSV to Excel',
                                            icon: 'pi pi-fw pi-file',
                                            routerLink: ['/csv'],
                                        },
                                    ],
                                },
                                {
                                    label: 'My Profile',
                                    icon: 'pi pi-fw pi-user',
                                    routerLink: ['/my-profile'],
                                },
                            ],
                        },
            ];
        } else if (roles.includes('MANAGER')) {
            this.model = [
                {
                    items: [
                        {
                            label: 'Sales',
                            icon: 'pi pi-fw pi-shopping-bag',
                            routerLink: ['/sale'],
                        },
                        {
                            label: 'Product',
                            icon: 'pi pi-fw pi-inbox',
                            items: [
                                {
                                    label: 'Managae Products',
                                    icon: 'pi pi-fw pi-tags',
                                    routerLink: ['/product'],
                                },
                                {
                                    label: 'Inventory',
                                    icon: 'pi pi-fw pi-bars',
                                    routerLink: ['/inventory'],
                                },
                                {
                                    label: 'Print Barcodes',
                                    icon: 'pi pi-fw pi-book',
                                    routerLink: ['/print-Barcode'],
                                },
                            ],
                        },
                        {
                            label: 'Supplier',
                            icon: 'pi pi-fw pi-user-plus',
                            routerLink: ['/supplier'],
                        },
                        {
                            label: 'Customers',
                            icon: 'pi pi-fw pi-user',
                            routerLink: ['/customer'],
                        },
                        {
                            label: 'Vouchers',
                            icon: 'pi pi-fw pi-ticket',
                            routerLink: ['/voucher'],
                        },
                        {
                            label: 'Billing',
                            icon: 'pi pi-fw pi-th-large',
                            items: [
                                {
                                    label: 'Invoice',
                                    icon: 'pi pi-fw pi-book',
                                    routerLink: ['/invoice'],
                                },
                                {
                                    label: 'Return',
                                    icon: 'pi pi-fw pi-refresh',
                                    routerLink: ['/return'],
                                },
                                {
                                    label: 'Purchase Order',
                                    icon: 'pi pi-fw pi-box',
                                    routerLink: ['/purchase-order'],
                                },
                                {
                                    label: 'My Profile',
                                    icon: 'pi pi-fw pi-user',
                                    routerLink: ['/my-profile'],
                                },
                            ],
                        },
                        {
                            label: 'User',
                            icon: 'pi pi-fw pi-id-card',
                            routerLink: ['/user-list'],
                        },
                        {
                            label: 'Utils',
                            icon: 'pi pi-fw pi-th-large',
                            items: [
                                {
                                    label: 'Excel To CSV',
                                    icon: 'pi pi-fw pi-file-excel',
                                    routerLink: ['/excel'],
                                },
                                {
                                    label: 'CSV to Excel',
                                    icon: 'pi pi-fw pi-file',
                                    routerLink: ['/csv'],
                                },
                            ],
                            
                        },
                        {
                            label: 'My Profile',
                            icon: 'pi pi-fw pi-user',
                            routerLink: ['/my-profile'],
                        },
                    ],
                },
            ];
        } else if (roles.includes('CASHIER')) {
            this.model = [
                {
                    items: [
                        {
                            label: 'Sales',
                            icon: 'pi pi-fw pi-shopping-bag',
                            routerLink: ['/sale'],
                        },
                        {
                            label: 'Customers',
                            icon: 'pi pi-fw pi-user',
                            routerLink: ['/customer'],
                        },
                        // {
                        //     label: 'Products',
                        //     icon: 'pi pi-fw pi-tags',
                        //     routerLink: ['/product'],
                        // },
                        {
                            label: 'Inventory',
                            icon: 'pi pi-fw pi-bars',
                            routerLink: ['/inventory'],
                        },
                        {
                            label: 'Invoice',
                            icon: 'pi pi-fw pi-book',
                            routerLink: ['/invoice'],
                        },
                        {
                            label: 'Return',
                            icon: 'pi pi-fw pi-refresh',
                            routerLink: ['/return'],
                        },
                        {
                            label: 'My Profile',
                            icon: 'pi pi-fw pi-user',
                            routerLink: ['/my-profile'],
                        },
                    ],
                },
            ];
        } else {
            // If no roles match, log the user out
            this.authService.logout();
        }
    }

    private getUserRoles(): string[] {
        const roles = localStorage.getItem('roles');
        return roles ? roles.split(', ') : [];
    }
}
