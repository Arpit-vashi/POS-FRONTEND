export interface ProductResponse {
    quantity: number;
    productId: number;
    name: string;
    description: string;
    price: number;
    tax: number;
    total: number;
    stockQuantity: number;
    purchasePrice: number;
    barcodeNumber: string;
    barcodeImage: string;
    supplierIds: number[];
  }
  