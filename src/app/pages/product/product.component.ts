import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../service/supplier.service';
import { SupplierResponse } from '../../model/supplier/supplier-response.model';
import { ProductRequest } from '../../model/product/product-request.model';
import { ProductResponse } from '../../model/product/product-response.model';
import { ProductService } from '../../service/product.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { PdfGeneratorComponent } from '../pdf-generator/pdf-generator.component';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
    @ViewChild(PdfGeneratorComponent) pdfGenerator: PdfGeneratorComponent;
    productForm: FormGroup;
    suppliers: SupplierResponse[] = [];
    products: ProductResponse[] = [];
    clonedProducts: { [s: string]: ProductResponse } = {};

    constructor(
        private fb: FormBuilder,
        private supplierService: SupplierService,
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadSuppliers();
        this.initProductForm();
        this.loadProducts();
    }

    initProductForm() {
        this.productForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: [null, Validators.required],
            tax: [null, Validators.required],
            total: [{ value: null, disabled: true }, Validators.required],
            stockQuantity: [null, Validators.required],
            purchasePrice: [null, Validators.required],
            supplierIds: [[], Validators.required],
        });
    }

    calculateTotal() {
        const price = this.productForm.get('price').value;
        const tax = this.productForm.get('tax').value;

        if (price !== null && tax !== null) {
            const total = price + (price * tax) / 100;
            this.productForm.get('total').setValue(total);
        }
    }

    loadSuppliers() {
        this.supplierService.getAllSuppliers().subscribe(
            (suppliers: SupplierResponse[]) => {
                this.suppliers = suppliers;
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

    onSubmit() {
        if (this.productForm.valid) {
            const formData = this.productForm.value;
            const selectedSupplierIds = formData.supplierIds.map(
                (supplier) => supplier.supplierID
            );
            formData.supplierIds = selectedSupplierIds;
            this.saveProduct(formData);
        } else {
            console.error('Error adding product:', Error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add product',
            });
        }
    }

    saveProduct(productData: ProductRequest) {
        this.productService.createProduct(productData).subscribe(
            (response: ProductResponse) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Product added successfully',
                });
                this.loadProducts();
                this.resetForm();
            },
            (error) => {
                console.error('Error adding product:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to add product',
                });
            }
        );
    }

    loadProducts() {
        this.productService.getAllProducts().subscribe(
            (products: ProductResponse[]) => {
                this.products = products;
                this.cloneProducts();
            },
            (error) => {
                console.error('Error loading products:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load products',
                });
            }
        );
    }

    onRowEditInit(product: ProductResponse) {
        this.clonedProducts[product.productId.toString()] = { ...product };
    }

    onRowEditSave(product: ProductResponse) {
        const productRequest: ProductRequest = {
            name: product.name,
            description: product.description,
            price: product.price,
            tax: product.tax,
            total: product.total,
            stockQuantity: product.stockQuantity,
            purchasePrice: product.purchasePrice,
            supplierIds: product.supplierIds,
        };

        this.productService
            .updateProduct(product.productId, productRequest)
            .subscribe(
                (updatedProduct) => {
                    delete this.clonedProducts[product.productId.toString()];
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Product updated successfully',
                    });
                },
                (error) => {
                    console.error('Error updating product:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update product',
                    });
                }
            );
    }

    onRowEditCancel(product: ProductResponse) {
        const index = this.products.findIndex(
            (prod) => prod.productId === product.productId
        );
        if (index !== -1) {
            this.products[index] =
                this.clonedProducts[product.productId.toString()];
            delete this.clonedProducts[product.productId.toString()];
        }
    }

    cloneProducts(): void {
        this.clonedProducts = {};
        this.products.forEach((product) => {
            this.clonedProducts[product.productId] = { ...product };
        });
    }

    resetForm(): void {
        this.productForm.reset();
    }

    deleteProduct(productId: number): void {
        this.productService.deleteProduct(productId).subscribe(
            () => {
                this.products = this.products.filter(
                    (product) => product.productId !== productId
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Product deleted successfully',
                });
            },
            (error) => {
                console.error('Error deleting product:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete product',
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
        this.productService.uploadFile(fileToUpload).subscribe(
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
                    this.loadProducts();
                } else if (
                    response &&
                    (response.message === 'No change in data' ||
                        response.message === 'Duplicate data')
                ) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Info',
                        detail: response.message,
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to upload file',
                    });
                }
            },
            (error) => {
                console.error('Error uploading file:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to upload file',
                });
                this.loadProducts();
            }
        );
    }

    getBarcodeImageSrc(product: ProductResponse): string {
        if (product.barcodeImage) {
            return 'data:image/jpeg;base64,' + product.barcodeImage;
        } else {
            return '';
        }
    }

    getSelectedSupplierIds(): void {
        const selectedSuppliers = this.productForm.get('supplierIds').value;
        const supplierIds = selectedSuppliers.map(
            (supplier) => supplier.supplierId
        );
    }

    downloadProductsPdf(): void {
        const pdfData = this.products.map((product) => {
            return {
                ID: product.productId,
                Name: product.name,
                Description: product.description,
                Price: product.price,
                Tax: product.tax,
                Total: product.total,
                'Purchase Price': product.purchasePrice,
                'Barcode Number': product.barcodeNumber,
                'Supplier IDs': product.supplierIds.join(', '),
            };
        });

        this.pdfGenerator.tableData = pdfData;
        this.pdfGenerator.fileName = 'Product_List';
        this.pdfGenerator.generatePDF();
    }
}
