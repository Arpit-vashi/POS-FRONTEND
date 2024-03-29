import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRequest } from '../model/user/user-request.model';
import { UserResponse } from '../model/user/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/users'; // Adjust the base URL according to your API endpoint

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<UserResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<UserResponse>(url);
  }

  createUser(user: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.baseUrl, user);
  }

  updateUser(id: number, user: UserRequest): Observable<UserResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<UserResponse>(url, user);
  }

  deleteUser(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
