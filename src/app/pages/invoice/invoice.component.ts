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
  providers: [MessageService]
})
export class InvoiceComponent implements OnInit {
  @ViewChild(PdfGeneratorComponent) pdfGenerator: PdfGeneratorComponent;
  @ViewChild('printInvoice') printInvoiceComponent: PrintInvoiceComponent;
  selectedInvoice: any;
  invoices: InvoiceResponse[];
  loading: boolean = true;
  constructor(private invoiceService: InvoiceService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadInvoices();
  }
  displayBasic: boolean = false;
  selectedInvoiceCartData: any[] = [];

  showBasicDialog(invoice: any) {
    
    this.selectedInvoiceCartData = invoice.cartData; // Assuming cartData is a property of the invoice object
    this.displayBasic = true;
}


  loadInvoices() {
    this.invoiceService.getAllInvoices().subscribe(
      invoices => {
        this.invoices = invoices;
        this.loading = false;
        console.log(invoices)
      },
      error => {
        console.error('Error fetching invoices:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load invoices. Please try again later.' });
        this.loading = false;
      }
    );
  }

  deleteInvoice(invoiceId: number) {
    this.invoiceService.deleteInvoice(invoiceId).subscribe(
        () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Invoice deleted successfully' });
            // Remove the deleted invoice from the invoices array
            this.invoices = this.invoices.filter(invoice => invoice.invoiceID !== invoiceId);
        },
        (error: HttpErrorResponse) => {
            console.error('Error deleting invoice:', error);
            let errorMessage = 'An error occurred while deleting the invoice. Please try again.';
            if (error.error && error.error.message) {
                errorMessage = error.error.message;
            }
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        }
    );
}

downloadInvoicesPdf(): void {
  const pdfData = this.invoices.map(invoice => {
    return {
      'ID': invoice.invoiceID,
      'Customer Name': invoice.customerName,
      'Phone': invoice.customerPhone,
      'Products': invoice.products,
      'Total MRP': invoice.totalMRP,
      'Total Tax': invoice.totalTax,
      'Total Discount': invoice.totalDiscount,
      'Total Price': invoice.totalPrice,
      'Date/Time': invoice.dateTime,
      'Voucher': invoice.voucher,
      'Payment Method': invoice.paymentMethod,
      'Status': invoice.status
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
