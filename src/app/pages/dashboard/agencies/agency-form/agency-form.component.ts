import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgencyDTO } from '../../../../models/agency.dto';
import { UserDTO } from '../../../../models/user.dto';
import { AgencyService } from '../../../../services/agency.service';
import { FileService } from '../../../../services/file.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { SharedService } from '../../../../services/shared.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-agency-form',
  templateUrl: './agency-form.component.html',
  styleUrls: ['./agency-form.component.scss'],
})
export class AgencyFormComponent implements OnInit {
  private agencyId: string | null;
  private validRequest: boolean;
  userId: string | null;
  user: UserDTO;
  onlySuperuser: boolean;

  agency: AgencyDTO;
  file: File | null;
  fileUrl: string | null;

  title: FormControl;
  img: FormControl;
  isActive: FormControl;

  agencyForm: FormGroup;
  isValidForm: boolean | null;
  isUpdateMode: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private agencyService: AgencyService,
    private fileService: FileService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {
    this.isValidForm = null;
    this.agencyId = this.activatedRoute.snapshot.paramMap.get('id');
    this.agency = new AgencyDTO('', '');
    this.userId = this.localStorageService.get('user_id');
    this.user = new UserDTO('', '');
    this.onlySuperuser = true;
    this.isUpdateMode = false;
    this.validRequest = false;
    this.file = null;
    this.fileUrl = null;

    this.title = new FormControl(this.agency.title, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(55),
    ]);
    this.img = new FormControl(this.agency.img, Validators.required);
    this.isActive = new FormControl(this.agency.isActive);

    this.agencyForm = this.formBuilder.group({
      title: this.title,
      img: this.img,
      isActive: this.isActive,
    });

    this.checkRol();
  }

  async ngOnInit(): Promise<void> {
    let errorResponse: any;

    if (this.agencyId) {
      this.isUpdateMode = true;
      try {
        this.agency = await this.agencyService.getAgencyById(this.agencyId);

        this.title.setValue(this.agency.title);
        //this.img.setValue(this.agency.img);
        this.fileUrl = this.agency.img;
        this.isActive.setValue(this.agency.isActive);

        this.agencyForm = this.formBuilder.group({
          title: this.title,
          //img: this.img,
          isActive: this.isActive,
        });
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  private async updateAgency(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;

    if (this.agencyId) {
      try {
        await this.agencyService.updateAgencyById(this.agencyId, this.agency);
        responseOK = true;
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }

    await this.sharedService.managementToast(
      'agencyFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      this.router.navigateByUrl('/dashboard/agencies');
    }

    return responseOK;
  }

  private async createAgency(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;

    try {
      await this.agencyService.createAgency(this.agency);
      responseOK = true;
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }

    await this.sharedService.managementToast(
      'agencyFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      this.router.navigateByUrl('/dashboard/agencies');
    }

    return responseOK;
  }

  uploadImg(event: any): void {
    this.file = event.target.files[0];
  }

  async saveAgency(): Promise<void> {
    this.isValidForm = false;
    if (this.agencyForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.agency = this.agencyForm.value;
    if (this.file) {
      let result = await this.fileService.uploadFile(this.file);
      this.agency.img = Object.values(result)[0];
    } else if (this.fileUrl) {
      this.agency.img = this.fileUrl;
    }
    if (this.agency.isActive === null) {
      this.agency.isActive = false;
    }

    if (this.isUpdateMode) {
      this.validRequest = await this.updateAgency();
    } else {
      this.validRequest = await this.createAgency();
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
