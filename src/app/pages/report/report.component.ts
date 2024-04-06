import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../service/report.service';
import { ReportResponse } from '../../model/report/report-response.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NotificationService } from '../../service/notification.service';
import { NotificationResponse } from '../../model/notification/notification-response.model';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    providers: [MessageService],
})
export class ReportComponent implements OnInit {
    announcement: NotificationResponse[];
    announcementform: FormGroup;
    reportData: ReportResponse;

    constructor(
        private reportService: ReportService,
        private fb: FormBuilder,
        private notificationService: NotificationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadReportData();
        this.loadAnnouncement();
    }

    initForm(): void {
        this.announcementform = this.fb.group({
            message: ['', Validators.required],
        });
    }

    loadReportData(): void {
        this.reportService.generateReport().subscribe(
            (response: ReportResponse) => {
                this.reportData = response;
            },
            (error) => {
                console.error('Error fetching report:', error);
            }
        );
    }

    loadAnnouncement(): void {
        this.notificationService.getAllNotifications().subscribe(
            (response: NotificationResponse[]) => {
                this.announcement = response;
            },
            (error) => {
                console.error('Error fetching announcements:', error);
            }
        );
    }

    addAnnouncement(): void {
        if (this.announcementform.valid) {
            this.notificationService
                .createNotification({
                    message: this.announcementform.value.message,
                })
                .subscribe(
                    () => {
                        this.loadAnnouncement();
                        this.announcementform.reset();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Announcement Added',
                            detail: 'The Announcement has been added successfully.',
                        });
                    },
                    (error) => {
                        console.error('Error adding Announcement:', error);
                    }
                );
        }
    }

    deleteAnnouncement(id: number): void {
        this.notificationService.deleteNotification(id).subscribe(
            () => {
                this.loadAnnouncement();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Announcement Deleted',
                    detail: 'The Announcement has been deleted.',
                });
            },
            (error) => {
                console.error('Error deleting Announcement:', error);
            }
        );
    }

    updateAnnouncement(id: number, newMessage: string): void {
        const updatedNotification: Partial<NotificationResponse> = {
            message: newMessage,
        };
        this.notificationService
            .updateNotification(id, updatedNotification as NotificationResponse)
            .subscribe();
    }
}
