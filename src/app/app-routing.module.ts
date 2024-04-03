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
// import { ReportComponent } from './pages/report/report.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        { path: '', component:  SaleComponent},
                        {path: 'supplier', component: SupplierComponent},
                        {path: 'voucher', component: VoucherComponent},
                        {path: 'customer', component: CustomerComponent},
                        {path: 'product', component: ProductComponent},
                        {path: 'purchase-order', component: PurchaseOrderComponent},
                        {path: 'inventory', component: InventoryComponent},
                        {path: 'invoice', component: InvoiceComponent},
                        {path: 'excel', component: ExcelConverterComponent},
                        {path: 'csv', component: CsvConverterComponent},
                        {path: 'user', component: UserComponent},
                        {path: 'print-Barcode', component: PrintBarcodeComponent},
                        {path: 'return', component: InvoiceReturnComponent},
                        // {path: 'report', component: ReportComponent},

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
