import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCirclePlus,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { UserDTO } from '../../../../models/user.dto';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { SharedService } from '../../../../services/shared.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-active-user',
  templateUrl: './active-user.component.html',
  styleUrls: ['./active-user.component.scss'],
})
export class ActiveUserComponent {
  faPen = faPen;
  faTrash = faTrash;
  faCirclePlus = faCirclePlus;

  users!: UserDTO[];
  nonActiveUsers!: UserDTO[];
  existUsers: boolean;

  userId: string | null;
  user: UserDTO;
  isAdmin: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    this.existUsers = false;

    this.userId = this.localStorageService.get('user_id');
    this.user = new UserDTO('', '');
    this.isAdmin = false;

    this.getAllUsers();
    this.checkRol();
  }

  private async getAllUsers(): Promise<void> {
    let errorResponse: any;
    try {
      this.users = await this.userService.getAllUsers();

      this.fillNonActiveUsers();
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
      this.router.navigateByUrl('error404');
    }
  }

  async deleteUser(userId: string, userName: string): Promise<void> {
    const registerUserId = this.localStorageService.get('user_id');
    let errorResponse: any;

    let result = confirm('¿Seguro que quieres eliminar a ' + userName + '?');
    if (result) {
      try {
        await this.userService.deleteUserById(userId);
        if (userId === registerUserId) {
          this.localStorageService.remove('user_id');
          this.localStorageService.remove('access_token');
        }
        this.getAllUsers();
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  private fillNonActiveUsers(): void {
    this.nonActiveUsers = this.users.filter((user) => user.isActive === false);

    if (this.nonActiveUsers.length !== 0) {
      this.existUsers = true;
    }
  }

  private async checkRol(): Promise<void> {
    if (this.userId) {
      this.user = await this.userService.getUserById(this.userId);
      if (this.user.roles) {
        this.isAdmin = this.user.roles.includes('admin');
      }
    }
  }
}
