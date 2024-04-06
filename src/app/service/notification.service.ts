import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationResponse } from '../model/notification/notification-response.model';
import { NotificationRequest } from '../model/notification/notification-request.model';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private baseUrl = 'http://localhost:8080/notifications';

    constructor(private http: HttpClient) {}

    getAllNotifications(): Observable<NotificationResponse[]> {
        return this.http.get<NotificationResponse[]>(this.baseUrl);
    }

    getNotificationById(id: number): Observable<NotificationResponse> {
        return this.http.get<NotificationResponse>(`${this.baseUrl}/${id}`);
    }

    createNotification(
        notificationRequest: NotificationRequest
    ): Observable<NotificationResponse> {
        return this.http.post<NotificationResponse>(
            this.baseUrl,
            notificationRequest
        );
    }

    updateNotification(
        id: number,
        notificationRequest: NotificationRequest
    ): Observable<NotificationResponse> {
        return this.http.put<NotificationResponse>(
            `${this.baseUrl}/${id}`,
            notificationRequest
        );
    }

    deleteNotification(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
