import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from '@app/_models';
import { ChatReply, CountdownData } from '@app/_models/reply';
import { Ticket } from '@app/_models/ticket';
import { ChatService } from '@app/_services/chat.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @Input() ticketdata: Ticket;
  @Input() user: User;
  @ViewChild('triggerbutton') myTriggerButton: ElementRef;
  @ViewChild('stoptriggerbutton') myStopTriggerButton: ElementRef;

  replies: ChatReply[];
  message = new FormControl('');
  isMainRoom:boolean = false;
  isClosed: boolean;
  counterStart: boolean = false;
  countdownNumber: number = 10;
  private timer: Subscription; 

  constructor(private cservice:ChatService) {

  }
  ngOnInit(){
    this.replies = [];
    if (this.ticketdata.name === 'mainRoom') {
      this.isMainRoom = true;
    }
    this.replies = this.ticketdata.messages;
    this.isClosed = this.ticketdata.isSolved;
    this.cservice.join(this.ticketdata.id);
    // waiting for new message
    this.cservice.getMessage().subscribe((msg:ChatReply) => {
      // console.log('saya dapat '+ msg);
      if (msg.roomId === this.ticketdata.id) {
        this.replies.push(msg);
        // console.log(msg);
      }
    });
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
    // waiting for approved answer
    this.cservice.getAnswer().subscribe((roomId:string) => {
      if (roomId === this.ticketdata.id) {
        console.log('answer approved, no more worries');
      };
    })
  }

  ngOnDestroy(){
    this.cservice.disconnect();
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
    // kirim pesan ke pub
    this.cservice.sendMessage(<ChatReply>{user:this.user, message:`Jawaban diterima`, roomId:this.ticketdata.id});
    // approve ke server
    this.cservice.approveAnswer(this.ticketdata.id);
  }
  resetInput() {
    this.message.reset();
  }
  
}
