import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCirclePlus,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { AgencyDTO } from '../../../../models/agency.dto';
import { AgencyService } from '../../../../services/agency.service';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-active-agency',
  templateUrl: './active-agency.component.html',
  styleUrls: ['./active-agency.component.scss'],
})
export class ActiveAgencyComponent {
  faPen = faPen;
  faTrash = faTrash;
  faCirclePlus = faCirclePlus;

  agencies!: AgencyDTO[];
  creators: string[];
  updaters: string[];
  nonActiveAgencies!: AgencyDTO[];
  existAgencies: boolean;

  constructor(
    private agencyService: AgencyService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.creators = [];
    this.updaters = [];
    this.existAgencies = false;

    this.getAgencies();
  }

  private async getAgencies(): Promise<void> {
    let errorResponse: any;
    try {
      this.agencies = await this.agencyService.getAllAgencies();

      this.fillNonActiveAgencies();
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
    this.creators = this.nonActiveAgencies.map(function (agency) {
      return agency.createdBy.fullName;
    });
  }

  private fillUpdaters(): void {
    this.updaters = this.nonActiveAgencies.map(function (agency) {
      if (agency.updatedBy === null) {
        return '';
      }
      return agency.updatedBy.fullName;
    });
  }

  private fillNonActiveAgencies(): void {
    this.nonActiveAgencies = this.agencies.filter(
      (agency) => agency.isActive === false
    );

    if (this.nonActiveAgencies.length !== 0) {
      this.existAgencies = true;
      this.fillCreators();
      this.fillUpdaters();
    }
  }
}
