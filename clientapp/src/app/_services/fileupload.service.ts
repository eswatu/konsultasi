import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {
  url;
  constructor(private http: HttpClient,
    ) {
    this.url = `${environment.apiUrl}/uploadfiles`;
   }
uploadFiles(files: FileList, id: string): Observable<number> {
  const endpoint = `${this.url}/${id}`;
  const formData: FormData = new FormData();

  Array.from(files).forEach(file => {
    formData.append('files', file, file.name);
  });

  const req = new HttpRequest('POST', endpoint, formData, {
    reportProgress: true,
  });

  return this.http.request(req).pipe(
    map(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        return progress;
      } else if (event instanceof HttpResponse) {
        return 100;
      }

      // Add this return statement to handle other event types
      return 0; // You can return 0 or any appropriate value here
    })
  );
}
}
