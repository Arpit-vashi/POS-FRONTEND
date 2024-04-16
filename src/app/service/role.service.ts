import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleRequest } from '../model/role/role-request.model';
import { RoleResponse } from '../model/role/role-response.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) {}

  createRole(roleRequest: RoleRequest): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(this.baseUrl, roleRequest);
  }

  getRoleById(id: number): Observable<RoleResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<RoleResponse>(url);
  }

  getAllRoles(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(this.baseUrl);
  }

  updateRole(id: number, roleRequest: RoleRequest): Observable<RoleResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<RoleResponse>(url, roleRequest);
  }

  deleteRole(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
