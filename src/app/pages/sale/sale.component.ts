import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../service/invoice.service';
import { InvoiceRequest } from "../../model/invoice/invoice-request.model";
import { CustomerService } from '../../service/customer.service';
import { ProductService } from '../../service/product.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { VoucherService } from '../../service/voucher.service';
import { VoucherResponse } from '../../model/voucher/voucher-response.model';
import { ProductResponse } from '../../model/product/product-response.model';
import { CustomerResponse } from '../../model/customer/customer-response.model';
import { InvoiceResponse } from '../../model/invoice/invoice-response.model';
import { VoucherRequest } from 'src/app/model/voucher/voucher-request.model';
import { InvoicePdfComponent } from '../invoice-pdf/invoice-pdf.component';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit, OnDestroy {
  @ViewChild(InvoicePdfComponent) invoicePdfComponent: InvoicePdfComponent;

  ngAfterViewInit() {
    if (this.invoicePdfComponent) {
      console.log('Invoice PDF Component is available.');
      // You can set default data or perform other initializations here if needed
    } else {
      console.error('Invoice PDF Component is not available.');
    }
  }
  saleForm: FormGroup;
  paymentOptions = [
    { label: 'Cash', value: 'Cash' },
    { label: 'Card', value: 'Card' },
    { label: 'UPI', value: 'UPI' }
  ];
  statusOptions = [
    { label: 'Paid', value: 'Paid' },
    { label: 'SemiPaid', value: 'SemiPaid' },
    { label: 'Unpaid', value: 'Unpaid' }
  ];
  selectedStatus:  {lable,value};
  productId: number;
  barcodeNumber: string;
  invoices: InvoiceResponse[];
  largestInvoiceId: number;
  currentDate: string;
  currentTime: string;
  timeInterval: any;
  customers: CustomerResponse[];
  selectedCustomer: CustomerResponse;
  products: ProductResponse[];
  selectedProducts: ProductResponse[] = [];
  productsInCart: ProductResponse[] = [];
  totalPrice: number = 0;
  totalTax: number = 0;
  overallTotal: number = 0;
  totalDiscount: number = 0;
  vouchers: VoucherResponse[] = [];
  voucherValue: string;
  originalTotalPrice: number;
  originalTotalTax: number;
  originalOverallTotal: number;
  voucherInputEmpty: boolean = true;
  voucherApplied: boolean = false;
  selectedPaymentMethod: {lable,value};
  v:VoucherRequest
  vId:number

  constructor(
    private formBuilder: FormBuilder,
    private invoiceService: InvoiceService,
    private datePipe: DatePipe,
    private customerService: CustomerService,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService,
    private voucherService: VoucherService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.restoreFromLocalStorage();
    this.getInvoiceData();
    this.updateDateTime();
    this.getAllCustomers();
    this.getAllProducts();
    this.getAllVouchers();
    this.recalculateCartTotals();
    this.originalTotalPrice = this.totalPrice;
    this.originalTotalTax = this.totalTax;
    this.originalOverallTotal = this.overallTotal;
  }

  ngOnDestroy() {
    this.saveToLocalStorage();
    clearInterval(this.timeInterval);
  }

  initializeForm() {
    this.saleForm = this.formBuilder.group({
      customerName: [this.selectedCustomer ? this.selectedCustomer.name : '', Validators.required],
      customerPhone: [this.selectedCustomer ? this.selectedCustomer.phone : '', Validators.required],
      paymentMethod: [this.selectedPaymentMethod, Validators.required],
      status: [this.selectedStatus, Validators.required],
      // dateTime: [this.datePipe.transform(new Date(), 'yyyy/MM/dd HH:mm:ss'), Validators.required],
      dateTime: [this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'), Validators.required],
      products: [this.productsInCart.map(product => product.name)],
      barcodeNumbers: [this.productsInCart.map(product => product.barcodeNumber)],
      voucher: [''],
      totalMRP: [this.totalPrice],
      totalTax: [this.totalTax],
      totalDiscount: [0],
      totalPrice: [this.overallTotal]
    });
  }

  redirectToCustomerPage() {
    this.router.navigateByUrl('/customer');
  }

  getInvoiceData() {
    this.invoiceService.getAllInvoices().subscribe(
      invoices => {
        this.invoices = invoices;
        this.findLargestInvoiceId();
      },
      error => {
        console.error('Error fetching invoices:', error);
      }
    );
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      products => {
        this.products = products;
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  updateDateTime() {
    this.timeInterval = setInterval(() => {
      const now = new Date();
      this.currentDate = this.datePipe.transform(now, 'yyyy/MM/dd');
      this.currentTime = this.datePipe.transform(now, 'HH:mm:ss');
    }, 1000);
  }

  findLargestInvoiceId() {
    let largestId = 0;
    this.invoices.forEach(invoice => {
      const trimmedId = parseInt(invoice.invoiceID.toString().trim(), 10);
      if (!isNaN(trimmedId) && trimmedId > largestId) {
        largestId = trimmedId;
      }
    });
    this.largestInvoiceId = largestId;
  }

  getAllCustomers() {
    this.customerService.getAllCustomers().subscribe(
      customers => {
        this.customers = customers;
        if (this.customers && this.customers.length > 0) {
          this.selectedCustomer = this.customers[0];
          this.initializeForm();
        }
      },
      error => {
        console.error('Error fetching customers:', error);
      }
    );
  }


  onCustomerChange() {}

  searchByBarcode() {
    if (this.barcodeNumber) {
      this.productService.getProductsByBarcodeNumber(this.barcodeNumber).subscribe(
        products => {
          if (products && products.length > 0) {
            this.addToCart(products[0]);
            this.barcodeNumber = null;
            this.recalculateCartTotals();
          } else {
            this.showProductNotFoundToast();
          }
        },
        error => {
          console.error('Error fetching product:', error);
          this.showProductNotFoundToast();
        }
      );
    }
  }

  showProductNotFoundToast() {
    this.messageService.add({ severity: 'error', summary: 'Product Not Found', detail: 'The product with the given barcode number was not found.' });
  }

  searchByProductId() {
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe(
        product => {
          if (product) {
            this.addToCart(product);
            this.recalculateCartTotals();
          } else {
            this.showProductNotFoundToast();
          }
        },
        error => {
          console.error('Error fetching product:', error);
          this.showProductNotFoundToast();
        }
      );
    } else {
      this.showProductNotFoundToast();
    }
  }

  addToCartWithReset() {
    if (this.selectedProducts && this.selectedProducts.length > 0) {
      this.selectedProducts.forEach(product => {
        this.addToCart(product);
        this.recalculateCartTotals();
      });

      this.selectedProducts = [];
      this.barcodeNumber = null;
      this.productId = null;
    }
  }


  addToCart(product?: ProductResponse) {
    const existingProductIndex = this.productsInCart.findIndex(p => p.productId === product.productId);
    if (existingProductIndex !== -1) {
      this.productsInCart[existingProductIndex].quantity++;
      this.recalculateCartTotals();
    } else {
      product.quantity = 1;
      this.productsInCart.push(product);
      this.originalTotalPrice=+product.total
    }
    this.saveCartToLocalStorage();
  }

  clearCart() {
    this.productsInCart = [];
    localStorage.removeItem('cart');
    this.totalPrice =0
    this.totalTax = 0
    this.overallTotal = 0
  }

  calculateTotal(cartItem: ProductResponse) {
    cartItem.total = (cartItem.price + cartItem.tax) * cartItem.quantity;
    this.saveCartToLocalStorage();
    this.recalculateCartTotals();
  }

  deleteItemFromCart(index: number) {
    this.productsInCart.splice(index, 1);
    this.saveCartToLocalStorage();
    this.recalculateCartTotals();
  }

  saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.productsInCart));
  }

  private restoreFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.productsInCart = JSON.parse(storedCart);
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.productsInCart));
  }

  calculateCartTotals() {
    this.totalPrice = this.productsInCart.reduce((total, product) => total + (product.price * product.quantity), 0);
    this.totalTax = this.productsInCart.reduce((total, product) => total + (product.tax * product.quantity), 0);
    this.overallTotal = this.totalPrice + this.totalTax;
  }

  private recalculateCartTotals() {
    this.totalPrice = this.productsInCart.reduce((total, product) => total + (product.price * product.quantity), 0);
    this.totalTax = this.productsInCart.reduce((total, product) => total + (product.tax * product.quantity), 0);
    this.overallTotal = this.totalPrice + this.totalTax;
  }


  getAllVouchers() {
    this.voucherService.getAllVouchers().subscribe(
      vouchers => {
        this.vouchers = vouchers;
        console.log('All vouchers:', this.vouchers);
      },
      error => {
        console.error('Error fetching vouchers:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch vouchers.' });
      }
    );
  }

  checkVoucher() {
    if (this.voucherValue) {
      const matchedVoucher = this.vouchers.find(voucher => voucher.voucherCode === this.voucherValue);
      if (matchedVoucher) {
        this.v = matchedVoucher;
        this.v.validForNumberOfCustomers = matchedVoucher.validForNumberOfCustomers - 1;
        this.vId = matchedVoucher.voucherID;
        console.log('Voucher successfully matched:', matchedVoucher);
        this.messageService.add({ severity: 'success', summary: 'Voucher Applied', detail: 'Voucher successfully applied.' });
        const discountPercentage = matchedVoucher.discountAmount / 100;
        const discountAmount = this.totalPrice * discountPercentage;
        this.totalDiscount = discountAmount
        this.totalDiscount = parseFloat(this.totalDiscount.toFixed(2));
        console.log('Discount amount:', discountAmount);
        this.productsInCart.forEach(product => {
          const discountedPrice = product.price * (1 - discountPercentage);
          product.price = parseFloat(discountedPrice.toFixed(2));
        });
        this.recalculateCartTotals();
        this.voucherInputEmpty = true;
        this.voucherApplied = true;
      } else {
        console.log('Voucher not found.');
        this.messageService.add({ severity: 'error', summary: 'Invalid Voucher', detail: 'The voucher code entered is not valid.' });
        this.voucherInputEmpty = true;
      }
    } else {
      console.log('Please enter a voucher code.');
      this.messageService.add({ severity: 'warn', summary: 'No Voucher Code', detail: 'Please enter a voucher code.' });
      this.voucherInputEmpty = true;
    }
  }  

  onVoucherInputChange() {
    this.voucherInputEmpty = !this.voucherValue;
  }

  rewindVoucherChanges() {
    this.totalDiscount = 0
    this.products.forEach(p=>{
      this.productsInCart.forEach(product => {
        if(p.productId==product.productId){
          product.price=p.price
        }

      });
    })
    this.recalculateCartTotals() 
  }

  removeVoucher() {
    if(this.voucherValue){
    this.voucherValue = null;
    this.vId=-1
    this.rewindVoucherChanges();
    this.voucherApplied = false;
    this.v.validForNumberOfCustomers=this.v.validForNumberOfCustomers+1;
    }
    
  }

  clearform(){
    this.customers=[]
  }

  submitForm() {
    if (this.saleForm) {
      const invoiceRequest = this.prepareInvoiceData();
      this.invoiceService.createInvoice(invoiceRequest).subscribe(
        response => {
          if (this.voucherValue) {
            this.voucherService.updateVoucher(this.vId, this.v).subscribe(
              res => {
                console.log(res);
              }
            );
          }
          console.log('Invoice created successfully:', response);
          this.clearForm();
        },
        error => {
          console.error('Error creating invoice:', error);
        }
      );
    } else {
      console.error('Form is invalid. Please fill all required fields.');
    }
  }

  clearForm() {
    this.selectedCustomer = null;
    this.selectedProducts = [];
    this.selectedPaymentMethod = null;
    this.selectedStatus = null;
    this.voucherValue = null;
    this.clearCart();
    this.saleForm.reset();
    this.initializeForm();
  }  

  printInvoice() {
    if (this.saleForm) {
      const invoiceData = this.prepareInvoiceData();
      console.log(invoiceData)
      this.invoicePdfComponent.invoiceData = invoiceData;
      console.log(invoiceData)
      this.invoicePdfComponent.generatePdf();
    }
  }
    prepareInvoiceData(): InvoiceRequest {
      let selectedPaymentMethod = '';
      let selectedStatus = '';
      if (this.selectedPaymentMethod) {
        selectedPaymentMethod = this.selectedPaymentMethod.value;
      }
      if (this.selectedStatus) {
        selectedStatus = this.selectedStatus.value;
      }
    
      const invoiceRequest: InvoiceRequest = {
        dateTime: this.saleForm.value.dateTime,
        products: this.saleForm.value.products,
        paymentMethod: selectedPaymentMethod,
        customerName: this.saleForm.value.customerName,
        customerPhone: this.saleForm.value.customerPhone,
        totalMRP: this.saleForm.value.totalMRP,
        totalTax: this.saleForm.value.totalTax,
        totalPrice: this.saleForm.value.totalPrice,
        status: selectedStatus,
        barcodeNumbers: this.saleForm.value.barcodeNumbers,
        voucher: this.saleForm.value.voucher,
        totalDiscount: this.saleForm.value.totalDiscount
      };
    
      return invoiceRequest;
    }
    
  }
  