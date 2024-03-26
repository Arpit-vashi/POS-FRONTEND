import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SupplierService } from '../../service/supplier.service';
import { ProductService } from '../../service/product.service';
import { SupplierResponse } from "../../model/supplier/supplier-response.model";

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  purchaseOrderForm: FormGroup;
  purchaseOrders: any[] = [];
  suppliers: any[] = [];
  products: any[] = [];
  transportMethods = [
    { name: 'Railway', value: 'Railway' },
    { name: 'By Road', value: 'By Road' },
    { name: 'By Air', value: 'By Air' },
    { name: 'By Water', value: 'By Water' }
  ];
  paymentMethods = [
    { name: 'Bank Transfer', value: 'Bank Transfer' },
    { name: 'Cheque', value: 'Cheque' },
    { name: 'UPI', value: 'UPI' },
    { name: 'Cash', value: 'Cash' },
    { name: 'Demand Draft', value: 'Demand Draft' }
  ];
  statusOptions = [
    { name: 'Paid', value: 'Paid' },
    { name: 'Unpaid', value: 'Unpaid' },
    { name: 'Semi-paid', value: 'Semi-paid' },
    { name: 'Return', value: 'Return' }
  ];

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliers();
  }

  initForm(): void {
    this.purchaseOrderForm = this.fb.group({
      supplier: ['', Validators.required],
      products: ['', Validators.required],
      store: ['Store1', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      buyingPrice: ['', [Validators.required, Validators.min(0)]],
      sellingPrice: ['', [Validators.required, Validators.min(0)]],
      orderDate: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      transportMethod: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  loadSuppliers() {
    this.supplierService.getAllSuppliers().subscribe((suppliers: SupplierResponse[]) => {
      this.suppliers = suppliers;
    });
  }

  loadProductsBySupplier(supplierId: string): void {
    this.productService.getAllProducts().subscribe(
      (products: any[]) => {
        this.products = products;
      },
      (error) => {
        console.error('Error loading products:', error);
        // Handle error
      }
    );
  }

  onSubmit(): void {
    if (this.purchaseOrderForm.valid) {
      console.log('Form submitted:', this.purchaseOrderForm.value);
      // Add logic to save the purchase order
    } else {
      this.purchaseOrderForm.markAllAsTouched();
    }
  }
}
