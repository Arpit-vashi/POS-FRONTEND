import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordChangeService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  /**
   * Changes the password for a specific user by their ID.
   * @param id The ID of the user whose password is to be changed.
   * @param newPassword The new password data.
   */
  changePassword(id: number, newPassword: string): Observable<any> {
    const url = `${this.baseUrl}/reset-password/${id}`;
    return this.http.put(url, { newPassword });
  }
}
