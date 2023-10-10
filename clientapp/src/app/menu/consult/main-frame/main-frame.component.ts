import { Component, QueryList, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User } from '@app/_models';
import { ChatReply, CountdownData, SolveData } from '@app/_models/reply';
import { Ticket } from '@app/_models/ticket';
import { AuthenticationService, TicketService } from '@app/_services';
import { ChatService } from '@app/_services/chat.service';
import { TicketFormComponent } from '@app/menu/consult/ticket-form/ticket-form.component';
import { ChatComponent } from '../chat/chat.component';
import { Subscription, interval } from 'rxjs';

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
  currentTab: TabChat;
  private defaultCountdown = 5;
  @ViewChild(ChatComponent) childComponents: QueryList<ChatComponent>;

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
      this.tService.getsData(0, 100, 'createdAt','asc', false,null, null, '','').subscribe((result) => {
        // membuat default room
        this.chatTabs = [];
        // this.chatTabs.push(<TabChat>{id:'mainRoom', name: 'Lobi Utama', value: 'mainRoom', hasUpdate: false});
        result['data'].forEach(item => {
          const t = <TabChat>{ id: item.id, name: item.problem, company: item.creator.company,
                                value: item.name, updateCount: 0, ticket: item, triggerCountdown:false,
                              timer: null, countDown: this.defaultCountdown };
          if (this.chatTabs.some(obj => obj.id === item.id) === false) {
            if (item.name === 'mainRoom') {
              this.chatTabs.unshift(t);
            } else {
              this.chatTabs.push(t);
            }
          }
          this.chatService.join(item.id);
        });
        this.currentTab = this.chatTabs[0];
      //  console.log('tab ada sejumlah: ',this.chatTabs.length);
      });
      // subs for new room
      this.chatService.getRoom().subscribe((roomId) => {
              // console.log(`new room id ${roomId}`);
              if (!this.chatTabs.some(obj => obj.id === roomId)){
                // console.log('no same room');
                this.tService.get<Ticket>(roomId).subscribe(result => {
                  // console.log(result);
                  this.addRoom(result);    
                });
              }
      });
      // waiting for new message
      this.chatService.getMessage().subscribe((msg:ChatReply) => {
        // console.log('saya dapat '+ msg);
        const roomticket = this.chatTabs.find(item => item.id === msg.roomId);
        roomticket.ticket.messages.push(msg);
        // beri notif kalau sedang tidak diklik
        if (roomticket.ticket.id !== this.currentTab.id) {
          roomticket.updateCount++;
        }
      });
      // waiting for trigger countdown
      this.chatService.getCountDown().subscribe((countDownData:CountdownData) => {
        if (this.chatTabs.some(obj => obj.id === countDownData.roomId)) {
            const room  = this.chatTabs.find(obj => obj.id === countDownData.roomId);
              // room.updateCount++;
              // room.triggerCountdown = true;
            if (countDownData.trigger && !room.triggerCountdown) {
              this.startCountDown(true, countDownData.roomId);
            } else if (!countDownData.trigger && room.triggerCountdown) {
              this.stopCountDown(true, countDownData.roomId);
            }
        };
      });
      // waiting for approved answer
      this.chatService.getAnswer().subscribe((solveData: SolveData) => {
        console.log('mainframe got answer for room ', solveData.roomId);
        this.chatService.leave(solveData.roomId);
          if (this.chatTabs.some(obj => obj.id === solveData.roomId)) {
            const room = this.chatTabs.find(obj => obj.id === solveData.roomId);
            const mainRoom = this.chatTabs.find(obj => obj.name === 'mainRoom');
            if (room.ticket.creator.id === this.currentTab.id) {
              this.currentTab = this.chatTabs[0];
            }
            this.chatTabs = this.chatTabs.filter(obj => obj.id !== solveData.roomId);
          }
      });
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
      this.addRoom(room);
      this.chatService.createRoom(room.id);
    });   
  }
  onSelectionChange(event?: any ) {
    if (event) {
      this.selectedId = event.value;
      // console.log('selectedId ', event.value);
      this.currentTab = this.chatTabs.find(obj => obj.id === this.selectedId);
      this.currentTab.updateCount = 0;
      // console.log(this.currentTicket);
    } else {
      this.currentTab = this.chatTabs.find(obj => obj.name === 'mainRoom');
    }
  }

  startCountDown(fromserver:boolean = false, room: string){
    const chatRoom = this.chatTabs.find(obj => obj.id === room);
      if (!fromserver) {
        // emit ke server kalau mulai trigger (room)
        this.chatService.triggerCountDown(<CountdownData>{ roomId:room, trigger:true});
        // kirim pesan ke pub : memulai trigger
        this.chatService.sendMessage(<ChatReply>{user:this.user, message:`${this.user.name} memulai trigger close case dan akan tertutup otomatis dalam 60 detik`, roomId:room});
        // console.log(this.user.name, 'start countdown ');
      }
    // mulai counter
    chatRoom.triggerCountdown = true;
    chatRoom.timer = interval(1000).subscribe(n => {
      chatRoom.countDown--;
      if(chatRoom.countDown == 0){
        // selesai, stop counter
        this.stopCountDown(false, room);
        // approve answer
        this.approveAnswer(chatRoom.id);
      }
    });
}
childStart(event: {fromserver:boolean, room: string}) {
  const {fromserver, room} = event;
  this.startCountDown(fromserver, room);
}
childStop(event: {fromserver:boolean, room: string}) {
  const {fromserver, room} = event;
  this.stopCountDown(fromserver, room);
}
childSendMessage(event:any) {
  const { chatreply } = event;
  this.chatService.sendMessage(chatreply);
}
stopCountDown(fromserver:boolean = false, room: string){
    const chatRoom = this.chatTabs.find(obj => obj.id === room)
    console.log(this.user.name, ' stop countdown karena ', fromserver, ' dan room ', room);
    if (!fromserver) {
      // kirim pesan ke server untuk menghentikan trigger (room)
      this.chatService.triggerCountDown(<CountdownData>{roomId:room, trigger:false});
      // notif ke pub kalau trigger dihentikan
      this.chatService.sendMessage(<ChatReply>{user:this.user, message:`${this.user.name} menghentikan trigger close case`, roomId:room});
    }
    chatRoom.timer.unsubscribe();
    chatRoom.triggerCountdown = false;
    chatRoom.countDown = 60;
}

approveAnswer(room: string) {
  const child = this.childComponents.find(obj => obj.ticketdata.id === room);
  const chatRoom = this.chatTabs.find(obj => obj.id === room);
  // cek jika masih ada counter
  if (chatRoom.triggerCountdown) {
    this.stopCountDown(false, chatRoom.id);
  }
  this.currentTab = this.chatTabs[0];
  // this.notifyParent(NotificationType.newanswer);
  // kirim pesan ke pub
  // this.cservice.sendMessage(<ChatReply>{user:this.user, message:`Jawaban diterima`, roomId:this.ticketdata.id});
  // approve ke server
   this.chatService.approveAnswer(<SolveData>{solver: child.whosolve(), roomId: room});
}
// helper
addRoom(room:Ticket) {
  this.chatTabs.push(<TabChat>{id: room.id, name: room.problem, company: room.name,
    value: room.name, updateCount: 0, ticket: room, triggerCountdown:false,
    countDown: this.defaultCountdown, timer: null});
}
}

export class TabChat {
  id: string;
  name: string;
  company: string;
  value: string;
  updateCount: number;
  triggerCountdown: boolean;
  timer: Subscription;
  countDown: number;
  ticket: Ticket;
}
