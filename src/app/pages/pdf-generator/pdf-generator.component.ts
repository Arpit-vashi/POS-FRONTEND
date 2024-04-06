import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-pdf-generator',
    template: '',
})
export class PdfGeneratorComponent {
    @Input() tableData: any[];
    @Input() fileName: string;
    @Input() pageSize: string = 'a4';

    generatePDF(): void {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: this.pageSize,
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const header = this.fileName;

        let startY = 40;
        let currentPage = 1;
        let rowsLeft = this.tableData.length;

        while (rowsLeft > 0) {
            doc.addPage();

            doc.setPage(currentPage);
            doc.setFontSize(10);
            doc.text(`${currentPage}`, pageWidth - 40, pageHeight - 20);

            if (currentPage === 1) {
                doc.setFontSize(12);
                doc.text(header, pageWidth / 2, 20, { align: 'center' });
                startY += 20;
            }

            const numberOfRowsThatFit = Math.floor(
                (pageHeight - startY - 40) / 20
            );

            const startIndex = (currentPage - 1) * numberOfRowsThatFit;
            const endIndex = Math.min(
                startIndex + numberOfRowsThatFit,
                this.tableData.length
            );

            const dataChunk = this.tableData.slice(startIndex, endIndex);
            autoTable(doc, {
                head: [Object.keys(this.tableData[0])],
                body: dataChunk.map((item) => Object.values(item)),
                startY,
            });

            const dateTimeText = 'Printed On: ';
            const user = ', Printed By: {user} ';
            doc.setFontSize(10);
            doc.text(
                `${dateTimeText}${this.getCurrentDateTime()}${user}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );

            currentPage++;
            startY = 40;
            rowsLeft -= dataChunk.length;
        }

        doc.save(this.fileName + '.pdf');
    }

    getCurrentDateTime(): string {
        const now = new Date();
        return now.toLocaleString();
    }
}
