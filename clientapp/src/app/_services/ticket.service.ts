import { Inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService extends BaseService{
  url: string;
  getsData<ApiResult>(pageIndex: number, pageSize: number,
            sortColumn: string, sortOrder: 'asc' | 'desc' | '', isSolved: boolean,
            filterColumn: string, filterQuery?: string): Observable<ApiResult> {
      var params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder)
      .set('isSolved', isSolved);
      if (filterQuery) {
        params = params.set('filterColumn', filterColumn)
                        .set('filterQuery', filterQuery);
      }
      return this.http.get<ApiResult>(this.url, {params});
  }
getData<ApiResult>(pageIndex: number, pageSize: number,
    sortColumn: string, sortOrder: 'asc' | 'desc' | '',
    filterColumn: string, filterQuery: string): Observable<ApiResult> {
var params = new HttpParams()
.set('pageIndex', pageIndex.toString())
.set('pageSize', pageSize.toString())
.set('sortColumn', sortColumn)
.set('sortOrder', sortOrder);
if (filterQuery) {
    params = params.set('filterColumn', filterColumn)
                .set('filterQuery', filterQuery);
}
return this.http.get<ApiResult>(this.url, {params});
}
  get<Ticket>(id: string): Observable<Ticket> {
    let myurl = this.url + id;
    return this.http.get<Ticket>(myurl);
  }
  put<Ticket>(item: any): Observable<Ticket> {
    let myurl = this.url + item.id;
    return this.http.put<Ticket>(myurl, item);
  }
  post<Ticket>(item: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.url, item);
  }

  constructor(http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
      super(http, baseUrl);
      this.url = `${environment.apiUrl}/tickets`;
     }

}
