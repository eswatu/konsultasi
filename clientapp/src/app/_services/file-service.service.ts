import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpClient) { }

  uploadFiles(files: File[]): Observable<any> {
    const formData: FormData = new FormData();

    for (const file of files) {
      formData.append('files', file, file.name);
    }

    const uploadRequest = new HttpRequest('POST', 'your-upload-url', formData, {
      reportProgress: true,
    });

    return this.http.request(uploadRequest);
  }

  downloadFile(fileUrl: string): Observable<Blob> {
    return this.http.get(fileUrl, {
      responseType: 'blob'
    });
  }
}
