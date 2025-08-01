import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileContents } from '../../../shared/data-access/models/file-contents.model';
import { dataUrl } from '../../../shared/enums/dataURIs';
@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  constructor(private http: HttpClient) {}

  getFileByName(blobFileName: string): Observable<FileContents> {
    return this.http.get<FileContents>('api/downloadFileByName', {
      params: {
        blobFileName,
      },
    });
  }

  downloadFile(url: string): void {
    this
      .getFileByName(url)
      .subscribe((data) => {
        const a = document.createElement('a');
        a.href = `${dataUrl[data.fileExtention as keyof typeof dataUrl]}${data.base64}`;
        a.download = `${data.fileName}.${data.fileExtention}`;
        a.click();
      });
  }
}
