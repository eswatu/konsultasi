import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from '@app/_models';
import { ChatReply, CountdownData, NotificationData, NotificationType, SolveData } from '@app/_models/reply';
import { Ticket } from '@app/_models/ticket';
import { AuthenticationService } from '@app/_services';
import { ChatService } from '@app/_services/chat.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnDestroy {
  @Input({required: true}) ticketdata!: Ticket;
  @Input({required:true}) isMainRoom:boolean;
  user: User;

  @ViewChild('triggerbutton') myTriggerButton: ElementRef;
  @ViewChild('stoptriggerbutton') myStopTriggerButton: ElementRef;
  // untuk notify ke parent
  @Output() dataemitter: EventEmitter<NotificationData> = new EventEmitter<NotificationData>();

  message = new FormControl('');
  counterStart: boolean = false;
  countdownNumber: number = 60;
  private timer: Subscription; 

  constructor(private cservice:ChatService, private auService:AuthenticationService) {
    this.auService.user.subscribe(x => {
      this.user = x;
    });
  }
  ngOnInit(){
    // waiting for trigger countdown
    this.cservice.getCountDown().subscribe((countDownData:CountdownData) => {
      console.log(countDownData);
      if (countDownData.roomId === this.ticketdata.id) {
        if (countDownData.trigger && !this.counterStart) {
          this.startCountDown(true);
        } else if (!countDownData.trigger && this.counterStart){
          this.stopCountDown(true);
        }
      };
    });
  }

  ngOnDestroy(){
    this.stopCountDown();
  }
  sendMessage(){
    const cr = <ChatReply>{user:this.user, message:this.message.value, roomId:this.ticketdata.id};
    this.cservice.sendMessage(cr);
    this.message.reset();
  }

  startCountDown(fromserver:boolean = false){
    if (!this.counterStart) {
      if (!fromserver) {
        // emit ke server kalau mulai trigger (room)
        this.cservice.triggerCountDown(<CountdownData>{ roomId:this.ticketdata.id, trigger:true});
        // kirim pesan ke pub : memulai trigger
        this.cservice.sendMessage(<ChatReply>{user:this.user, message:`${this.user.name} memulai trigger close case dan akan tertutup otomatis dalam 60 detik`, roomId:this.ticketdata.id});
        // console.log(this.user.name, 'start countdown ');
      }
      // mulai counter
      this.counterStart = true;
      this.timer = interval(1000).subscribe(n => {
        this.countdownNumber--;
        if(this.countdownNumber == 0){
          // selesai, stop counter
          this.stopCountDown();
          // approve answer
          this.approveAnswer();
        }
      });
    }
  }
  stopCountDown(fromserver:boolean = false){
    if (this.counterStart) {
      console.log(this.user.name, ' stop countdown');
      this.timer.unsubscribe();
      if (!fromserver) {
        // kirim pesan ke server untuk menghentikan trigger (room)
        this.cservice.triggerCountDown(<CountdownData>{roomId:this.ticketdata.id, trigger:false});
        // notif ke pub kalau trigger dihentikan
        this.cservice.sendMessage(<ChatReply>{user:this.user, message:`${this.user.name} menghentikan trigger close case`, roomId:this.ticketdata.id});
      }
      this.counterStart = false;
      this.countdownNumber = 60;
    }
  }
  approveAnswer() {
    // cek jika masih ada counter
    if (this.counterStart) {
      this.stopCountDown();
    }
    // this.notifyParent(NotificationType.newanswer);
    // kirim pesan ke pub
    // this.cservice.sendMessage(<ChatReply>{user:this.user, message:`Jawaban diterima`, roomId:this.ticketdata.id});
    // approve ke server
     this.cservice.approveAnswer(<SolveData>{solver: this.whosolve(), roomId: this.ticketdata.id});
  }
  notifyParent(tipe:NotificationType) {
    console.log('child tries to communicat...');
    const solver = this.whosolve();
    const mdt = <NotificationData>{kind:tipe, roomId: this.ticketdata.id, sender: solver};
    this.dataemitter.emit(mdt);
  }
  whosolve() {
    const replies = [...this.ticketdata.messages].reverse().map(obj => obj.user);
    const solver = replies.find(obj => obj.role !== 'Client');
    return solver;
  }
  resetInput() {
    this.message.reset();
  }
  
}
