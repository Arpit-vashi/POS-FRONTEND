import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../service/report.service';
import { ReportResponse } from '../../model/report/report-response.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.generateReport().subscribe(
      (response: ReportResponse) => {
        console.log('User Count:', response.userCount);
        console.log('Voucher Count:', response.voucherCount);
        console.log('Invoice Count:', response.invoiceCount);
        console.log('Total MRP:', response.totalMRP);
        console.log('Total Tax:', response.totalTax);
        console.log('Total Discount:', response.totalDiscount);
        console.log('Total Price:', response.totalPrice);
        console.log('Total Invoices for Week:', response.totalInvoicesForWeek);
        console.log('Total MRP for Week:', response.totalMRPForWeek);
        console.log('Total Tax for Week:', response.totalTaxForWeek);
        console.log('Total Discount for Week:', response.totalDiscountForWeek);
        console.log('Total Price for Week:', response.totalPriceForWeek);
        console.log('Total Invoices for Month:', response.totalInvoicesForMonth);
        console.log('Total MRP for Month:', response.totalMRPForMonth);
        console.log('Total Tax for Month:', response.totalTaxForMonth);
        console.log('Total Discount for Month:', response.totalDiscountForMonth);
        console.log('Total Price for Month:', response.totalPriceForMonth);
      },
      (error) => {
        console.error('Error fetching report:', error);
      }
    );
  }
}
