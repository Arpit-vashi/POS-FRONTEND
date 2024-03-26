import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './pages/notfound/notfound.component';
// import { ProductsComponent, ProductComponent } from './pages/products/products.component';
import { InputTextModule} from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule} from 'primeng/inputnumber';
import { DropdownModule} from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule} from 'primeng/table';
import { BarcodeComponent } from './pages/barcode/barcode.component';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { ToastModule} from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DialogModule} from 'primeng/dialog';
import { CalendarModule} from 'primeng/calendar';
import { InputTextareaModule} from 'primeng/inputtextarea';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { HttpClientModule } from '@angular/common/http';
import { VoucherComponent } from './pages/voucher/voucher.component';
import { CustomerComponent } from './pages/customer/customer.component';
import {FileUploadModule} from 'primeng/fileupload';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {MultiSelectModule} from 'primeng/multiselect';
import { ProductComponent } from './pages/product/product.component';
import { PurchaseOrderComponent } from './pages/purchase-order/purchase-order.component';
import { InventoryComponent } from './pages/inventory/inventory.component';

@NgModule({
    declarations: 
    [
        InventoryComponent,
        ProductComponent,
        CustomerComponent,
        BarcodeComponent,
        AppComponent,
        NotfoundComponent,
        SupplierComponent,
        VoucherComponent,
        PurchaseOrderComponent
        
    ],

    imports: 
    [
        MultiSelectModule,
        ConfirmDialogModule,
        FileUploadModule,
        ReactiveFormsModule,
        HttpClientModule,
        InputTextareaModule,
        CalendarModule,
        DialogModule,
        CommonModule,
        ChartModule,
        ToastModule,
        TableModule,
        ButtonModule,
        DropdownModule,
        InputNumberModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        AppRoutingModule, 
        AppLayoutModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        MessageService,
        ConfirmationService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
