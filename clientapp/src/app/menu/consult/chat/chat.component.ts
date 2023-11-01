import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from '@app/_models';
import { ChatReply,SolveData } from '@app/_models/reply';
import { Ticket } from '@app/_models/ticket';
import { AuthenticationService } from '@app/_services';
import { ChatService } from '@app/_services/chat.service';
import { FileuploadService } from '@app/_services/fileupload.service';

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
  filesToUpload;
  // untuk notify ke parent
  message = new FormControl('');
  progress = 0;
  constructor(private cservice:ChatService, private auService:AuthenticationService,
    private fileService:FileuploadService) {
    this.auService.user.subscribe(x => {
      this.user = x;
    });
  }
  ngOnInit(){

  }

  sendMessage(){
    const cr = <ChatReply>{user:this.user,
      message:this.message.value, roomId:this.ticketdata.id,
      type:'text'};
    this.emitMessage.emit(cr);
    // this.cservice.sendMessage(cr);
    // console.log('i send ', JSON.stringify(cr))
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
    // approve ke server
  this.stopCountDown();
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
  handleFileUpload(files: FileList): void {
    // Process the selected files here
    this.filesToUpload = files;
    // console.log(this.filesToUpload);
  }
/**
 * Start uploading files.
 * 
 * @param filesToUpload - The files to upload.
 * @param ticketId - The ID of the ticket.
 * @returns void
 */
startUpload(): void {
  if (this.filesToUpload) {
    this.fileService.uploadFiles(this.filesToUpload, this.ticketdata.id).subscribe({
      next: (event:any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          // console.log('complete');
          const dataq = JSON.parse(event.body);
          console.log(dataq);
          console.log('dari event ', event);
          const cr = <ChatReply>{user:this.user,
            message:dataq.message, roomId:this.ticketdata.id,
            type:'file'};
          this.emitMessage.emit(cr);
        }
      },
      error: (err: any) => {
        console.log(err);
        this.progress = 0;
        if (err.error && err.error.message) {
          this.message = err.error.message;
        } else {
          console.log('Could not upload the file!');
        }
        this.filesToUpload = null;
      }
    },
    
    );
    this.filesToUpload = null;
  }
}
downloadFile(messageId:string) {
  this.fileService.downloadFile(this.ticketdata.id, messageId).subscribe(
    (response:any) => {
      let data = response;
      let dataType = data.type;
      let binaryData = [];
      binaryData.push(response);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
      if (data.name)
          downloadLink.setAttribute('download', data.name);
      document.body.appendChild(downloadLink);
      window.open(downloadLink.href);
    }
  );
}
  
}
