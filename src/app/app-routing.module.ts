import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { RouterModule } from '@angular/router';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { VoucherComponent } from './pages/voucher/voucher.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { ProductComponent } from './pages/product/product.component';
import { PurchaseOrderComponent } from './pages/purchase-order/purchase-order.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { ExcelConverterComponent } from './pages/excel-converter/excel-converter.component';
import { CsvConverterComponent } from './pages/csv-converter/csv-converter.component';
import { UserComponent } from './pages/user/user.component';
import { PrintBarcodeComponent } from './pages/print-barcode/print-barcode.component';
import { SaleComponent } from './pages/sale/sale.component';
import { InvoiceReturnComponent } from './pages/invoice-return/invoice-return.component';
import { ReportComponent } from './pages/report/report.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from '../app/service/auth.guard';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { LoginGuard } from '../app/service/login.guard';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { UserListComponent } from './pages/user-list/user-list.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                { path: '', component: LoginComponent, pathMatch: 'full',  canActivate: [LoginGuard]  },
                { path: 'login', component: LoginComponent,  canActivate: [LoginGuard]  },
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: 'sale',
                            component: SaleComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN', 'CASHIER'] }
                        },
                        {
                            path: 'supplier',
                            component: SupplierComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN'] }
                        },
                        {
                            path: 'voucher',
                            component: VoucherComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN'] }
                        },
                        {
                            path: 'customer',
                            component: CustomerComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN', 'CASHIER'] }
                        },
                        {
                            path: 'product',
                            component: ProductComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN'] }
                        },
                        {
                            path: 'purchase-order',
                            component: PurchaseOrderComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN'] }
                        },
                        {
                            path: 'inventory',
                            component: InventoryComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN', 'CASHIER'] }
                        },
                        {
                            path: 'invoice',
                            component: InvoiceComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN', 'CASHIER'] }
                        },
                        {
                            path: 'excel',
                            component: ExcelConverterComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN'] }
                        },
                        {
                            path: 'csv',
                            component: CsvConverterComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN'] }
                        },
                        {
                            path: 'user',
                            component: UserComponent,
                            canActivate: [authGuard],
                            data: { roles: ['ADMIN'] }
                        },
                        {
                            path: 'user-list',
                            component: UserListComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER'] }
                        },
                        {
                            path: 'print-Barcode',
                            component: PrintBarcodeComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN'] }
                        },
                        {
                            path: 'return',
                            component: InvoiceReturnComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN', 'CASHIER'] }
                        },
                        {
                            path: 'admin-dashboard',
                            component: ReportComponent,
                            canActivate: [authGuard],
                            data: { roles: ['ADMIN'] }
                        },
                        {
                            path: 'reset-password',
                            component: ChangePasswordComponent,
                            canActivate: [authGuard],
                            data: { roles: ['ADMIN'] }
                        },
                        {
                            path: 'my-profile',
                            component: UserProfileComponent,
                            canActivate: [authGuard],
                            data: { roles: ['MANAGER', 'ADMIN', 'CASHIER'] }
                        },
                    ],
                },
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
