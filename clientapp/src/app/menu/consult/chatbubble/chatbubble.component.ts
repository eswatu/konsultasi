import { Component, Input, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatReply } from '@app/_models/reply';
import { FileuploadService } from '@app/_services/fileupload.service';

@Component({
  selector: 'chatbubble',
  templateUrl: './chatbubble.component.html',
  styleUrls: ['./chatbubble.component.css']
})
export class ChatbubbleComponent {
  @Input() chatReply: ChatReply;
  @Input() isOwner: boolean;
  @Input() isFile: boolean;
  @Input() ticketId: string;
  filetype: string;
  public image:string;
  constructor(private readonly domSanitizer: DomSanitizer,
    private fileService: FileuploadService
    ) {
  }
  ngOnInit(): void {
    this.fileService.downloadFile(this.ticketId,this.chatReply.id).subscribe(
      img => {
        this.image = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, this.domSanitizer.bypassSecurityTrustUrl(img));
      }
    )
  }

}
