import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ChatReply } from '@app/_models/reply';
import { User } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  setupConnection(jtoken: string, auth: User) {
    const ns = new URL(auth.role, 'http://localhost:4000').toString();
    console.log(`connecting to: ${ns} using credential ${JSON.stringify(auth.username)}`);
    this.socket = io(ns,
     {auth:{ token: jtoken, username: auth.username}}
    );
  }
  disconnect(){
    if(this.socket) {
      this.socket.disconnect();
    }
  }
  sendMessage(message): void{
    if(this.socket) {
      this.socket.emit('sendMessage', message);
    }
  }
  getMessage(): Observable<ChatReply>{
    return new Observable<ChatReply>(observer => {
      this.socket.on('sendMessage', (message: ChatReply) => {
        observer.next(message);
      }); 
    });
  }
  createRoom(roomId: string){
    if(this.socket) {
      this.socket.emit('createdRoom', roomId);
    }
  }
  getRoom(): Observable<string>{
    return new Observable((observer) => {
      this.socket.on('createdRoom', (roomId) => {
        observer.next(roomId);
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
