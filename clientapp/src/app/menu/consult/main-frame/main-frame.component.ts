import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChatService } from '@app/_services/chat.service';
import { TicketFormComponent } from '@app/menu/tickets/ticket-form/ticket-form.component';

@Component({
  selector: 'main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.css']
})
export class MainFrameComponent {

  constructor(private chatService: ChatService, public dialog: MatDialog) {
  
  }

  openForm(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.restoreFocus = true;
    dialogConfig.minWidth = 400;
    dialogConfig.minHeight = 480;
    dialogConfig.maxHeight = 800;
    dialogConfig.data = {service: this.chatService}
    const dialogRef = this.dialog.open(TicketFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    }

    );
  }
}
