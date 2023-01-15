import { Component } from '@angular/core';
import { faCirclePlus, faHome } from '@fortawesome/free-solid-svg-icons';
import { UserDTO } from '../../models/user.dto';
import { LocalStorageService } from '../../services/local-storage.service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  faCirclePlus = faCirclePlus;
  faHome = faHome;

  userId: string | null;
  user: UserDTO;
  onlyUser: boolean;
  onlySuperuser: boolean;

  constructor(
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {
    this.userId = this.localStorageService.get('user_id');
    this.user = new UserDTO('', '');
    this.onlyUser = true;
    this.onlySuperuser = false;

    this.checkRol();
  }

  private async checkRol() {
    if (this.userId) {
      this.user = await this.userService.getUserById(this.userId);
      if (this.user.roles?.length === 1) {
        this.onlyUser = this.user.roles.includes('user');
        this.onlySuperuser = this.user.roles.includes('superuser');
      } else {
        this.onlyUser = false;
      }
    }
  }
}
