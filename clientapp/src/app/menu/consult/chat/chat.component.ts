import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from '@app/_models';
import { ChatReply, Reply } from '@app/_models/reply';
import { Ticket } from '@app/_models/ticket';
import { AuthenticationService } from '@app/_services';
import { ChatService } from '@app/_services/chat.service';

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @Input() ticketdata: Ticket;
  @Input() user: User;
  replies: ChatReply[];
  message = new FormControl('');
  constructor(private cservice:ChatService) {

  }
  ngOnInit(){
    this.replies = [];
    if (this.ticketdata.messages.length > 0) {
      if (this.ticketdata.name === 'mainRoom') {
        this.replies = this.ticketdata.messages.slice(-5);
      } else {
        this.replies = this.ticketdata.messages;
      }
    }
    this.cservice.join(this.ticketdata.id);
    this.cservice.getMessage().subscribe((msg:ChatReply) => {
      // console.log('saya dapat '+ msg);
      if (msg.roomId === this.ticketdata.id) {
        this.replies.push(msg);
        // console.log(msg);
      }
    });
    // console.log(`isi reply dari ${this.ticketdata.id} adalah`,this.replies);
  }
  ngOnDestroy(){
    this.cservice.disconnect();
  }
  sendMessage(){
    const cr = <ChatReply>{user:this.user, message:this.message.value, roomId:this.ticketdata.id};
    this.cservice.sendMessage(cr);
    this.message.reset();
  }
  
}
