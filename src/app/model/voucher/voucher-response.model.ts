export interface VoucherResponse {
    voucherID: number;
    voucherCode: string;
    discountAmount: number;
    validForNumberOfCustomers: number;
    validForNumberOfDays: number;
    isValid: boolean;
}
  