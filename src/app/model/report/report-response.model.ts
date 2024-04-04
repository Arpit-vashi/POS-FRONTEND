export interface ReportResponse {
  userCount: number;
  voucherCount: number;
  invoiceCount: number;
  totalMRP: number;
  totalTax: number;
  totalDiscount: number;
  totalPrice: number;
  totalInvoicesForWeek: number;
  totalMRPForWeek: number;
  totalTaxForWeek: number;
  totalDiscountForWeek: number;
  totalPriceForWeek: number;
  totalInvoicesForMonth: number;
  totalMRPForMonth: number;
  totalTaxForMonth: number;
  totalDiscountForMonth: number;
  totalPriceForMonth: number;
}
