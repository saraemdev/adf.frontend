import { Component } from '@angular/core';
import { faPen, faTrash, faUserPen } from '@fortawesome/free-solid-svg-icons';
import { UserDTO } from '../../../models/user.dto';
import { LocalStorageService } from '../../../services/local-storage.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  faPen = faPen;
  faTrash = faTrash;
  faUserPen = faUserPen;

  userId: string | null;
  user: UserDTO;

  rolesList: string[] = ['user', 'superuser', 'crossuser', 'admin'];

  constructor(
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {
    this.userId = this.localStorageService.get('user_id');
    this.user = new UserDTO('', '');

    this.getUser();
  }

  private async getUser(): Promise<void> {
    if (this.userId) {
      this.user = await this.userService.getUserById(this.userId);
    }
  }
}
