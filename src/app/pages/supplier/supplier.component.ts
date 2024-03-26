import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../service/supplier.service';
import { SupplierRequest } from '../../model/supplier/supplier-request.model';
import { SupplierResponse } from '../../model/supplier/supplier-response.model';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {
  suppliers: SupplierResponse[] = [];
  clonedSuppliers: { [s: string]: SupplierResponse; } = {};
  supplierForm: FormGroup;
  uploader: any;

  constructor(
    private supplierService: SupplierService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initSupplierForm();
    this.loadSuppliers();
  }

  initSupplierForm(): void {
    this.supplierForm = this.formBuilder.group({
      supplierAgency: ['', Validators.required],
      contactPerson: ['', Validators.required],
      supplierEmail: ['', [Validators.required, Validators.email]],
      supplierPhone: ['', Validators.required],
      contactPersonEmail: ['', [Validators.required, Validators.email]],
      contactPersonPhone: ['', Validators.required],
      address: ['']
    });
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(
      (suppliers: SupplierResponse[]) => {
        this.suppliers = suppliers;
        this.cloneSuppliers();
        //this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Suppliers loaded successfully' });
      },
      (error) => {
        console.error('Error loading suppliers:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load suppliers' });
      }
    );
  }

  cloneSuppliers(): void {
    this.clonedSuppliers = {};
    this.suppliers.forEach(supplier => {
      this.clonedSuppliers[supplier.supplierID] = { ...supplier };
    });
  }

  saveSupplier(): void {
    if (this.supplierForm.valid) {
      const newSupplier: SupplierRequest = this.supplierForm.value;
      this.supplierService.createSupplier(newSupplier).subscribe(
        (response: SupplierResponse) => {
          console.log('Supplier added successfully:', response);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier added successfully' });
          this.loadSuppliers(); // Reload table after adding
          this.resetForm();
        },
        (error) => {
          console.error('Error adding supplier:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add supplier' });
        }
      );
    }
  }

  resetForm(): void {
    this.supplierForm.reset();
  }

  onRowEditInit(supplier: SupplierResponse): void {
    this.clonedSuppliers[supplier.supplierID] = { ...supplier };
  }

  onRowEditSave(supplier: SupplierResponse): void {
    // Implement if needed
  }

  onRowEditCancel(supplier: SupplierResponse): void {
    this.suppliers.forEach((value, index) => {
      if (value.supplierID === supplier.supplierID && this.clonedSuppliers[supplier.supplierID]) {
        this.suppliers[index] = { ...this.clonedSuppliers[supplier.supplierID] };
        delete this.clonedSuppliers[supplier.supplierID];
      }
    });
  }

  deleteSupplier(supplierID: number): void {
    this.supplierService.deleteSupplier(supplierID).subscribe(
      () => {
        // Remove the deleted supplier from the local array
        this.suppliers = this.suppliers.filter(supplier => supplier.supplierID !== supplierID);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier deleted successfully' });
      },
      (error) => {
        console.error('Error deleting supplier:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete supplier' });
      }
    );
  }

  onUpload(event: any): void {
    const files: FileList = event.files;
    if (files.length === 0) {
      return;
    }

    const fileToUpload: File = files.item(0);
    this.uploadFile(fileToUpload);
  }

  uploadFile(file: File): void {
    this.supplierService.uploadFile(file).subscribe(
      (response: any) => {
        console.log('Server Response:', response); // Log the response
        if (response && response.message === 'CSV processed successfully') {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully' });
          this.loadSuppliers();
        } else if (response && response.message === 'No change in data' || response.message === 'Duplicate data') {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: response.message });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully' });
          this.loadSuppliers();
        }
      },
      (error) => {
        console.error('Error uploading file:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file' });
        this.loadSuppliers();
      }
    );
  }
  
}
