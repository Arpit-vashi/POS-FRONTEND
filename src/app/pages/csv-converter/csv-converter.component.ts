import { Component, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-csv-converter',
  templateUrl: './csv-converter.component.html',
  styleUrls: ['./csv-converter.component.scss']
})
export class CsvConverterComponent {
  csvData: string;
  excelData: any[] = [];
  tableHeaders: string[];
  inputFile: any;
  uploadedFileName: string = '';
  excelContentVisible: boolean = false; // Flag to track whether to display Excel content or not

  @ViewChild('fileUpload') fileUpload: FileUpload;

  constructor() { }

  onFileChange(event: any) {
    const fileList: FileList = event.files;
    if (fileList.length !== 1) {
      console.error('Please select one file');
      return;
    }

    this.inputFile = fileList[0];
    this.uploadedFileName = this.inputFile.name;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      this.csvData = e.target.result;
      this.parseCSVData();
    };

    reader.readAsText(this.inputFile);
  }

  parseCSVData() {
    const lines: string[] = this.csvData.split('\n');
    this.tableHeaders = lines[0].split(',');

    this.excelData = [];
    for (let i = 1; i < lines.length; i++) {
      const data = lines[i].split(',');
      if (data.length === this.tableHeaders.length) {
        const obj = {};
        for (let j = 0; j < this.tableHeaders.length; j++) {
          obj[this.tableHeaders[j].trim()] = data[j].trim();
        }
        this.excelData.push(obj);
      }
    }
  }

  convertToExcel() {
    if (!this.csvData) {
      console.error('No data to convert');
      return null;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excelData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Set flag to true to display Excel content
    this.excelContentVisible = true;

    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  downloadExcel() {
    const data = this.convertToExcel();
    if (!data) {
      console.error('No Excel data to download');
      return;
    }
    const fileName: string = this.uploadedFileName.split('.')[0] + '_c2e.xlsx';
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  reset() {
    this.csvData = '';
    this.excelData = [];
    this.tableHeaders = [];
    this.inputFile = null;
    this.uploadedFileName = '';
    this.fileUpload.clear();

    // Reset the flag to hide Excel content
    this.excelContentVisible = false;
  }
}
