import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UserDTO } from '../models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'auth';
    this.urlAPI = 'http://localhost:3000/api' + this.controller;
  }

  getAllUsers() {
    return firstValueFrom(this.http.get<UserDTO[]>(this.urlAPI));
  }

  getUserById(userId: string): Promise<UserDTO> {
    return firstValueFrom(this.http.get<UserDTO>(this.urlAPI + '/' + userId));
  }

  createUser(user: UserDTO) {
    return firstValueFrom(
      this.http.post<UserDTO>(this.urlAPI + '/register', user)
    );
  }

  updateUserById(userId: string, user: UserDTO) {
    return firstValueFrom(
      this.http.patch<UserDTO>(this.urlAPI + '/' + userId, user)
    );
  }

  deleteUserById(userId: string) {
    return firstValueFrom(this.http.delete(this.urlAPI + '/' + userId));
  }
}
