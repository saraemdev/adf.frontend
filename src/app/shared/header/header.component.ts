import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faDashboard,
  faHome,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { HeaderMenus } from '../../interfaces/header-menus.interface';
import { UserDTO } from '../../models/user.dto';
import { HeaderMenusService } from '../../services/header-menus.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  faHome = faHome;
  faDashboard = faDashboard;
  faRightFromBracket = faRightFromBracket;

  showAuthSection: boolean;
  showNoAuthSection: boolean;
  userName: string;
  user: UserDTO;

  constructor(
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService
  ) {
    this.showAuthSection = false;
    this.showNoAuthSection = true;
    this.user = new UserDTO('', '');
    this.userName = '';
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection;
          this.showNoAuthSection = headerInfo.showNoAuthSection;
        }
      }
    );
  }

  home(): void {
    this.router.navigateByUrl('home');
  }

  login(): void {
    this.router.navigateByUrl('login');
  }

  dashboard(): void {
    this.router.navigateByUrl('dashboard');
  }

  logout(): void {
    this.localStorageService.remove('user_id');
    this.localStorageService.remove('access_token');

    const headerInfo: HeaderMenus = {
      showAuthSection: false,
      showNoAuthSection: true,
    };

    this.headerMenusService.headerManagement.next(headerInfo);
    this.router.navigateByUrl('home');
  }
}
