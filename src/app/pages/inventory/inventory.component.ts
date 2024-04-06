import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ProductResponse } from '../../model/product/product-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { PdfGeneratorComponent } from '../pdf-generator/pdf-generator.component';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
    @ViewChild(PdfGeneratorComponent) pdfGenerator: PdfGeneratorComponent;
    products: ProductResponse[] = [];
    clonedProducts: { [s: string]: ProductResponse } = {};
    productForm: FormGroup;
    filteredProducts: ProductResponse[] = [];

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.initProductForm();
        this.loadProducts();
    }

    initProductForm(): void {
        this.productForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            price: [0, Validators.required],
            tax: [0],
            total: [0],
            stockQuantity: [0, Validators.required],
            purchasePrice: [0, Validators.required],
            supplierIds: [[]],
        });
    }

    loadProducts(): void {
        this.productService.getAllProducts().subscribe(
            (products: ProductResponse[]) => {
                this.products = products;
                this.cloneProducts();
                this.filteredProducts = [...this.products];
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Products loaded successfully',
                });
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load products',
                });
            }
        );
    }

    cloneProducts(): void {
        this.clonedProducts = {};
        this.products.forEach((product) => {
            this.clonedProducts[product.productId] = { ...product };
        });
    }

    saveProduct(): void {
        if (this.productForm.valid) {
            const newProduct: ProductResponse = this.productForm.value;
            this.productService.createProduct(newProduct).subscribe(
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
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to add product',
                    });
                }
            );
        }
    }

    resetForm(): void {
        this.productForm.reset();
    }

    onRowEditInit(product: ProductResponse): void {
        this.clonedProducts[product.productId] = { ...product };
    }

    onRowEditSave(product: ProductResponse): void {
        const updatedProduct: ProductResponse = {
            ...this.clonedProducts[product.productId],
            stockQuantity: product.stockQuantity,
        };
        this.productService
            .updateProduct(product.productId, updatedProduct)
            .subscribe(
                (updatedProduct: ProductResponse) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Product updated successfully',
                    });
                },
                (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update product',
                    });
                }
            );
    }

    onRowEditCancel(product: ProductResponse): void {
        this.products.forEach((value, index) => {
            if (
                value.productId === product.productId &&
                this.clonedProducts[product.productId]
            ) {
                this.products[index] = {
                    ...this.clonedProducts[product.productId],
                };
                delete this.clonedProducts[product.productId];
            }
        });
    }

    applyGlobalFilter(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement) {
            const searchText = inputElement.value.toLowerCase();
            this.filteredProducts = this.products.filter((product) => {
                const idMatch = product.productId
                    .toString()
                    .toLowerCase()
                    .includes(searchText);
                const nameMatch = product.name
                    .toLowerCase()
                    .includes(searchText);
                const searchNumber = Number(searchText);
                const idIsNumber =
                    !isNaN(searchNumber) && Number.isInteger(searchNumber);
                const idNumberMatch =
                    idIsNumber && product.productId === searchNumber;
                return idMatch || nameMatch || idNumberMatch;
            });
        }
    }

    downloadInventoryPdf(): void {
        const pdfData = this.filteredProducts.map((product) => {
            return {
                ID: product.productId,
                Name: product.name,
                Stock: product.stockQuantity,
                Supplier: product.supplierIds.join(', '),
            };
        });

        this.pdfGenerator.tableData = pdfData;
        this.pdfGenerator.fileName = 'Inventory_List';
        this.pdfGenerator.generatePDF();
    }
}
