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
  selector: 'app-my-agency',
  templateUrl: './my-agency.component.html',
  styleUrls: ['./my-agency.component.scss'],
})
export class MyAgencyComponent {
  faPen = faPen;
  faTrash = faTrash;
  faCirclePlus = faCirclePlus;

  agencies!: AgencyDTO[];
  creators: string[] = [];
  updaters: string[] = [];

  userId: string | null;
  user: UserDTO;
  onlySuperuser: boolean;

  myAgencies!: AgencyDTO[];
  owner: boolean;

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
    this.owner = false;

    this.getAgencies();
    this.checkRol();
  }

  private async getAgencies(): Promise<void> {
    let errorResponse: any;
    try {
      this.agencies = await this.agencyService.getAllAgencies();

      this.fillMyAgencies();
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
    this.creators = this.myAgencies.map(function (agency) {
      return agency.createdBy.fullName;
    });
  }

  private fillUpdaters(): void {
    this.updaters = this.myAgencies.map(function (agency) {
      if (agency.updatedBy === null) {
        return '';
      }
      return agency.updatedBy.fullName;
    });
  }

  private fillMyAgencies(): void {
    if (this.userId) {
      this.myAgencies = this.agencies.filter(
        (agency) => agency.createdBy.id === this.userId
      );
    }
    if (this.myAgencies.length !== 0) {
      this.owner = true;
      this.fillCreators();
      this.fillUpdaters();
    }
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
