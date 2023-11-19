import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {notifications: string[]},
              public dialogRef: MatDialogRef<NotificationsComponent>) {}
}
