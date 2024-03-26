import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerRequest } from '../model/customer/customer-request.model';
import { CustomerResponse } from '../model/customer/customer-response.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'http://localhost:8080/api/customers'; // Update with your backend API URL

  constructor(private http: HttpClient) { }

  createCustomer(customer: CustomerRequest): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(this.apiUrl, customer);
  }

  getCustomerById(id: number): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/${id}`);
  }

  getAllCustomers(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(this.apiUrl);
  }

  updateCustomer(id: number, customer: CustomerRequest): Observable<CustomerResponse> {
    return this.http.put<CustomerResponse>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadCSVFile(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<string>(`${this.apiUrl}/upload`, formData, { responseType: 'text' as 'json' });
  }
}
