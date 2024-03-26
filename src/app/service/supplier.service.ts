import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupplierRequest } from '../model/supplier/supplier-request.model';
import { SupplierResponse } from '../model/supplier/supplier-response.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = 'http://localhost:8080/api/suppliers';

  constructor(private http: HttpClient) {}

  createSupplier(supplier: SupplierRequest): Observable<SupplierResponse> {
    return this.http.post<SupplierResponse>(this.apiUrl, supplier);
  }

  getSupplierById(id: number): Observable<SupplierResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<SupplierResponse>(url);
  }

  getAllSuppliers(): Observable<SupplierResponse[]> {
    return this.http.get<SupplierResponse[]>(this.apiUrl);
  }

  updateSupplier(id: number, supplier: SupplierRequest): Observable<SupplierResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<SupplierResponse>(url, supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }
}
