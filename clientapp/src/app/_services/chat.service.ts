import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ChatReply } from '@app/_models/reply';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  setupConnection(jtoken: string, uname: string) {
    this.socket = io(`http://localhost:4000`,
     {auth:{ token: jtoken, username: uname }}
    );
  }
  disconnect(){
    if(this.socket) {
      this.socket.disconnect();
    }
  }
  sendMessage({message, roomName}): void{
    if(this.socket) {
      this.socket.emit('sendMessage', {message, roomName});
    }
  }
  getMessage(): Observable<ChatReply>{
    return new Observable<ChatReply>(observer => {
      this.socket.on('sendMessage', (message: ChatReply) => {
        observer.next(message);
      }); 
    });
  }
  join(roomName:string) {
    this.socket.emit('join', roomName);
  }
  leave(roomName:string) {
    this.socket.emit('leave', roomName);
  }
}
