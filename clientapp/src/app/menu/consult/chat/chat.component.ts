import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from '@app/_models';
import { ChatReply,SolveData } from '@app/_models/reply';
import { Ticket } from '@app/_models/ticket';
import { AuthenticationService } from '@app/_services';
import { ChatService } from '@app/_services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  // input dari parent
  @Input({required: true}) ticketdata!: Ticket;
  @Input({required:true}) isMainRoom:boolean;
  @Input ({required:true}) counterStart: boolean;
  // Output kepada parent
  // @Output() messageToParent = new EventEmitter<ChatReply>();
  @Output() startTrigger = new EventEmitter<{fromserver:boolean, room:string}>();
  @Output() stopTrigger = new EventEmitter<{fromserver:boolean, room:string}>();
  @Output() emitMessage = new EventEmitter<ChatReply>();
  user: User;
  // untuk notify ke parent
  message = new FormControl('');
  
  constructor(private cservice:ChatService, private auService:AuthenticationService) {
    this.auService.user.subscribe(x => {
      this.user = x;
    });
  }
  ngOnInit(){

  }

  sendMessage(){
    const cr = <ChatReply>{user:this.user, message:this.message.value, roomId:this.ticketdata.id};
    this.emitMessage.emit(cr);
    // this.cservice.sendMessage(cr);
    console.log('i send ', JSON.stringify(cr))
    this.message.reset();
  }

  startCountDown(){
    this.startTrigger.emit({fromserver:false, room:this.ticketdata.id});
    console.log('chat emit start to main ', this.ticketdata.id);
  }
  stopCountDown(){
    this.stopTrigger.emit({fromserver:false, room:this.ticketdata.id});
    console.log('chat emit stop to main ', this.ticketdata.id);
  }
  approveAnswer() {
    // cek jika masih ada counter
this.stopCountDown();
    // this.notifyParent(NotificationType.newanswer);
    // kirim pesan ke pub
    // this.cservice.sendMessage(<ChatReply>{user:this.user, message:`Jawaban diterima`, roomId:this.ticketdata.id});
    // approve ke server
this.stopCountDown();
    // this.notifyParent(NotificationType.newanswer);
    // kirim pesan ke pub
    // this.cservice.sendMessage(<ChatReply>{user:this.user, message:`Jawaban diterima`, roomId:this.ticketdata.id});
    // approve ke server
     this.cservice.approveAnswer(<SolveData>{solver: this.whosolve(), roomId: this.ticketdata.id});
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
