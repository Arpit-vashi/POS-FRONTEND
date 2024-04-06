import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../service/invoice.service';
import { InvoiceResponse } from '../../model/invoice/invoice-response.model';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-invoice-return',
    templateUrl: './invoice-return.component.html',
    styleUrls: ['./invoice-return.component.scss'],
    providers: [MessageService],
})
export class InvoiceReturnComponent implements OnInit {
    returnedInvoices: InvoiceResponse[] = [];
    loading: boolean = true;
    selectedInvoiceCartData: any[] = [];
    displayCartDialog: boolean = false;

    constructor(
        private invoiceService: InvoiceService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadReturnedInvoices();
    }

    loadReturnedInvoices() {
        this.invoiceService.getAllInvoices().subscribe(
            (invoices) => {
                this.returnedInvoices = invoices.filter(
                    (invoice) => invoice.status === 'Return'
                );
                this.loading = false;
            },
            (error) => {
                console.error('Error fetching invoices:', error);
                this.loading = false;
            }
        );
    }

    deleteInvoice(invoiceId: number) {
        this.invoiceService.deleteInvoice(invoiceId).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Invoice deleted successfully',
                });
                this.loadReturnedInvoices();
            },
            (error: HttpErrorResponse) => {
                console.error('Error deleting invoice:', error);
                let errorMessage =
                    'An error occurred while deleting the invoice. Please try again.';
                if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                }
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                });
            }
        );
    }

    showCartDetails(invoice: InvoiceResponse) {
        this.selectedInvoiceCartData = invoice.cartData;
        this.displayCartDialog = true;
    }
}
