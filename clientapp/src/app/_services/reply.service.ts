import { Inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReplyService extends BaseService {
  url;
  getData<ApiResult>(pageIndex: number, pageSize: number,
            sortColumn: string, sortOrder: 'asc' | 'desc',
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
  constructor(http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
      super(http, baseUrl);
      this.url = baseUrl + 'api/replies/';
     }

}
