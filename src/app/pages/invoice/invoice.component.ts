import { Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from '../../service/invoice.service';
import { InvoiceResponse } from '../../model/invoice/invoice-response.model';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { PdfGeneratorComponent } from '../pdf-generator/pdf-generator.component';
import { PrintInvoiceComponent } from '../print-invoice/print-invoice.component';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss'],
    providers: [MessageService],
})
export class InvoiceComponent implements OnInit {
    @ViewChild(PdfGeneratorComponent) pdfGenerator: PdfGeneratorComponent;
    @ViewChild('printInvoice') printInvoiceComponent: PrintInvoiceComponent;
    selectedInvoice: any;
    invoices: InvoiceResponse[] = [];
    displayedInvoices: InvoiceResponse[] = [];
    loading: boolean = true;
    displayBasic: boolean = false;
    selectedInvoiceCartData: any[] = [];

    constructor(
        private invoiceService: InvoiceService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadInvoices();
    }

    showBasicDialog(invoice: any) {
        this.selectedInvoiceCartData = invoice.cartData;
        this.displayBasic = true;
    }

    loadInvoices() {
        this.invoiceService.getAllInvoices().subscribe(
            (invoices) => {
                this.invoices = invoices;
                this.displayedInvoices = this.invoices.filter(
                    (invoice) => invoice.status !== 'Return'
                );
                this.loading = false;
            },
            (error) => {
                console.error('Error fetching invoices:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load invoices. Please try again later.',
                });
                this.loading = false;
            }
        );
    }

    returnInvoice(invoice: InvoiceResponse) {
        invoice.status = 'Return';
        this.invoiceService.updateInvoice(invoice.invoiceID, invoice).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Invoice Return Successful',
                });
                this.loadInvoices();
            },
            (error) => {
                console.error('Error updating invoice status:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Invoice Return Failed',
                });
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
                this.loadInvoices();
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

    downloadInvoicesPdf(): void {
        const pdfData = this.displayedInvoices.map((invoice) => {
            return {
                ID: invoice.invoiceID,
                'Customer Name': invoice.customerName,
                Phone: invoice.customerPhone,
                Products: invoice.products,
                'Total MRP': invoice.totalMRP,
                'Total Tax': invoice.totalTax,
                'Total Discount': invoice.totalDiscount,
                'Total Price': invoice.totalPrice,
                'Date/Time': invoice.dateTime,
                Voucher: invoice.voucher,
                'Payment Method': invoice.paymentMethod,
                Status: invoice.status,
            };
        });

        this.pdfGenerator.tableData = pdfData;
        this.pdfGenerator.fileName = 'Invoice_List';
        this.pdfGenerator.generatePDF();
    }

    formatDate(date: any): string {
        const formattedDate = new Date(date);
        return formattedDate.toISOString().split('T')[0];
    }

    generatePDF(invoice: any) {
        this.selectedInvoice = invoice;
        this.printInvoiceComponent.createPdf();
    }
}
