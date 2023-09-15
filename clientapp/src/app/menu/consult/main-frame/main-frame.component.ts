import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChatService } from '@app/_services/chat.service';
import { TicketFormComponent } from '@app/menu/consult/ticket-form/ticket-form.component';

@Component({
  selector: 'main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.css']
})
export class MainFrameComponent {
  chatTabs : TabChat[] = [];
  constructor(private chatService: ChatService, public dialog: MatDialog) {
  }
  ngOnInit() {
    this.chatTabs.push(<TabChat>{id:'1', name: 'Lobi Utama', value: 'mainRoom', hasUpdate: false});
  }

  openForm(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.restoreFocus = true;
    dialogConfig.minWidth = 400;
    dialogConfig.minHeight = 480;
    dialogConfig.maxHeight = 800;
    const dialogRef = this.dialog.open(TicketFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    }

    );
  }
}

export class TabChat {
  id: string;
  name: string;
  value: string;
  hasUpdate: boolean;
}
