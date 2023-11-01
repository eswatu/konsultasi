import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {
  uploadurl;
  constructor(private http: HttpClient,
    ) {
    this.uploadurl = `${environment.apiUrl}/uploadfiles`;
   }
uploadFiles(files: FileList, id: string): Observable<HttpEvent<any>> {
  const endpoint = `${this.uploadurl}/${id}`;
  const formData: FormData = new FormData();
  // console.log(files);
  Array.from(files).forEach(file => {
    formData.append('files', file, file.name);
  });

  const req = new HttpRequest('POST', endpoint, formData, {
    reportProgress: true,
    responseType: 'text'
  });

  return this.http.request(req);
}
downloadFile(ticketid: string, messageid: string): Observable<any> {
  const url = this.uploadurl;
  var params = new HttpParams()
              .set('ticketid', ticketid)
              .set('messageid', messageid);
  return this.http.get(url, {params, responseType: 'blob'});
  }
}
