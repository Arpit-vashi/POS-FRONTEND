import { Component, OnInit } from '@angular/core';
import { BarcodeService } from './../../service/barcode.service';
import { BarcodeResponse } from './../../model/barcode/barcode-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss']
})
export class BarcodeComponent implements OnInit {
  barcodeForm: FormGroup;
  barcodes: BarcodeResponse[];
  editingBarcode: BarcodeResponse | null = null;
  barcodeNumber: string;
  clonedBarcodes: { [id: number]: BarcodeResponse; } = {};

  constructor(
    private barcodeService: BarcodeService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadBarcodes();
    this.initBarcodeForm();
  }

  initBarcodeForm(): void {
    this.barcodeForm = this.formBuilder.group({
      barcodeNumber: ['', Validators.required]
    });
  }

  loadBarcodes(): void {
    this.barcodeService.getAllBarcodes().subscribe(
      (response) => {
        this.barcodes = response;
        console.log('Barcodes:', this.barcodes);
      },
      (error) => {
        console.error('Error loading barcodes:', error);
      }
    );
  }

  addBarcode(): void {
    if (this.barcodeForm.valid) {
      const newBarcode = { barcodeNumber: this.barcodeForm.value.barcodeNumber };

      this.barcodeService.createBarcode(newBarcode).subscribe(
        () => {
          console.log('New Barcode Added:', newBarcode);
          this.loadBarcodes();
          this.resetForm();
        },
        (error) => {
          console.error('Error adding barcode:', error);
        }
      );
    }
  }

  editBarcode(barcode: BarcodeResponse): void {
    console.log(barcode)
    this.editingBarcode = { ...barcode };
  }

  saveBarcode(barcode: BarcodeResponse): void {
    if (barcode) {
      this.barcodeService.updateBarcode(barcode.id, barcode).subscribe(
        () => {
          console.log('Barcode updated successfully:', barcode);
          this.editingBarcode = null;
          this.loadBarcodes();
        },
        (error) => {
          console.error('Error updating barcode:', error);
        }
      );
    }
  }
  
  cancelEdit(barcode: BarcodeResponse): void {
    this.onRowEditCancel(barcode);
  }

  onRowEditInit(barcode: BarcodeResponse) {
    this.clonedBarcodes[barcode.id] = { ...barcode };
  }

  onRowEditCancel(barcode: BarcodeResponse) {
    const index = this.barcodes.findIndex(b => b.id === barcode.id);
    if (index !== -1) {
        this.barcodes[index] = this.clonedBarcodes[barcode.id];
        delete this.clonedBarcodes[barcode.id];
        this.loadBarcodes();
    }
  }

  deleteBarcode(id: number): void {
    this.barcodeService.deleteBarcode(id).subscribe(
      () => {
        console.log('Barcode deleted successfully.');
        this.loadBarcodes();
      },
      (error) => {
        console.error('Error deleting barcode:', error);
      }
    );
  }

  onRowEditSave(barcode: BarcodeResponse): void {
    this.saveBarcode(barcode);
  }

  resetForm(): void {
    this.barcodeForm.reset();
  }

  onSubmit(): void {
    this.addBarcode();
  }
}
