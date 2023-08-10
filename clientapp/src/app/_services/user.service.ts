import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
    url: string;
    getData<ApiResult>(pageIndex: number, pageSize: number,
        sortColumn: string, sortOrder: 'asc' | 'desc',
        filterColumn: string, filterQuery: string): Observable<ApiResult> {
        var params = new HttpParams()
        // Set the pageIndex parameter with the provided value
        .set('pageIndex', pageIndex.toString())
        // Set the pageSize parameter with the provided value
        .set('pageSize', pageSize.toString())
        // Set the sortColumn parameter with the provided value
        .set('sortColumn', sortColumn)
        // Set the sortOrder parameter with the provided value
        .set('sortOrder', sortOrder);
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
    get<User>(id: string): Observable<User> {
        let myurl = this.url + id;
        return this.http.get<User>(myurl);
    }
    put<User>(item: any): Observable<User> {
        let myurl = this.url + item.id;
        return this.http.put<User>(myurl, item);
    }
    post<User>(item: User): Observable<User> {
        return this.http.post<User>(this.url, item);
    }
    constructor(http: HttpClient,
        @Inject('BASE_URL') baseUrl: string) {
            super(http, baseUrl);
            this.url = `${environment.apiUrl}/users`;
        }


}