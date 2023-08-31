import { Component } from '@angular/core';
import { ChatService } from '@app/_services/chat.service';

@Component({
  selector: 'main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.css']
})
export class MainFrameComponent {
  constructor(private chatService: ChatService){
  
  }
}
