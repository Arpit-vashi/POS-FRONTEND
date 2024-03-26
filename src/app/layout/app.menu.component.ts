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
                    // { label: 'Barcode', icon: 'pi pi-fw pi-check-square', routerLink: ['/barcodes'] },
                    { label: 'Product', icon: 'pi pi-fw pi-tags', routerLink: ['/product'] },
                    { label: 'Customers', icon: 'pi pi-fw pi-user', routerLink: ['/customer'] },
                    { label: 'Supplier', icon: 'pi pi-fw pi-user-plus', routerLink: ['/supplier'] }, 
                    { label: 'Vouchers', icon: 'pi pi-fw pi-ticket', routerLink: ['/voucher'] },
                    { label: 'Purchase Order', icon: 'pi pi-fw pi-box', routerLink: ['/purchase-order'] },
                    { label: 'Inventory', icon: 'pi pi-fw pi-bars', routerLink: ['/inventory'] },
                    { label: 'Invoice', icon: 'pi pi-fw pi-book', routerLink: ['/uikit/input'] },
                    { label: 'Return', icon: 'pi pi-fw pi-refresh', routerLink: ['/uikit/list'] },
                    { label: 'Account', icon: 'pi pi-fw pi-money-bill', routerLink: ['/uikit/tree'] },
                    { label: 'Exmployee', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/panel'] },
                    { label: 'Reports', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/overlay'] },
                    { label: 'Admin', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                ]
            },
        ];
    }
}
