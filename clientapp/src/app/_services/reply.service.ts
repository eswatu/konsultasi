import { Inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Ticket } from '@app/_models/ticket';

export class ReplyService{
  url;
  http: any;
  getData(ticketId:string): Observable<Ticket> {
    var params = new HttpParams()
      .set('ticketId', ticketId)
      return this.http.get<Ticket[]>(this.url, {params});
  }
  get<Reply>(id: string): Observable<Reply> {
    let myurl = this.url + id;
    return this.http.get<Reply>(myurl);
  }
  put<Reply>(item: any): Observable<Reply> {
    let myurl = this.url + item.id;
    return this.http.put<Reply>(myurl, item);
  }
  post<Reply>(item: Reply): Observable<Reply> {
    return this.http.post<Reply>(this.url, item);
  }
  constructor(http: HttpClient) {
      this.url = `${environment.apiUrl}/replies/`;
     }

}
