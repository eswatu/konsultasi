import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from '@app/_models';
import { ChatReply, Reply } from '@app/_models/reply';
import { AuthenticationService } from '@app/_services';
import { ChatService } from '@app/_services/chat.service';

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  replies: ChatReply[] = [];
  user: User;
  message = new FormControl('');
  constructor(private cservice:ChatService,private authService: AuthenticationService) {
    this.authService.user.subscribe(u => {
      this.user = u;
    });
  }
  ngOnInit(){
    this.cservice.setupConnection(this.user.jwtToken, this.user.username);
    this.cservice.getMessage().subscribe((msg:ChatReply) => {
      this.replies.push(msg);
      console.log(msg);
    });
  }
  ngOnDestroy(){
    this.cservice.disconnect();
  }
  sendMessage(){
    const cr = <ChatReply>{user:this.user, message:this.message.value};
    const rn = '-';
    this.cservice.sendMessage({message:cr,roomName:rn});
    this.message.reset();
  }
  
}
