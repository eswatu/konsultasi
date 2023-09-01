import { Component } from '@angular/core';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { ChatService } from '@app/_services/chat.service';

@Component({
  selector: 'main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.css']
})
export class MainFrameComponent {
  private user: User;
  constructor(private chatService: ChatService,
    private authService: AuthenticationService){
     authService.user.subscribe(x => {
      this.user = x;
      chatService.firstInit(x);
    });
  }
  ngOnDestroy(){
    
  }
}
