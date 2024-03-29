import { Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from '../../service/invoice.service';
import { InvoiceResponse } from '../../model/invoice/invoice-response.model';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { PdfGeneratorComponent } from '../pdf-generator/pdf-generator.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  providers: [MessageService]
})
export class InvoiceComponent implements OnInit {
  @ViewChild(PdfGeneratorComponent) pdfGenerator: PdfGeneratorComponent;
  invoices: InvoiceResponse[];
  loading: boolean = true;
  constructor(private invoiceService: InvoiceService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.invoiceService.getAllInvoices().subscribe(
      invoices => {
        this.invoices = invoices;
        this.loading = false;
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

generatePDF(selectedInvoice: any) {
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  const header = [['Field', 'Value']];
  const body = [];

  for (const [key, value] of Object.entries(selectedInvoice)) {
    if (key === 'dateTime') {
      const formattedDate = this.formatDate(value);
      body.push(['Date/Time', formattedDate]);
    } else {
      body.push([key, value]);
    }
  }

  // Set the document title
  doc.text('Invoice Details', 14, 15);

  // Generate table for invoice details
  autoTable(doc, {
    head: header,
    body: body,
    startY: 20,
    theme: 'grid',
    columnStyles: {
      0: { fontStyle: 'bold' }
    }
  });

  // Save the PDF with a filename
  const invoiceId = selectedInvoice.invoiceID;
  doc.save(`Invoice-Detail-${invoiceId}.pdf`);
}
}
