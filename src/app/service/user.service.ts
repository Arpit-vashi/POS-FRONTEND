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

  /**
   * Fetches all users from the server. Each user includes their role information.
   */
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.baseUrl);
  }

  /**
   * Fetches a specific user by their ID, including their role details.
   * @param id The ID of the user to retrieve.
   */
  getUserById(id: number): Observable<UserResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<UserResponse>(url);
  }

  /**
   * Creates a new user with role information.
   * @param user The user data to send to the server, including roles.
   */
  createUser(user: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.baseUrl, user);
  }

  /**
   * Updates an existing user, including modifying their role assignments.
   * @param id The ID of the user to update.
   * @param user The updated user data to send, including roles.
   */
  updateUser(id: number, user: UserRequest): Observable<UserResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<UserResponse>(url, user);
  }

  /**
   * Deletes a user by their ID.
   * @param id The ID of the user to delete.
   */
  deleteUser(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
