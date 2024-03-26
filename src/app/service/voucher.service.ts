import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VoucherRequest } from '../model/voucher/voucher-request.model';
import { VoucherResponse } from '../model/voucher/voucher-response.model';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private baseUrl = 'http://localhost:8080/api/vouchers';

  constructor(private http: HttpClient) { }

  getAllVouchers(): Observable<VoucherResponse[]> {
    return this.http.get<VoucherResponse[]>(this.baseUrl);
  }

  getVoucherById(id: number): Observable<VoucherResponse> {
    return this.http.get<VoucherResponse>(`${this.baseUrl}/${id}`);
  }

  createVoucher(voucher: VoucherRequest): Observable<VoucherResponse> {
    return this.http.post<VoucherResponse>(this.baseUrl, voucher);
  }

  updateVoucher(id: number, voucher: VoucherRequest): Observable<VoucherResponse> {
    return this.http.put<VoucherResponse>(`${this.baseUrl}/${id}`, voucher);
  }

  deleteVoucher(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
