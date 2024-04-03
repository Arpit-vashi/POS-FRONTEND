import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnChanges {

  @Input() invoiceData: any;
  @Input() fileName: string = 'Invoice';

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['invoiceData']) {
      console.log('Invoice data received:', this.invoiceData);
      if (this.invoiceData) {
        this.createPdf();
      }
    }
  }

  createPdf() {
    if (!this.invoiceData || !this.invoiceData.cartData) {
      console.error('Invoice data or cart data is missing.');
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add the store name and contact info at the top
    doc.setFontSize(18);
    doc.text('BitStore', 105, 25, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Contact: 123456', 105, 32, { align: 'center' });

    // Add Customer Information
    doc.setFontSize(10);
    doc.text(`Customer Name: ${this.invoiceData.customerName || ''}`, 20, 45);
    doc.text(`Phone No: ${this.invoiceData.customerPhone || ''}`, 20, 50);
    doc.text(`Date: ${this.invoiceData.date || new Date().toLocaleDateString()}`, 20, 55);
    doc.text(`Payment Method: ${this.invoiceData.paymentMethod || 'N/A'}`, 20, 60);
    doc.text(`Voucher: ${this.invoiceData.voucher || 'N/A'}`, 20, 65);

    // Add a horizontal line below the header
    doc.setDrawColor(0);
    doc.setLineWidth(0);
    doc.line(10, 70, 190, 70);

    // startY is where the item list will start
    let startY = 75;

    // Table headers and data for the items
    const tableColumnHeaders = ['No.', 'Item', 'Qty', 'MRP', 'Tax', 'Total'];
    const tableRows = this.invoiceData.cartData.map(item => [
      `${item.itemNo || ''}`,
      item.name || 'N/A',
      item.quantity || 0,
      `${item.price ? item.price.toFixed(2) : '0.00'}`,
      `${item.tax ? item.tax.toFixed(2) : '0.00'}`,
      `${item.total ? item.total.toFixed(2) : '0.00'}`,
    ]);

    // Add the table using autoTable
    autoTable(doc, {
      head: [tableColumnHeaders],
      body: tableRows,
      startY: startY,
      theme: 'plain',
      styles: { cellPadding: 1, fontSize: 10, halign: 'left' },
      headStyles: { halign: 'left' },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'left' }, 2: { halign: 'left' }, 3: { halign: 'left' }, 4: { halign: 'left' }, 5: { halign: 'left' } }
    });

    // Update startY to the position after the table
    startY = (doc as any).lastAutoTable.finalY + 5;

    // Add a horizontal line above the footer
    doc.setDrawColor(0);
    doc.setLineWidth(0);
    doc.line(10, startY - 3, 190, startY - 3);

    // Add Total MRP, Tax, and Grand Total
    doc.setFontSize(10);
    doc.text('Total MRP:', 150, startY, { align: 'right' });
    doc.text(`${this.invoiceData.totalMRP ? this.invoiceData.totalMRP.toFixed(2) : '0.00'}`, 180, startY, { align: 'right' });
    startY += 5;

    doc.text('Tax:', 150, startY, { align: 'right' });
    doc.text(`${this.invoiceData.totalTax ? this.invoiceData.totalTax.toFixed(2) : '0.00'}`, 180, startY, { align: 'right' });
    startY += 5;

    doc.text('Total Discount:', 150, startY, { align: 'right' });
    doc.text(`${this.invoiceData.totalDiscount ? this.invoiceData.totalDiscount.toFixed(2) : '0.00'}`, 180, startY, { align: 'right' });
    startY += 5;

    doc.setFontSize(11);
    doc.text('Grand Total:', 150, startY, { align: 'right' });
    doc.text(`${this.invoiceData.totalPrice ? this.invoiceData.totalPrice.toFixed(2) : '0.00'}`, 180, startY, { align: 'right' });
    startY += 7;

    // Add a footer note
    doc.setFontSize(10);
    doc.text('Thank you for your order! 10% GST application on total amount.', 20, startY);
    startY += 5;

    // Add contact information and thank you note
    doc.text('help@developer.me', 20, startY);
    startY += 5;
    doc.text('Thank You, Visit Again :)', 20, startY);

    // Generate QR code
    QRCode.toDataURL(JSON.stringify(this.invoiceData)).then(qrCodeDataUrl => {
      // Add the QR code image to the PDF
      doc.addImage(qrCodeDataUrl, 'PNG', 80, 200, 50, 50); // Adjust the position and size as needed

      // Save the PDF
      doc.save(`${this.fileName}.pdf`);
    });
  }

}
