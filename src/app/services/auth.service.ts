import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthToken } from '../interfaces/auth-token.interface';
import { AuthDTO } from '../models/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'auth';
    this.urlAPI = 'http://localhost:3000/api' + this.controller;
  }

  login(auth: AuthDTO) {
    return firstValueFrom(this.http.post<AuthToken>(this.urlAPI, auth));
  }
}
