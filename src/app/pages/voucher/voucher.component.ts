import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VoucherService } from '../../service/voucher.service';
import { MessageService } from 'primeng/api';
import { VoucherRequest } from '../../model/voucher/voucher-request.model';
import { VoucherResponse } from '../../model/voucher/voucher-response.model';
import { PdfGeneratorComponent } from '../pdf-generator/pdf-generator.component';

@Component({
    selector: 'app-voucher',
    templateUrl: './voucher.component.html',
    styleUrls: ['./voucher.component.scss'],
    providers: [MessageService],
})
export class VoucherComponent implements OnInit {
    @ViewChild(PdfGeneratorComponent) pdfGenerator: PdfGeneratorComponent;
    vouchers: VoucherResponse[];
    voucherForm: FormGroup;
    clonedVouchers: { [s: string]: VoucherResponse } = {};

    constructor(
        private fb: FormBuilder,
        private voucherService: VoucherService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.createForm();
        this.loadVouchers();
    }

    createForm() {
        this.voucherForm = this.fb.group({
            voucherCode: ['', Validators.required],
            discountAmount: [null, Validators.required],
            validForNumberOfCustomers: [null, Validators.required],
            validForNumberOfDays: [null, Validators.required],
        });
    }

    onSubmit() {
        if (this.voucherForm.valid) {
            const voucherRequest: VoucherRequest = {
                voucherCode: this.voucherForm.value.voucherCode,
                discountAmount: this.voucherForm.value.discountAmount,
                validForNumberOfCustomers:
                    this.voucherForm.value.validForNumberOfCustomers,
                validForNumberOfDays:
                    this.voucherForm.value.validForNumberOfDays,
            };

            this.voucherService.createVoucher(voucherRequest).subscribe(
                () => {
                    this.loadVouchers();
                    this.resetForm();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Voucher added successfully',
                    });
                },
                (error) => {
                    console.error('Error adding voucher:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to add voucher',
                    });
                }
            );
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields',
            });
        }
    }

    resetForm() {
        this.voucherForm.reset();
    }

    loadVouchers() {
        this.voucherService.getAllVouchers().subscribe(
            (data: VoucherResponse[]) => {
                this.vouchers = data;
                this.clonedVouchers = {};
            },
            (error) => {
                console.error('Error loading vouchers:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load vouchers',
                });
            }
        );
    }

    onRowEditInit(voucher: VoucherResponse) {
        this.clonedVouchers[voucher.voucherID] = { ...voucher };
    }

    onRowEditSave(voucher: VoucherResponse) {
        const voucherRequest: VoucherRequest = {
            voucherCode: voucher.voucherCode,
            discountAmount: voucher.discountAmount,
            validForNumberOfCustomers: voucher.validForNumberOfCustomers,
            validForNumberOfDays: voucher.validForNumberOfDays,
        };

        this.voucherService
            .updateVoucher(voucher.voucherID, voucherRequest)
            .subscribe(
                () => {
                    delete this.clonedVouchers[voucher.voucherID];
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Voucher updated successfully',
                    });
                },
                (error) => {
                    console.error('Error updating voucher:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update voucher',
                    });
                }
            );
    }

    onRowEditCancel(voucher: VoucherResponse, index: number) {
        this.vouchers[index] = this.clonedVouchers[voucher.voucherID];
        delete this.clonedVouchers[voucher.voucherID];
    }

    onDeleteVoucher(voucherID: number) {
        this.voucherService.deleteVoucher(voucherID).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Voucher deleted successfully',
                });
                this.loadVouchers();
            },
            (error) => {
                console.error('Error deleting voucher:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete voucher',
                });
            }
        );
    }

    downloadPdf(): void {
        const pdfData = this.vouchers.map((voucher) => {
            return {
                Id: voucher.voucherID,
                Code: voucher.voucherCode,
                'Discount (%)': voucher.discountAmount,
                'Valid for Number of Customers':
                    voucher.validForNumberOfCustomers,
                'Valid for Number of Days': voucher.validForNumberOfDays,
            };
        });

        this.pdfGenerator.tableData = pdfData;
        this.pdfGenerator.fileName = 'Voucher_List';
        this.pdfGenerator.generatePDF();
    }
}
