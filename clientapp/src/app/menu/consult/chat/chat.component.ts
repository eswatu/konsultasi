import { Component } from '@angular/core';
import { ChatService } from '@app/_services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  newMessage = '';
  messageList: string[] = [];
  constructor(private chatservice: ChatService) {

  }
  ngOnInit(){
    this.chatservice.getMessage().subscribe((message: string) => {
      this.messageList.push(message);
    })
  }
  sendMessage() {
    this.chatservice.sendMessage(this.newMessage);
    this.newMessage = '';
  }

}
