import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                items: [
                    { label: 'Sales', icon: 'pi pi-fw pi-shopping-bag', routerLink: ['/'] },
                    {
                        label: 'Product',
                        icon: 'pi pi-fw pi-inbox',
                        items: [
                            {
                                label: 'Managae Products',
                                icon: 'pi pi-fw pi-tags',
                                routerLink: ['/product']
                            },
                            {
                                label: 'Inventory',
                                icon: 'pi pi-fw pi-bars',
                                routerLink: ['/inventory']
                            },
                            {
                                label: 'Print Barcodes',
                                icon: 'pi pi-fw pi-book',
                                routerLink: ['/print-Barcode']
                            },
                        ]
                    },
                    { label: 'Supplier', icon: 'pi pi-fw pi-user-plus', routerLink: ['/supplier'] },
                    { label: 'Customers', icon: 'pi pi-fw pi-user', routerLink: ['/customer'] },
                    { label: 'Vouchers', icon: 'pi pi-fw pi-ticket', routerLink: ['/voucher'] },
                    {
                        label: 'Billing',
                        icon: 'pi pi-fw pi-th-large',
                        items: [
                            {
                                label: 'Invoice',
                                icon: 'pi pi-fw pi-book',
                                routerLink: ['/invoice']
                            },
                            {
                                label: 'Return',
                                icon: 'pi pi-fw pi-refresh',
                                routerLink: ['/return']
                            },
                            {
                                label: 'Purchase Order',
                                icon: 'pi pi-fw pi-box',
                                routerLink: ['/purchase-order']
                            },
                        ]
                    },
                    { label: 'User', icon: 'pi pi-fw pi-id-card', routerLink: ['/user'] },
                    { label: 'Admin Dashboard', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/admin-dashboard'] },
                    {
                        label: 'Utils',
                        icon: 'pi pi-fw pi-th-large',
                        items: [
                            {
                                label: 'Excel To CSV',
                                icon: 'pi pi-fw pi-file-excel',
                                routerLink: ['/excel']
                            },
                            {
                                label: 'CSV to Excel',
                                icon: 'pi pi-fw pi-file',
                                routerLink: ['/csv']
                            },
                        ]
                    },
                ]
            },
        ];
    }
}
