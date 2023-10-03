import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ChatReply, CountdownData, SolveData } from '@app/_models/reply';
import { User } from '@app/_models';
import { environment }from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  setupConnection(jtoken: string, auth: User) {
    const ns = new URL(auth.role, environment.apiUrl).toString();
    console.log(`connecting to: ${ns} using credential ${JSON.stringify(auth.username)}`);
    this.socket = io(ns,
     {
      withCredentials:true,
      auth:{ token: jtoken, username: auth.username}},
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
  join(roomId:string) {
    this.socket.emit('join', roomId);
  }
  leave(roomId:string) {
    this.socket.emit('leave', roomId);
  }
  triggerCountDown(countDownData:CountdownData){
    this.socket.emit('triggerCountDown', countDownData);
  }
  getCountDown(): Observable<CountdownData>{
    return new Observable((observer) => {
      this.socket.on('triggerCountDown', (cd) => {
        observer.next(cd);
      });
    })
  }
  approveAnswer(solveData:SolveData){
    this.socket.emit('approveAnswer', solveData);
  }
  getAnswer(): Observable<SolveData>{
    return new Observable((observer) => {
      this.socket.on('approveAnswer', (solveData) => {
        observer.next(solveData);
      });
    })
  }

  
}

