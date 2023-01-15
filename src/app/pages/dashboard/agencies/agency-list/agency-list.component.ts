import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCirclePlus,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { AgencyDTO } from '../../../../models/agency.dto';
import { UserDTO } from '../../../../models/user.dto';
import { AgencyService } from '../../../../services/agency.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { SharedService } from '../../../../services/shared.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-agency-list',
  templateUrl: './agency-list.component.html',
  styleUrls: ['./agency-list.component.scss'],
})
export class AgencyListComponent {
  faPen = faPen;
  faTrash = faTrash;
  faCirclePlus = faCirclePlus;

  agencies!: AgencyDTO[];
  creators: string[] = [];
  updaters: string[] = [];

  userId: string | null;
  user: UserDTO;
  onlySuperuser: boolean;

  constructor(
    private agencyService: AgencyService,
    private userService: UserService,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {
    this.userId = this.localStorageService.get('user_id');
    this.user = new UserDTO('', '');
    this.onlySuperuser = true;

    this.getAgencies();
    this.checkRol();
  }

  private async getAgencies(): Promise<void> {
    let errorResponse: any;
    try {
      this.agencies = await this.agencyService.getAllAgencies();

      this.fillCreators();
      this.fillUpdaters();
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
      this.router.navigateByUrl('error404');
    }
  }

  async deleteAgency(agencyId: string, agencyTitle: string): Promise<void> {
    let errorResponse: any;

    let result = confirm('¿Seguro que quieres eliminar ' + agencyTitle + '?');
    if (result) {
      try {
        await this.agencyService.deleteAgencyById(agencyId);
        this.getAgencies();
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  private fillCreators(): void {
    this.creators = this.agencies.map(function (agency) {
      return agency.createdBy.fullName;
    });
  }

  private fillUpdaters(): void {
    this.updaters = this.agencies.map(function (agency) {
      if (agency.updatedBy === null) {
        return '';
      }
      return agency.updatedBy.fullName;
    });
  }

  private async checkRol(): Promise<void> {
    if (this.userId) {
      this.user = await this.userService.getUserById(this.userId);
      if (this.user.roles?.length === 1) {
        this.onlySuperuser = this.user.roles.includes('superuser');
      } else {
        this.onlySuperuser = false;
      }
    }
  }
}
