import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseOrderRequest } from '../model/purchase-order/purchase-order-request.model';
import { PurchaseOrderResponse } from '../model/purchase-order/purchase-order-response.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private apiUrl = 'http://localhost:8080/api/purchaseOrders';

  constructor(private http: HttpClient) {}

  getAllPurchaseOrders(): Observable<PurchaseOrderResponse[]> {
    return this.http.get<PurchaseOrderResponse[]>(this.apiUrl);
  }

  getPurchaseOrderById(id: number): Observable<PurchaseOrderResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<PurchaseOrderResponse>(url);
  }

  createPurchaseOrder(purchaseOrder: PurchaseOrderRequest): Observable<PurchaseOrderResponse> {
    return this.http.post<PurchaseOrderResponse>(this.apiUrl, purchaseOrder);
  }

  updatePurchaseOrder(id: number, purchaseOrder: PurchaseOrderRequest): Observable<PurchaseOrderResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<PurchaseOrderResponse>(url, purchaseOrder);
  }

  deletePurchaseOrder(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
