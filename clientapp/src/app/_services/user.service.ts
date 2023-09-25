import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
    private url: string;

    constructor(http: HttpClient,
        @Inject('BASE_URL') baseUrl: string) {
            super(http, baseUrl);
            this.url = `${environment.apiUrl}/users`;
        }

    private constructUrl(id: string): string {
        return `${this.url}/${id}`;
    }

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
        const myurl = this.constructUrl(id);
        return this.http.get<User>(myurl);
    }

put<T>(item: any): Observable<HttpResponse<T>> {
    const myurl = this.constructUrl(item.id);
    return this.http.put<T>(myurl, item, {observe: 'response'});
}

    post<User>(item: User): Observable<any> {
        return this.http.post<User>(this.url, item);
    }
    pwput<T>(item: any): Observable<HttpResponse<T>> {
        const myurl = this.constructUrl(item.id + '/password');
        return this.http.put<T>(myurl, item, {observe: 'response'});
    }
}