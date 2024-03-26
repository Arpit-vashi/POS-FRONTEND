import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BarcodeResponse  } from '../model/barcode/barcode-response.model'; 
import { BarcodeRequest } from "../model/barcode/barcode-request.model";

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {
  private baseUrl = 'http://localhost:8080/api/barcodes';

  constructor(private http: HttpClient) {}

  createBarcode(barcode: BarcodeRequest): Observable<BarcodeResponse> {
    return this.http.post<BarcodeResponse>(`${this.baseUrl}`, barcode);
  }

  getBarcodeById(id: number): Observable<BarcodeResponse> {
    return this.http.get<BarcodeResponse>(`${this.baseUrl}/${id}`);
  }

  getAllBarcodes(): Observable<BarcodeResponse[]> {
    return this.http.get<BarcodeResponse[]>(`${this.baseUrl}`);
  }

  updateBarcode(id: number, barcode: BarcodeRequest): Observable<BarcodeResponse> {
    return this.http.put<BarcodeResponse>(`${this.baseUrl}/${id}`, barcode);
  }

  deleteBarcode(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
