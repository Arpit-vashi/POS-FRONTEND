import { Component, OnInit, ViewChild } from '@angular/core';
import { SupplierService } from '../../service/supplier.service';
import { SupplierRequest } from '../../model/supplier/supplier-request.model';
import { SupplierResponse } from '../../model/supplier/supplier-response.model';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { PdfGeneratorComponent } from '../pdf-generator/pdf-generator.component';

@Component({
    selector: 'app-supplier',
    templateUrl: './supplier.component.html',
    styleUrls: ['./supplier.component.scss'],
})
export class SupplierComponent implements OnInit {
    @ViewChild(PdfGeneratorComponent) pdfGenerator: PdfGeneratorComponent;
    suppliers: SupplierResponse[] = [];
    clonedSuppliers: { [s: string]: SupplierResponse } = {};
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
            address: [''],
        });
    }

    loadSuppliers(): void {
        this.supplierService.getAllSuppliers().subscribe(
            (suppliers: SupplierResponse[]) => {
                this.suppliers = suppliers;
                this.cloneSuppliers();
            },
            (error) => {
                console.error('Error loading suppliers:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load suppliers',
                });
            }
        );
    }

    cloneSuppliers(): void {
        this.clonedSuppliers = {};
        this.suppliers.forEach((supplier) => {
            this.clonedSuppliers[supplier.supplierID] = { ...supplier };
        });
    }

    saveSupplier(): void {
        if (this.supplierForm.valid) {
            const newSupplier: SupplierRequest = this.supplierForm.value;
            this.supplierService.createSupplier(newSupplier).subscribe(
                (response: SupplierResponse) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Supplier added successfully',
                    });
                    this.loadSuppliers();
                    this.resetForm();
                },
                (error) => {
                    console.error('Error adding supplier:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to add supplier',
                    });
                }
            );
        }
    }

    resetForm(): void {
        this.supplierForm.reset();
    }

    onRowEditInit(supplier: SupplierResponse) {
        this.clonedSuppliers[supplier.supplierID.toString()] = { ...supplier };
    }

    onRowEditSave(supplier: SupplierResponse) {
        const supplierRequest: SupplierRequest = {
            supplierAgency: supplier.supplierAgency,
            contactPerson: supplier.contactPerson,
            supplierEmail: supplier.supplierEmail,
            supplierPhone: supplier.supplierPhone,
            contactPersonEmail: supplier.contactPersonEmail,
            contactPersonPhone: supplier.contactPersonPhone,
            address: supplier.address,
        };

        this.supplierService
            .updateSupplier(supplier.supplierID, supplierRequest)
            .subscribe(
                (updatedSupplier) => {
                    delete this.clonedSuppliers[supplier.supplierID.toString()];
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Supplier updated successfully',
                    });
                },
                (error) => {
                    console.error('Error updating supplier:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update supplier',
                    });
                }
            );
    }

    onRowEditCancel(supplier: SupplierResponse) {
        const index = this.suppliers.findIndex(
            (supp) => supp.supplierID === supplier.supplierID
        );
        if (index !== -1) {
            this.suppliers[index] =
                this.clonedSuppliers[supplier.supplierID.toString()];
            delete this.clonedSuppliers[supplier.supplierID.toString()];
        }
    }

    deleteSupplier(supplierID: number): void {
        this.supplierService.deleteSupplier(supplierID).subscribe(
            () => {
                this.suppliers = this.suppliers.filter(
                    (supplier) => supplier.supplierID !== supplierID
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Supplier deleted successfully',
                });
            },
            (error) => {
                console.error('Error deleting supplier:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete supplier',
                });
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
                if (
                    response &&
                    response.message ===
                        'CSV processed successfully. Data added successfully.'
                ) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'File uploaded successfully',
                    });
                    this.loadSuppliers();
                } else if (
                    (response && response.message === 'No change in data') ||
                    response.message === 'Duplicate data'
                ) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Info',
                        detail: response.message,
                    });
                } else {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'File uploaded successfully',
                    });
                    this.loadSuppliers();
                }
            },
            (error) => {
                console.error('Error uploading file:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to upload file',
                });
                this.loadSuppliers();
            }
        );
    }

    downloadPdf(): void {
        const pdfData = this.suppliers.map((supplier) => {
            return {
                'Supplier Id': supplier.supplierID,
                'Supplier Agency': supplier.supplierAgency,
                'Contact Person': supplier.contactPerson,
                'Supplier Email': supplier.supplierEmail,
                'Supplier Phone': supplier.supplierPhone,
                'Contact Person Email': supplier.contactPersonEmail,
                'Contact Person Phone': supplier.contactPersonPhone,
                Address: supplier.address,
            };
        });

        this.pdfGenerator.tableData = pdfData;
        this.pdfGenerator.fileName = 'Supplier_List';
        this.pdfGenerator.generatePDF();
    }
}
