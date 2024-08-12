import { Component } from '@angular/core';

@Component({
  selector: 'app-notification-pop-up',
  templateUrl: './notification-pop-up.component.html',
  styleUrls: ['./notification-pop-up.component.css'],
})
export class NotificationPopUpComponent {
  show: boolean = false;
  message: string = '';
  title: string = '';
  messageType: 'success' | 'error' = 'success'; // Asume dos tipos por simplicidad

  constructor() {}

  display(
    message: string,
    title: string,
    messageType: 'success' | 'error'
  ): void {
    this.message = message;
    this.title = title;
    this.messageType = messageType;
    this.show = true;
  }

  closePopup(): void {
    this.show = false;
  }
}
