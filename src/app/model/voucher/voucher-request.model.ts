export interface VoucherRequest {
    voucherCode: string;
    discountAmount: number;
    validForNumberOfCustomers: number;
    validForNumberOfDays: number;
  }
  