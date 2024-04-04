import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportResponse } from '../model/report/report-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'http://localhost:8080/reports';

  constructor(private http: HttpClient) { }

  generateReport(): Observable<ReportResponse> {
    return this.http.get<ReportResponse>(`${this.baseUrl}/generateReport`);
  }
}
