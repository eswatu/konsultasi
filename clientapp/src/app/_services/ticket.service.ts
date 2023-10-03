import { Inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class TicketService extends BaseService{
  url: string;
  getsData<ApiResult>(
    pageIndex: number, 
    pageSize: number,
    sortColumn: string, 
    sortOrder: 'asc' | 'desc' | '', 
    isSolved: boolean,
    filterSDate:string,
    filterEDate:string,
    filterColumn: string, 
    filterQuery?: string
  ): Observable<ApiResult> {
    // Create a new instance of HttpParams to store the query parameters
    var params = new HttpParams()
      // Set the pageIndex parameter with the provided value
      .set('pageIndex', pageIndex.toString())
      // Set the pageSize parameter with the provided value
      .set('pageSize', pageSize.toString())
      // Set the sortColumn parameter with the provided value
      .set('sortColumn', sortColumn)
      // Set the sortOrder parameter with the provided value
      .set('sortOrder', sortOrder)
      // Set the isSolved parameter with the provided value
      .set('isSolved', isSolved)
      .set('filterSDate', filterSDate)
      .set('filterEDate', filterEDate);
      
    // Check if filterQuery is provided
    if (filterQuery) {
      // Set the filterColumn parameter with the provided value
      params = params.set('filterColumn', filterColumn)
        // Set the filterQuery parameter with the provided value
        .set('filterQuery', filterQuery);
    }
    
    // Make a GET request to the specified URL with the params as query parameters
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
  post<Ticket>(item: Ticket): Observable<any> {
    return this.http.post<Ticket>(this.url, item);
  }
  close<Ticket>(item: any, usr: User): Observable<Ticket> {
    let myurl = this.url + 'close/' + item.id;
    return this.http.put<Ticket>(myurl, usr);
  }
  constructor(http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
      super(http, baseUrl);
      this.url = `${environment.apiUrl}/tickets/`;
     }

}
