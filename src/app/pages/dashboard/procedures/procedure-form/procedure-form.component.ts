import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgencyDTO } from '../../../../models/agency.dto';
import { ProcedureDTO } from '../../../../models/procedure.dto';
import { UserDTO } from '../../../../models/user.dto';
import { AgencyService } from '../../../../services/agency.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { ProcedureService } from '../../../../services/procedure.service';
import { SharedService } from '../../../../services/shared.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-procedure-form',
  templateUrl: './procedure-form.component.html',
  styleUrls: ['./procedure-form.component.scss'],
})
export class ProcedureFormComponent implements OnInit {
  private procedureId: string | null;
  private validRequest: boolean;
  userId: string | null;
  user: UserDTO;
  onlyUser: boolean;

  procedure: ProcedureDTO;

  title: FormControl;
  description: FormControl;
  details: FormControl;
  phone: FormControl;
  url: FormControl;
  isActive: FormControl;
  agencyId: FormControl;

  procedureForm: FormGroup;
  agenciesList!: AgencyDTO[];
  isValidForm: boolean | null;
  isUpdateMode: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private procedureService: ProcedureService,
    private agencyService: AgencyService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {
    this.isValidForm = null;
    this.procedureId = this.activatedRoute.snapshot.paramMap.get('id');
    this.procedure = new ProcedureDTO('', '', '', '');
    this.userId = this.localStorageService.get('user_id');
    this.user = new UserDTO('', '');
    this.onlyUser = true;
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new FormControl(this.procedure.title, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(55),
    ]);
    this.description = new FormControl(this.procedure.description, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(255),
    ]);
    this.details = new FormControl(this.procedure.details);
    this.phone = new FormControl(this.procedure.phone);
    this.url = new FormControl(this.procedure.url, [
      Validators.required,
      Validators.minLength(5),
    ]);
    this.isActive = new FormControl(this.procedure.isActive);
    this.agencyId = new FormControl(this.procedure.agencyId, [
      Validators.required,
    ]);

    this.procedureForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      details: this.details,
      phone: this.phone,
      url: this.url,
      isActive: this.isActive,
      agencyId: this.agencyId,
    });

    this.loadAgencies();
    this.checkRol();
  }

  async ngOnInit(): Promise<void> {
    let errorResponse: any;

    if (this.procedureId) {
      this.isUpdateMode = true;
      try {
        this.procedure = await this.procedureService.getProcedureById(
          this.procedureId
        );

        this.title.setValue(this.procedure.title);
        this.description.setValue(this.procedure.description);
        this.details.setValue(this.procedure.details);
        this.phone.setValue(this.procedure.phone);
        this.url.setValue(this.procedure.url);
        this.isActive.setValue(this.procedure.isActive);
        this.agencyId.setValue(this.procedure.agency.id);

        this.procedureForm = this.formBuilder.group({
          title: this.title,
          description: this.description,
          details: this.details,
          phone: this.phone,
          url: this.url,
          isActive: this.isActive,
          agencyId: this.agencyId,
        });
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  private async loadAgencies(): Promise<void> {
    let errorResponse: any;
    try {
      this.agenciesList = await this.agencyService.getAllAgencies();
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }

  private async updateProcedure(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;

    if (this.procedureId) {
      const userId = this.localStorageService.get('user_id');
      if (userId) {
        const user = await this.userService.getUserById(userId);
        try {
          await this.procedureService.updateProcedureById(
            this.procedureId,
            this.procedure
          );
          responseOK = true;
        } catch (error: any) {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      }
    }

    await this.sharedService.managementToast(
      'procedureFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      this.router.navigateByUrl('/dashboard/procedures');
    }

    return responseOK;
  }

  private async createProcedure(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;

    try {
      await this.procedureService.createProcedure(this.procedure);
      responseOK = true;
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }

    await this.sharedService.managementToast(
      'procedureFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      this.router.navigateByUrl('/dashboard/procedures');
    }

    return responseOK;
  }

  async saveProcedure(): Promise<void> {
    this.isValidForm = false;
    if (this.procedureForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.procedure = this.procedureForm.value;
    if (this.procedure.isActive === null) {
      this.procedure.isActive = false;
    }

    if (this.isUpdateMode) {
      this.validRequest = await this.updateProcedure();
    } else {
      this.validRequest = await this.createProcedure();
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
