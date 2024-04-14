import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { VoucherComponent } from './pages/voucher/voucher.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProductComponent } from './pages/product/product.component';
import { PurchaseOrderComponent } from './pages/purchase-order/purchase-order.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { BrowserModule } from '@angular/platform-browser';
import { BadgeModule } from 'primeng/badge';
import { ExcelConverterComponent } from './pages/excel-converter/excel-converter.component';
import { CsvConverterComponent } from './pages/csv-converter/csv-converter.component';
import { UserComponent } from './pages/user/user.component';
import { PdfGeneratorComponent } from './pages/pdf-generator/pdf-generator.component';
import { PrintBarcodeComponent } from './pages/print-barcode/print-barcode.component';
import { SaleComponent } from './pages/sale/sale.component';
import { DatePipe } from '@angular/common';
import { PrintInvoiceComponent } from './pages/print-invoice/print-invoice.component';
import { InvoiceReturnComponent } from './pages/invoice-return/invoice-return.component';
import { ReportComponent } from './pages/report/report.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthInterceptor } from './service/auth.interceptor';
import {SplitButtonModule} from 'primeng/splitbutton';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

@NgModule({
    declarations: [
        LoginComponent,
        SaleComponent,
        PdfGeneratorComponent,
        UserComponent,
        CsvConverterComponent,
        ExcelConverterComponent,
        InvoiceComponent,
        InventoryComponent,
        ProductComponent,
        CustomerComponent,
        AppComponent,
        NotfoundComponent,
        SupplierComponent,
        VoucherComponent,
        PurchaseOrderComponent,
        PrintBarcodeComponent,
        PrintInvoiceComponent,
        InvoiceReturnComponent,
        ReportComponent,
        InvoiceReturnComponent,
        UserProfileComponent
    ],

    imports: [
        SplitButtonModule,
        BrowserModule,
        BadgeModule,
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
        AppLayoutModule,
        CardModule,
    AvatarModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        MessageService,
        ConfirmationService,
        DatePipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
