import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../service/supplier.service';
import { SupplierResponse } from '../../model/supplier/supplier-response.model';
import { ProductRequest } from "../../model/product/product-request.model";
import { ProductResponse } from "../../model/product/product-response.model";
import { ProductService } from "../../service/product.service";
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productForm: FormGroup;
  suppliers: SupplierResponse[] = [];
  products: ProductResponse[] = [];
  clonedProducts: { [s: string]: ProductResponse; } = {};

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
      description: [''],
      price: [null, Validators.required],
      tax: [null, Validators.required],
      total: [{value: null, disabled: true}, Validators.required],
      stock: [null],
      purchasePrice: [null],
      supplierIds: [[]] // Initialize as an array
    });
  }

  calculateTotal() {
    const price = this.productForm.get('price').value;
    const tax = this.productForm.get('tax').value;

    if (price !== null && tax !== null) {
      const total = price + (price * tax / 100);
      this.productForm.get('total').setValue(total);
    }
  }

  loadSuppliers() {
    this.supplierService.getAllSuppliers().subscribe((suppliers: SupplierResponse[]) => {
      this.suppliers = suppliers;
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      console.log(formData)
      this.saveProduct(formData);
    } else {
      // Handle invalid form
    }
  }

  saveProduct(productData: ProductRequest) {
    this.productService.createProduct(productData).subscribe(
      (response: ProductResponse) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added successfully' });
        this.loadProducts(); // Reload table after adding
        this.resetForm();
      },
      (error) => {
        console.error('Error adding product:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product' });
      }
    );
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(
      (products: ProductResponse[]) => {
        this.products = products;
        this.cloneProducts();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product Loaded successfully' });
      },
      (error) => {
        console.error('Error loading products:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products' });
      }
    );
  }

  cloneProducts(): void {
    this.clonedProducts = {};
    this.products.forEach(product => {
      this.clonedProducts[product.productId] = { ...product };
    });
  }

  resetForm(): void {
    this.productForm.reset();
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(
      () => {
        // Remove the deleted product from the local array
        this.products = this.products.filter(product => product.productId !== productId);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully' });
      },
      (error) => {
        console.error('Error deleting product:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product' });
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
        console.log('Server Response:', response); // Log the response
        if (response && response.message === 'CSV processed successfully') {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully' });
          this.loadProducts();
        } else if (response && (response.message === 'No change in data' || response.message === 'Duplicate data')) {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: response.message });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file' });
        }
      },
      (error) => {
        console.error('Error uploading file:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file' });
        this.loadProducts();
      }
    );
  }

  getBarcodeImageSrc(product: ProductResponse): string {
    if (product.barcodeImage) {
      return 'data:image/jpeg;base64,' + product.barcodeImage;
    } else {
      return ''; // Return a default image source if barcode image is not available
    }
  }
}
