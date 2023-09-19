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
  @ViewChild('triggerbutton') myButton: ElementRef;

  replies: ChatReply[];
  message = new FormControl('');
  isMainRoom:boolean = false;
  counterStart: boolean = false;
  countdownNumber: number = 10;
  private timer: Subscription; 

  constructor(private cservice:ChatService) {

  }
  ngOnInit(){
    this.replies = [];
    if (this.ticketdata.messages.length > 0) {
      if (this.ticketdata.name === 'mainRoom') {
        this.replies = this.ticketdata.messages.slice(-5);
        this.isMainRoom = true;
      } else {
        this.replies = this.ticketdata.messages;
      }
    }
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
      if (countDownData.roomName === this.ticketdata.id) {
        if (countDownData.start) {
          this.startCountDown();
        } else {
          this.stopCountDown();
        }
      };
    });
    // waiting for approved answer
    this.cservice.getAnswer().subscribe((roomName) => {
      if (roomName === this.ticketdata.id) {
        this.approveAnswer();
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

  startCountDown(){
    if (!this.counterStart) {
      this.counterStart = true;
      this.cservice.triggerCountDown(<CountdownData>{roomName:this.ticketdata.id, start:true});
      this.cservice.sendMessage(<ChatReply>{user:this.user, message:`${this.user.name} memulai trigger close case dan akan tertutup otomatis dalam 60 detik`, roomId:this.ticketdata.id});
      this.timer = interval(1000).subscribe(n => {
        this.countdownNumber--;
        if(this.countdownNumber === 0){
          this.counterStart = false;
          this.stopCountDown();
          this.approveAnswer();
        }
      });
    }
  }
  stopCountDown(){
    if (this.counterStart) {
      this.cservice.triggerCountDown(<CountdownData>{roomName:this.ticketdata.id, start:false});
      this.cservice.sendMessage(<ChatReply>{user:this.user, message:`${this.user.name} menghentikan trigger close case`, roomId:this.ticketdata.id});
      this.counterStart = false;
      this.countdownNumber = 60;
      this.timer.unsubscribe();
    }
  }
  approveAnswer() {
    this.cservice.sendMessage(<ChatReply>{user:this.user, message:`Saya menerima jawaban petugas`, roomId:this.ticketdata.id});
    this.stopCountDown();
    this.cservice.approveAnswer(this.ticketdata.id);
  }
  resetInput() {
    this.message.reset();
  }
  
}
