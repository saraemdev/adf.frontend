import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleLeft, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { AgencyDTO } from '../../../models/agency.dto';
import { ProcedureDTO } from '../../../models/procedure.dto';
import { AgencyService } from '../../../services/agency.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.component.html',
  styleUrls: ['./procedures.component.scss'],
})
export class ProceduresComponent {
  faCirclePlus = faCirclePlus;
  faCircleLeft = faCircleLeft;

  proceduresList!: ProcedureDTO[];
  procedures!: ProcedureDTO[];
  agency: AgencyDTO;
  agencyId: string = '';
  existProcedures: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private agencyService: AgencyService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.agency = new AgencyDTO('', '');
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.agencyId = id;
      this.getAgency(this.agencyId);
      this.getProcedures(this.agencyId);
    }
  }

  private async getAgency(agencyId: string) {
    let errorResponse: any;

    try {
      this.agency = await this.agencyService.getAgencyById(agencyId);
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
      this.router.navigateByUrl('error404');
    }
  }

  private async getProcedures(agencyId: string) {
    let errorResponse: any;

    try {
      this.proceduresList = await this.agencyService.getAllProceduresByAgencyId(
        agencyId
      );
      this.procedures = this.proceduresList.filter(
        (procedure) => procedure.isActive === true
      );
      if (this.procedures.length !== 0) {
        this.existProcedures = true;
      }
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
      this.router.navigateByUrl('error404');
    }
  }
}
