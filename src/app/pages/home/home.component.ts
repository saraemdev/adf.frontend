import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AgencyDTO } from '../../models/agency.dto';
import { AgencyService } from '../../services/agency.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  agenciesList!: AgencyDTO[];
  agencies!: AgencyDTO[];

  constructor(
    private agencyService: AgencyService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.getAgencies();
  }

  private async getAgencies() {
    let errorResponse: any;

    try {
      this.agenciesList = await this.agencyService.getAllAgencies();
      this.agencies = this.agenciesList.filter(
        (agency) => agency.isActive === true
      );
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
      this.router.navigateByUrl('error404');
    }
  }
}
