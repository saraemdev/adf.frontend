import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCirclePlus,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { ProcedureDTO } from '../../../../models/procedure.dto';
import { ProcedureService } from '../../../../services/procedure.service';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-active-procedure',
  templateUrl: './active-procedure.component.html',
  styleUrls: ['./active-procedure.component.scss'],
})
export class ActiveProcedureComponent {
  faPen = faPen;
  faTrash = faTrash;
  faCirclePlus = faCirclePlus;

  procedures!: ProcedureDTO[];
  creators: string[];
  updaters: string[];
  nonActiveProcedures!: ProcedureDTO[];
  existProcedures: boolean;

  constructor(
    private procedureService: ProcedureService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.creators = [];
    this.updaters = [];
    this.existProcedures = false;

    this.getProcedures();
  }

  private async getProcedures(): Promise<void> {
    let errorResponse: any;

    try {
      this.procedures = await this.procedureService.getAllProcedures();

      this.fillNonActiveProcedures();
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
      this.router.navigateByUrl('error404');
    }
  }

  async deleteProcedure(
    procedureId: string,
    procedureTitle: string
  ): Promise<void> {
    let errorResponse: any;

    let result = confirm(
      '¿Seguro que quieres eliminar ' + procedureTitle + '?'
    );
    if (result) {
      try {
        await this.procedureService.deleteProcedureById(procedureId);
        this.getProcedures();
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  private fillCreators(): void {
    this.creators = this.nonActiveProcedures.map(function (procedure) {
      return procedure.createdBy.fullName;
    });
  }

  private fillUpdaters(): void {
    this.updaters = this.nonActiveProcedures.map(function (procedure) {
      if (procedure.updatedBy === null) {
        return '';
      }
      return procedure.updatedBy.fullName;
    });
  }

  private fillNonActiveProcedures(): void {
    this.nonActiveProcedures = this.procedures.filter(
      (procedure) => procedure.isActive === false
    );

    if (this.nonActiveProcedures.length !== 0) {
      this.existProcedures = true;
      this.fillCreators();
      this.fillUpdaters();
    }
  }
}
