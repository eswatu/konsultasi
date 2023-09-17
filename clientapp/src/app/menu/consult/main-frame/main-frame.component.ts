import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User } from '@app/_models';
import { Ticket } from '@app/_models/ticket';
import { AuthenticationService, TicketService } from '@app/_services';
import { ChatService } from '@app/_services/chat.service';
import { TicketFormComponent } from '@app/menu/consult/ticket-form/ticket-form.component';

@Component({
  selector: 'main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.css']
})
export class MainFrameComponent {
  chatTabs : TabChat[];
  user: User;
  constructor(private chatService: ChatService,
    private tService: TicketService,
    private authService: AuthenticationService,
    public dialog: MatDialog) {
      this.authService.user.subscribe(u => {
        this.user = u;
      });
    }
    ngOnInit() {
      // set koneksi ke server
      this.chatService.setupConnection(this.user.jwtToken, this.user);
      // get unsolved ticket
      this.tService.getsData(0, 50, 'createdAt','asc', false, '','').subscribe((result) => {
        // membuat default room
        this.chatTabs = [];
        // this.chatTabs.push(<TabChat>{id:'mainRoom', name: 'Lobi Utama', value: 'mainRoom', hasUpdate: false});
        result['data'].forEach(item => {
          const t = <TabChat>{id: item.id, name: item.problem, value: item.name, hasUpdate: false, ticket: item};
          if (item.name === 'mainRoom') {
            this.chatTabs.unshift(t);
          } else {
            this.chatTabs.push(t);
          }
        });
       console.log('tab ada sejumlah: ',this.chatTabs.length);
    });
      this.chatService.getRoom().subscribe((roomId) => {
      console.log(roomId);
      if (roomId){
        this.tService.get<Ticket>(roomId).subscribe(result => {
          this.chatTabs.push({id: result.id, name: result.problem, value: result.name, hasUpdate: true, ticket: result});      
        });
      }
    })
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
      const room = result.result;
      this.chatTabs.push({id: room.id, name: room.problem, value: room.name, hasUpdate: true});
      this.chatService.createRoom(room.id);
    });   
  }
}

export class TabChat {
  id: string;
  name: string;
  value: string;
  hasUpdate: boolean;
  ticket?: Ticket;
}
