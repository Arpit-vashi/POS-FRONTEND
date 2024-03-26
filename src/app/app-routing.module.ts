import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { VoucherComponent } from './pages/voucher/voucher.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { ProductComponent } from './pages/product/product.component';
import { PurchaseOrderComponent } from './pages/purchase-order/purchase-order.component';
import { InventoryComponent } from './pages/inventory/inventory.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        { path: '', component:  DashboardComponent},
                        {path: 'supplier', component: SupplierComponent},
                        {path: 'voucher', component: VoucherComponent},
                        {path: 'customer', component: CustomerComponent},
                        {path: 'product', component: ProductComponent},
                        {path: 'purchase-order', component: PurchaseOrderComponent},
                        {path: 'inventory', component: InventoryComponent},


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
