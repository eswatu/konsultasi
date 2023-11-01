import { Component, Input } from '@angular/core';
import { ChatReply } from '@app/_models/reply';

@Component({
  selector: 'chatbubble',
  templateUrl: './chatbubble.component.html',
  styleUrls: ['./chatbubble.component.css']
})
export class ChatbubbleComponent {
  @Input() chatReply: ChatReply;
  @Input() isOwner: boolean;
  filetype: string;
  imageUrls = [];
  videoUrls = [];
  constructor() {
  }
  onSelectFile(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (file.type.indexOf("image") > -1) {
            this.imageUrls.push(e.target.result);
          } else if (file.type.indexOf("video") > -1) {
            this.videoUrls.push(e.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

}
