import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductRequest } from '../model/product/product-request.model';
import { ProductResponse } from "../model/product/product-response.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.baseUrl}`);
  }

  getProductById(productId: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/${productId}`);
  }

  createProduct(productRequest: ProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.baseUrl}`, productRequest);
  }

  updateProduct(productId: number, productRequest: ProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.baseUrl}/${productId}`, productRequest);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`);
  }

  uploadFile(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<string>(`${this.baseUrl}/upload`, formData);
  }

  generateBarcode(productId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/product-barcode/${productId}`, { responseType: 'blob' });
  }

  getProductsBySupplierId(supplierId: number): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.baseUrl}/supplier/${supplierId}`);
  }
}
