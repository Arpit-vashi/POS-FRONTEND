import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PurchaseOrderService } from '../../service/purchase-order.service';
import { PurchaseOrderResponse } from '../../model/purchase-order/purchase-order-response.model';
import { SupplierService } from '../../service/supplier.service';
import { ProductService } from '../../service/product.service';
import { SupplierResponse } from '../../model/supplier/supplier-response.model';
import { jsPDF } from 'jspdf';
import { PdfGeneratorComponent } from '../pdf-generator/pdf-generator.component';

@Component({
    selector: 'app-purchase-order',
    templateUrl: './purchase-order.component.html',
    styleUrls: ['./purchase-order.component.scss'],
    providers: [MessageService],
})
export class PurchaseOrderComponent implements OnInit {
    @ViewChild(PdfGeneratorComponent) pdfGenerator: PdfGeneratorComponent;
    purchaseOrders: PurchaseOrderResponse[] = [];
    purchaseOrderForm: FormGroup;
    suppliers: SupplierResponse[] = [];
    products: any[] = [];
    transportMethods = [
        { name: 'Railway', value: 'Railway' },
        { name: 'By Road', value: 'By Road' },
        { name: 'By Air', value: 'By Air' },
        { name: 'By Water', value: 'By Water' },
    ];
    paymentMethods = [
        { name: 'Bank Transfer', value: 'Bank Transfer' },
        { name: 'Cheque', value: 'Cheque' },
        { name: 'UPI', value: 'UPI' },
        { name: 'Cash', value: 'Cash' },
        { name: 'Demand Draft', value: 'Demand Draft' },
    ];
    statusOptions = [
        { name: 'Paid', value: 'Paid' },
        { name: 'Unpaid', value: 'Unpaid' },
        { name: 'Semi-paid', value: 'Semi-paid' },
        { name: 'Return', value: 'Return' },
    ];
    selectedSupplierAgency: string = '';
    clonedPurchaseOrders: { [key: number]: PurchaseOrderResponse } = {};
    currentEditingRowIndex: number = -1;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private purchaseOrderService: PurchaseOrderService,
        private supplierService: SupplierService,
        private productService: ProductService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadSuppliers();
        this.getAllPurchaseOrders();
    }

    initForm(): void {
        this.purchaseOrderForm = this.fb.group({
            supplier: ['', Validators.required],
            products: ['', Validators.required],
            store: ['Store1', Validators.required],
            quantity: ['', [Validators.required, Validators.min(1)]],
            buyingPrice: ['', [Validators.required, Validators.min(1)]],
            sellingPrice: ['', [Validators.required, Validators.min(1)]],
            orderDate: ['', Validators.required],
            deliverDate: ['', Validators.required],
            transportMethod: ['', Validators.required],
            paymentMethod: ['', Validators.required],
            status: ['', Validators.required],
        });
    }

    loadSuppliers() {
        this.supplierService.getAllSuppliers().subscribe(
            (suppliers: SupplierResponse[]) => {
                this.suppliers = suppliers;
            },
            (error) => {
                console.error('Error loading suppliers:', error);
                this.showToast('error', 'Error', 'Failed to load suppliers.');
            }
        );
    }

    onRowEditInit(purchaseOrder: PurchaseOrderResponse, index: number) {
        this.currentEditingRowIndex = index;
        this.clonedPurchaseOrders[purchaseOrder.id] = { ...purchaseOrder };
    }

    getAllPurchaseOrders() {
        this.purchaseOrderService.getAllPurchaseOrders().subscribe(
            (purchaseOrders: PurchaseOrderResponse[]) => {
                this.purchaseOrders = purchaseOrders;
            },
            (error) => {
                console.error('Error loading purchase orders:', error);
                this.showToast(
                    'error',
                    'Error',
                    'Failed to load purchase orders.'
                );
            }
        );
    }

    loadProductsBySupplier(supplierId: string): void {
        const numericSupplierId: number = parseInt(supplierId, 10);

        if (!isNaN(numericSupplierId)) {
            this.productService
                .getProductsBySupplierId(numericSupplierId)
                .subscribe(
                    (products: any[]) => {
                        const productOptions = products.map((product) => ({
                            label: product.name,
                            value: product.name,
                        }));
                        this.products = productOptions;
                        this.purchaseOrderForm.patchValue({
                            products: productOptions,
                        });
                    },
                    (error) => {
                        console.error('Error loading products:', error);
                        this.showToast(
                            'error',
                            'Error',
                            'Failed to load products.'
                        );
                    }
                );
        } else {
            console.error('Invalid supplier ID:', supplierId);
            this.showToast('error', 'Error', 'Invalid supplier ID.');
        }
    }

    onSupplierChange(selectedSupplier: any) {
        if (selectedSupplier && selectedSupplier.supplierID) {
            const selectedSupplierId = selectedSupplier.supplierID;
            this.loadProductsBySupplier(selectedSupplierId);
            this.selectedSupplierAgency = selectedSupplier.supplierAgency;
        } else {
        }
    }

    prepareFormData(): any {
        const formData = { ...this.purchaseOrderForm.value };
        formData.orderDate = this.formatDate(formData.orderDate);
        formData.deliverDate = this.formatDate(formData.deliverDate);
        formData.supplier = this.selectedSupplierAgency;
        formData.paymentMethod = formData.paymentMethod.value;
        formData.products = formData.products.value;
        formData.status = formData.status.value;
        formData.store = formData.store.value;
        formData.transportMethod = formData.transportMethod.value;

        return formData;
    }

    deletePurchaseOrder(orderId: number) {
        if (confirm('Are you sure you want to delete this purchase order?')) {
            this.purchaseOrderService.deletePurchaseOrder(orderId).subscribe(
                () => {
                    this.purchaseOrders = this.purchaseOrders.filter(
                        (po) => po.id !== orderId
                    );
                    this.showToast(
                        'success',
                        'Success',
                        'Purchase order deleted successfully.'
                    );
                    this.getAllPurchaseOrders();
                },
                (error) => {
                    console.error('Error deleting purchase order:', error);
                    this.showToast(
                        'error',
                        'Error',
                        'Failed to delete purchase order.'
                    );
                    this.getAllPurchaseOrders();
                }
            );
        }
    }

    formatDate(date: any): string {
        const formattedDate = new Date(date);
        return formattedDate.toISOString().split('T')[0];
    }

    onSubmit(): void {
        if (this.purchaseOrderForm.valid) {
            const formData = this.prepareFormData();
            this.purchaseOrderService.createPurchaseOrder(formData).subscribe(
                (response) => {
                    this.getAllPurchaseOrders();
                    this.purchaseOrderForm.reset();
                    this.showToast(
                        'success',
                        'Success',
                        'Purchase order created successfully.'
                    );
                },
                (error) => {
                    console.error('Error creating purchase order:', error);
                    this.showToast(
                        'error',
                        'Error',
                        'Failed to create purchase order.'
                    );
                }
            );
        } else {
            this.purchaseOrderForm.markAllAsTouched();
            this.showToast(
                'error',
                'Error',
                'Please fill in all required fields.'
            );
        }
    }

    showToast(severity: string, summary: string, detail: string): void {
        this.messageService.add({ severity, summary, detail });
    }

    onRowEditSave(purchaseOrder: PurchaseOrderResponse) {
        const orderId = purchaseOrder.id;

        this.purchaseOrderService
            .updatePurchaseOrder(orderId, purchaseOrder)
            .subscribe(
                () => {
                    this.showToast(
                        'success',
                        'Success',
                        'Purchase order updated successfully.'
                    );
                },
                (error) => {
                    console.error('Error updating purchase order:', error);
                    this.showToast(
                        'error',
                        'Error',
                        'Failed to update purchase order.'
                    );
                }
            );
    }

    onRowEditCancel(purchaseOrder: PurchaseOrderResponse, index: number) {
        this.purchaseOrders[index] =
            this.clonedPurchaseOrders[purchaseOrder.id];
        delete this.clonedPurchaseOrders[purchaseOrder.id];
    }

    downloadPurchaseOrdersPdf(): void {
        const pdfData = this.purchaseOrders.map((order) => {
            return {
                'Order ID': order.id,
                Supplier: order.supplier,
                Products: order.products,
                Store: order.store,
                Quantity: order.quantity,
                'Buying Price': order.buyingPrice,
                'Selling Price': order.sellingPrice,
                'Order Date': this.formatDate(order.orderDate),
                'Delivery Date': this.formatDate(order.deliverDate),
                'Transport Method': order.transportMethod,
                'Payment Method': order.paymentMethod,
                Status: order.status,
            };
        });

        this.pdfGenerator.tableData = pdfData;
        this.pdfGenerator.fileName = 'Purchase_Order_List';
        this.pdfGenerator.generatePDF();
    }

    generatePDF(purchaseOrder: any) {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.setFont('bold');
        let yPos = 20;
        for (const [key, value] of Object.entries(purchaseOrder)) {
            if (key === 'orderDate' || key === 'deliverDate') {
                const formattedDate = this.formatDate(value);
                doc.text(`${key}: ${formattedDate}`, 10, yPos);
            } else {
                doc.text(`${key}: ${value}`, 10, yPos);
            }
            yPos += 10;
        }
        doc.save('purchase_order_details.pdf');
    }
}
