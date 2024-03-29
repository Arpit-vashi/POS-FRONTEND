import { Component, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-excel-converter',
  templateUrl: './excel-converter.component.html',
  styleUrls: ['./excel-converter.component.scss']
})
export class ExcelConverterComponent {
  excelData: any[] = [];
  csvData: string;
  tableHeaders: string[];
  inputFile: any;
  uploadedFileName: string = '';
  csvContentVisible: boolean = false; // Flag to track whether to display CSV content or not
  isFileSelected: boolean = false; // Flag to track whether a file is selected

  @ViewChild('fileUpload') fileUpload: FileUpload;

  constructor() { }

  onFileChange(event: any) {
    const fileList: FileList = event.files;
    if (fileList.length !== 1) {
      console.error('Please select one file');
      return;
    }

    this.isFileSelected = true; // Set flag to true when a file is selected

    this.inputFile = fileList[0];
    this.uploadedFileName = this.inputFile.name;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const firstSheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];
      this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      if (!this.excelData || this.excelData.length === 0) {
        console.error('No data found in the Excel sheet');
        return;
      }
      this.tableHeaders = Object.keys(this.excelData[0]);
    };
    reader.readAsBinaryString(this.inputFile);
  }

  convertToCSV() {
    if (!this.excelData || this.excelData.length === 0) {
      console.error('No data to convert');
      return;
    }

    const formatCellValue = (cell: any): string => {
      if (cell == null) return '';
      if (typeof cell === 'object' && cell.hasOwnProperty('w')) {
        return cell.w;
      }
      if (typeof cell === 'object' && cell.hasOwnProperty('v')) {
        return cell.v.toString();
      }
      return cell.toString();
    };

    const header = Object.keys(this.excelData[0]);
    const csvRows = this.excelData.map(row =>
      header.map(fieldName => formatCellValue(row[fieldName])).join(',')
    );

    this.csvData = [header.join(','), ...csvRows].join('\r\n');

    // Set flag to true to display CSV content
    this.csvContentVisible = true;
  }

  downloadCSV() {
    if (!this.csvData) {
      console.error('No CSV data available to download');
      return;
    }
    const blob = new Blob([this.csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fileNameParts = this.uploadedFileName.split('.');
    const fileName = fileNameParts[0] + '_e2c.' + fileNameParts[1];
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  reset() {
    this.excelData = [];
    this.csvData = '';
    this.tableHeaders = [];
    this.inputFile = null;
    this.uploadedFileName = '';
    this.fileUpload.clear();

    // Reset the flags
    this.csvContentVisible = false;
    this.isFileSelected = false;
  }
}
