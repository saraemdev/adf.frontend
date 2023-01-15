import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCirclePlus,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { ProcedureDTO } from '../../../../models/procedure.dto';
import { UserDTO } from '../../../../models/user.dto';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { ProcedureService } from '../../../../services/procedure.service';
import { SharedService } from '../../../../services/shared.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-my-procedure',
  templateUrl: './my-procedure.component.html',
  styleUrls: ['./my-procedure.component.scss'],
})
export class MyProcedureComponent {
  faPen = faPen;
  faTrash = faTrash;
  faCirclePlus = faCirclePlus;

  procedures!: ProcedureDTO[];
  creators: string[];
  updaters: string[];
  userId: string | null;
  user: UserDTO;
  onlyUser: boolean;
  myProcedures!: ProcedureDTO[];
  owner: boolean;

  constructor(
    private procedureService: ProcedureService,
    private userService: UserService,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {
    this.userId = this.localStorageService.get('user_id');
    this.creators = [];
    this.updaters = [];
    this.user = new UserDTO('', '');
    this.onlyUser = true;
    this.owner = false;

    this.getProcedures();
    this.checkRol();
  }

  private async getProcedures(): Promise<void> {
    let errorResponse: any;

    try {
      this.procedures = await this.procedureService.getAllProcedures();

      this.fillMyProcedures();
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
    this.creators = this.myProcedures.map(function (procedure) {
      return procedure.createdBy.fullName;
    });
  }

  private fillUpdaters(): void {
    this.updaters = this.myProcedures.map(function (procedure) {
      if (procedure.updatedBy === null) {
        return '';
      }
      return procedure.updatedBy.fullName;
    });
  }

  private fillMyProcedures(): void {
    if (this.userId) {
      this.myProcedures = this.procedures.filter(
        (procedure) => procedure.createdBy.id === this.userId
      );
    }
    if (this.myProcedures.length !== 0) {
      this.owner = true;
      this.fillCreators();
      this.fillUpdaters();
    }
  }
  private async checkRol(): Promise<void> {
    if (this.userId) {
      this.user = await this.userService.getUserById(this.userId);
      if (this.user.roles?.length === 1) {
        this.onlyUser = this.user.roles.includes('user');
      } else {
        this.onlyUser = false;
      }
    }
  }
}
