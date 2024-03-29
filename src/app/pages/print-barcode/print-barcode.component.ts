import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ProductResponse } from '../../model/product/product-response.model';
import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-print-barcode',
  templateUrl: './print-barcode.component.html',
  styleUrls: ['./print-barcode.component.scss']
})
export class PrintBarcodeComponent implements OnInit {
  @ViewChild('dt') dt: Table;
  products: ProductResponse[] = [];
  selectedProducts3: ProductResponse[] = [];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  async getAllProducts(): Promise<void> {
    try {
      const products = await this.productService.getAllProducts().toPromise();
      this.products = products;
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  filterProducts(query: string): void {
    if (this.dt) {
      this.dt.filterGlobal(query, 'contains');
    }
  }

  async printSelectedProducts(): Promise<void> {
    if (this.selectedProducts3.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No products selected' });
      return;
    }

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'letter',
    });
    let yPos = 10;
    let currentPage = 1;
    const pageHeight = doc.internal.pageSize.height;

    for (const product of this.selectedProducts3) {
      const div = document.createElement('div');
      div.innerHTML = `
        <div>
          <img id="barcode-${product.productId}" src="${this.getBarcodeImage(product.barcodeImage)}" width="700" height="50" style="margin-top: 10px;">
        </div>
      `;
      document.body.appendChild(div);

      try {
        const dataUrl = await this.getBase64Image(div);
        const imgWidth = 190;
        const imgHeight = 60;
        const textX = 10;
        let textY = yPos + 70;
        const lineHeight = 10;
        const fontSize = 9;
        const maxLineWidth = imgWidth - textX;

        if (textY + lineHeight > pageHeight) {
          doc.addPage();
          currentPage++;
          yPos = 10;
          textY = yPos + 70;
        }

        doc.addImage(dataUrl, 'PNG', 10, yPos, imgWidth, imgHeight, undefined, 'FAST');

        const lines = doc.splitTextToSize(`${product.productId}, ${product.name}, Barcode Number: ${product.barcodeNumber}, Price: ${product.price}`, maxLineWidth);

        doc.setFontSize(fontSize);

        lines.forEach((line, index) => {
          const textYPosition = textY + (index * lineHeight);
          doc.text(line, textX, textYPosition);
        });

        yPos += imgHeight + 20;
      } catch (error) {
        console.error('Error printing product:', error);
      } finally {
        document.body.removeChild(div);
      }
    }

    doc.save(`selected_products_barcodes_page_${currentPage}.pdf`);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Barcode List Printed successfully' });
  }

  async getBase64Image(div: HTMLDivElement): Promise<string> {
    const canvas = await htmlToImage.toCanvas(div, { quality: 1, pixelRatio: 3 });
    return canvas.toDataURL('image/png');
  }

  getBarcodeImage(imageData: string): string {
    // Convert base64 data to image URL
    return `data:image/png;base64,${imageData}`;
  }

  resetSelection(): void {
    this.selectedProducts3 = [];
  }
}
