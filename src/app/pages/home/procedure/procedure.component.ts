import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faCircleLeft,
  faCirclePlus,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';
import { AgencyDTO } from '../../../models/agency.dto';
import { ProcedureDTO } from '../../../models/procedure.dto';
import { ProcedureService } from '../../../services/procedure.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.scss'],
})
export class ProcedureComponent {
  faCirclePlus = faCirclePlus;
  faCircleLeft = faCircleLeft;
  faHouse = faHouse;

  procedureId: string = '';
  procedure!: ProcedureDTO;
  agency!: AgencyDTO;

  constructor(
    private activatedRoute: ActivatedRoute,
    private procedureService: ProcedureService,
    private router: Router,
    private sharedService: SharedService
  ) {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.agency = new AgencyDTO('', '');
    this.procedure = new ProcedureDTO('', '', '', '');

    if (id) {
      this.procedureId = id;
      this.getProcedure(this.procedureId);
    }
  }

  private async getProcedure(id: string) {
    let errorResponse: any;

    try {
      this.procedure = await this.procedureService.getProcedureById(id);
      this.agency = this.procedure.agency;
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
      this.router.navigateByUrl('error404');
    }
  }
}
