import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private urlAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'files';
    this.urlAPI = 'http://localhost:3000/api' + this.controller;
  }

  public uploadFile(file: File) {
    let formParams = new FormData();
    formParams.append('file', file);
    return firstValueFrom(this.http.post(this.urlAPI, formParams));
  }
}
