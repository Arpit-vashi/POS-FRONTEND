import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceRequest } from '../model/invoice/invoice-request.model';
import { InvoiceResponse } from '../model/invoice/invoice-response.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private baseUrl = 'http://localhost:8080/api/invoices';

  constructor(private http: HttpClient) { }

  getAllInvoices(): Observable<InvoiceResponse[]> {
    return this.http.get<InvoiceResponse[]>(this.baseUrl);
  }

  getInvoiceById(id: number): Observable<InvoiceResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<InvoiceResponse>(url);
  }

  createInvoice(invoice: InvoiceRequest): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(this.baseUrl, invoice);
  }

  updateInvoice(id: number, invoice: InvoiceRequest): Observable<InvoiceResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<InvoiceResponse>(url, invoice);
  }

  deleteInvoice(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
