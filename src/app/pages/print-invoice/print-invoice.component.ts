import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

@Component({
    selector: 'app-print-invoice',
    templateUrl: './print-invoice.component.html',
    styleUrls: ['./print-invoice.component.scss'],
})
export class PrintInvoiceComponent implements OnChanges {
    @Input() invoiceData: any;
    @Input() fileName: string = 'Invoice';

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['invoiceData']) {
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

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('POS-PGS', 105, 25, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Contact: 0000000000', 105, 32, { align: 'center' });
        doc.setFontSize(10);
        doc.text(
            `Customer Name: ${this.invoiceData.customerName || ''}`,
            20,
            45
        );
        doc.text(`Phone No: ${this.invoiceData.customerPhone || ''}`, 20, 50);
        doc.text(
            `Date: ${this.invoiceData.date || new Date().toLocaleDateString()}`,
            20,
            55
        );
        doc.text(
            `Payment Method: ${this.invoiceData.paymentMethod || 'N/A'}`,
            20,
            60
        );
        doc.text(`Voucher: ${this.invoiceData.voucher || 'N/A'}`, 20, 65);

        doc.setDrawColor(0);
        doc.setLineWidth(0);
        doc.line(10, 70, 190, 70);

        let startY = 75;

        const tableColumnHeaders = [
            'No.',
            'Item',
            'Qty',
            'MRP',
            'Tax',
            'Total',
        ];
        const tableRows = this.invoiceData.cartData.map((item) => [
            `${item.itemNo || ''}`,
            item.name || 'N/A',
            item.quantity || 0,
            `${item.price ? item.price.toFixed(2) : '0.00'}`,
            `${item.tax ? item.tax.toFixed(2) : '0.00'}`,
            `${item.total ? item.total.toFixed(2) : '0.00'}`,
        ]);

        autoTable(doc, {
            head: [tableColumnHeaders],
            body: tableRows,
            startY: startY,
            theme: 'plain',
            styles: { cellPadding: 1, fontSize: 10, halign: 'left' },
            headStyles: { halign: 'left' },
            columnStyles: {
                0: { halign: 'left' },
                1: { halign: 'left' },
                2: { halign: 'left' },
                3: { halign: 'left' },
                4: { halign: 'left' },
                5: { halign: 'left' },
            },
        });

        startY = (doc as any).lastAutoTable.finalY + 5;

        doc.setDrawColor(0);
        doc.setLineWidth(0);
        doc.line(10, startY - 3, 190, startY - 3);

        startY += 10;
        doc.setFontSize(10);
        doc.text('Total MRP:', 150, startY, { align: 'right' });
        doc.text(
            `${
                this.invoiceData.totalMRP
                    ? this.invoiceData.totalMRP.toFixed(2)
                    : '0.00'
            }`,
            180,
            startY,
            { align: 'right' }
        );
        startY += 5;

        doc.text('Tax:', 150, startY, { align: 'right' });
        doc.text(
            `${
                this.invoiceData.totalTax
                    ? this.invoiceData.totalTax.toFixed(2)
                    : '0.00'
            }`,
            180,
            startY,
            { align: 'right' }
        );
        startY += 5;

        doc.text('Total Discount:', 150, startY, { align: 'right' });
        doc.text(
            `${
                this.invoiceData.totalDiscount
                    ? this.invoiceData.totalDiscount.toFixed(2)
                    : '0.00'
            }`,
            180,
            startY,
            { align: 'right' }
        );
        startY += 5;

        doc.setFontSize(11);
        doc.text('Grand Total:', 150, startY, { align: 'right' });
        doc.text(
            `${
                this.invoiceData.totalPrice
                    ? this.invoiceData.totalPrice.toFixed(2)
                    : '0.00'
            }`,
            180,
            startY,
            { align: 'right' }
        );
        startY += 7;

        doc.setFontSize(10);
        doc.text('Thank you for Shopping with us !', 20, startY);
        startY += 5;

        doc.text('For help:- help@developer.me', 20, startY);
        startY += 5;
        doc.text('Visit Again :)', 20, startY);

        QRCode.toDataURL(JSON.stringify(this.invoiceData)).then(
            (qrCodeDataUrl) => {
                doc.addImage(qrCodeDataUrl, 'PNG', 80, 200, 50, 50);
                doc.save(`${this.fileName}.pdf`);
            }
        );
    }
}
