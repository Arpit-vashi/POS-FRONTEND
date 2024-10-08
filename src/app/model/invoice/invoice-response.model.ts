export interface InvoiceResponse {
    invoiceID: number;
    dateTime: string;
    products: string[];
    paymentMethod: string;
    barcodeNumbers: string[];
    customerName: string;
    customerPhone: string;
    voucher: string;
    totalMRP: number;
    totalTax: number;
    totalDiscount: number;
    totalPrice: number;
    status: string;
    cartData: any
  }