export interface PurchaseOrderResponse {
    id: number;
    supplier: string;
    products: string;
    store: string;
    quantity: number;
    buyingPrice: number;
    sellingPrice: number;
    orderDate: Date;
    deliverDate: Date;
    transportMethod: string;
    paymentMethod: string;
    status: string;
  }
  