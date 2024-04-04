import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../service/report.service';
import { ReportResponse } from '../../model/report/report-response.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportData: ReportResponse;
  salesChartData: any;
  chartOptions: any;

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.generateReport().subscribe(
      (response: ReportResponse) => {
        this.reportData = response;
        console.log(this.reportData)
      },
      (error) => {
        console.error('Error fetching report:', error);
      }
    );
  }
}
