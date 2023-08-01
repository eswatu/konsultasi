import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TicketService extends BaseService{
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
  override get<T>(id: string): Observable<T> {
    throw new Error('Method not implemented.');
  }
  override put<T>(item: T): Observable<T> {
    throw new Error('Method not implemented.');
  }
  override post<T>(item: T): Observable<T> {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
