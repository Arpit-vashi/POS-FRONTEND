export interface ProductRequest {
    name: string;
    description: string;
    price: number;
    tax: number;
    total: number;
    stockQuantity: number;
    purchasePrice: number;
    supplierIds: number[];
  }
  