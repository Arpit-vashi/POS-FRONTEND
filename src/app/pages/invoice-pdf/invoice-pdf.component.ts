import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InvoiceRequest } from 'src/app/model/invoice/invoice-request.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-invoice-pdf',
  templateUrl: './invoice-pdf.component.html',
  styleUrls: ['./invoice-pdf.component.scss']
})
export class InvoicePdfComponent implements OnInit {
  @Input() invoiceData: InvoiceRequest;
  @ViewChild('pdfContent', { static: false }) pdfContent: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  generatePdf() {
    html2canvas(this.pdfContent.nativeElement).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const ratio = pageWidth / imageWidth;
      const newHeight = imageHeight * ratio;

      pdf.addImage(contentDataURL, 'PNG', 0, 0, pageWidth, newHeight);
      pdf.save('invoice.pdf');
    });
  }
}
