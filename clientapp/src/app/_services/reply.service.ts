import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Ticket } from '@app/_models/ticket';
import { Reply } from '@app/_models/reply';

@Injectable({
  providedIn: 'root'
})
export class ReplyService{
  url;
  getData(ticketId:string): Observable<Reply[]> {
    var params = new HttpParams()
      .set('ticketId', ticketId);
      return this.http.get<Reply[]>(this.url, {params});
  }
  get<Reply>(id: string): Observable<Reply> {
    let myurl = this.url + id;
    return this.http.get<Reply>(myurl);
  }
  put<Reply>(item: any): Observable<Reply> {
    let myurl = this.url + item.id;
    return this.http.put<Reply>(myurl, item);
  }
  post<Reply>(item: Reply, ticketId:string): Observable<Reply> {
    let myurl = this.url + ticketId;
    return this.http.post<Reply>(myurl, item);
  }
  constructor(private http: HttpClient) {
      this.url = `${environment.apiUrl}/replies/`;
     }

}
