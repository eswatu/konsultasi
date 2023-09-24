import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User } from '@app/_models';
import { ChatReply, CountdownData, NotificationData, SolveData } from '@app/_models/reply';
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
  chatTabs : TabChat[] = [];
  user: User;
  groupToggle = new FormControl('');
  selectedId: string;
  currentTicket: Ticket;
  
  constructor(private chatService: ChatService,
    private tService: TicketService,
    private authService: AuthenticationService,
    public dialog: MatDialog) {
      this.authService.user.subscribe(u => {
        this.user = u;
      });
    }
    ngOnInit() {
      this.chatTabs = [];
      // set koneksi ke server
      this.chatService.setupConnection(this.user.jwtToken, this.user);
      // get unsolved ticket
      this.tService.getsData(0, 50, 'createdAt','asc', false, '','').subscribe((result) => {
        // membuat default room
        this.chatTabs = [];
        // this.chatTabs.push(<TabChat>{id:'mainRoom', name: 'Lobi Utama', value: 'mainRoom', hasUpdate: false});
        result['data'].forEach(item => {
          const t = <TabChat>{ id: item.id, name: item.problem,
                                value: item.name, updateCount: 0, ticket: item};
          if (this.chatTabs.some(obj => obj.id === item.id) === false) {
            if (item.name === 'mainRoom') {
              this.chatTabs.unshift(t);
            } else {
              this.chatTabs.push(t);
            }
          }
          this.chatService.join(item.id);
        });
        this.onSelectionChange();
        this.currentTicket = this.chatTabs[0].ticket;
      //  console.log('tab ada sejumlah: ',this.chatTabs.length);
      });
      // subs for new room
        this.chatService.getRoom().subscribe((roomId) => {
         console.log(`new room id ${roomId}`);
        if (this.chatTabs.some(obj => obj['id'] !== roomId)){
          console.log('no same room id');
          this.tService.get<Ticket>(roomId).subscribe(result => {
            this.chatTabs.push({id: result.id, name: result.problem, value: result.name, updateCount: 0, ticket: result, triggerCountdown:false});      
          });
        } else {
          console.log('has same room id');
        }
        });
          // waiting for new message
    this.chatService.getMessage().subscribe((msg:ChatReply) => {
      // console.log('saya dapat '+ msg);
      const roomticket = this.chatTabs.find(item => item.id === msg.roomId);
      roomticket.ticket.messages.push(msg);
      if (roomticket.ticket.creator.id !== this.user.id) {
        roomticket.updateCount++;
      }
    });
        // waiting for trigger countdown
        this.chatService.getCountDown().subscribe((countDownData:CountdownData) => {
          if (this.chatTabs.some(obj => obj.id === countDownData.roomId) && countDownData.roomId !== this.currentTicket.id) {
            const room  = this.chatTabs.find(obj => obj.id === countDownData.roomId);
              room.updateCount++;
              room.triggerCountdown = true;
          };
        });
      // subs for answer
    this.chatService.getAnswer().subscribe((solveData: SolveData) => {
      console.log('mainframe got answer for room ', solveData.roomId);
      this.chatService.leave(solveData.roomId);
        if (this.chatTabs.some(obj => obj.id === solveData.roomId)) {
          const room = this.chatTabs.find(obj => obj.id === solveData.roomId);
          const mainRoom = this.chatTabs.find(obj => obj.name === 'mainRoom');
          if (room.ticket.creator.id === this.user.id) {
            this.onSelectionChange();
          }
          this.chatTabs = this.chatTabs.filter(obj => obj.id !== solveData.roomId);
        }
    });
  }
  openDefaultRoom() {
    this.selectedId = this.chatTabs[0].id;
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
      this.chatTabs.push({id: room.id, name: room.problem, value: room.name,
                          updateCount: 0, triggerCountdown: false});
      this.chatService.createRoom(room.id);
    });   
  }
  onSelectionChange(event?: any ) {
    if (event) {
      this.selectedId = event.value;
      // console.log('selectedId ', event.value);
      const tab = this.chatTabs.find(obj => obj.id === this.selectedId);
      this.currentTicket = tab.ticket;
      tab.updateCount = 0;
      tab.triggerCountdown = false;
      // console.log(this.currentTicket);
    } else {
      const tab = this.chatTabs.find(obj => obj.name === 'mainRoom');
      this.currentTicket = tab.ticket;
    }
  }

}

export class TabChat {
  id: string;
  name: string;
  value: string;
  updateCount: number;
  triggerCountdown: boolean;
  ticket?: Ticket;
}
