import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { User } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  constructor() {
  }
  firstInit(auth:User) {
    this.socket = io('http://localhost:4000',
    {auth:{ token: auth.jwtToken }});
  }
  public sendMessage(message:string) {
    this.socket.emit('message', message);
  }
  public getMessage(): Observable<string>{
    return new Observable<string>(observer => {
      this.socket.on('message', (message: string) => {
        observer.next(message);
      }); 
    });
  }
}
