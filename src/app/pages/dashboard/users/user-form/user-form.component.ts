import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDTO } from '../../../../models/user.dto';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { SharedService } from '../../../../services/shared.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  private userId: string | null;
  private validRequest: boolean;
  loggedUserId: string | null;
  loggedUser: UserDTO;
  isCrossover: boolean;
  isAdmin: boolean;

  user: UserDTO;

  email: FormControl;
  password: FormControl;
  fullName: FormControl;
  isActive: FormControl;
  roles: FormControl;

  userForm: FormGroup;
  rolesList: string[] = ['user', 'superuser', 'crossuser', 'admin'];
  isValidForm: boolean | null;
  isUpdateMode: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder
  ) {
    this.isValidForm = null;
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.user = new UserDTO('', '');
    this.loggedUserId = this.localStorageService.get('user_id');
    this.loggedUser = new UserDTO('', '');
    this.isCrossover = false;
    this.isAdmin = false;
    this.isUpdateMode = false;
    this.validRequest = false;

    this.email = new FormControl(this.user.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new FormControl(this.user.password, [
      Validators.required,
      //Validators.pattern('/(?:(?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/'),
    ]);

    this.fullName = new FormControl(this.user.fullName, [Validators.required]);

    this.isActive = new FormControl(this.user.isActive);

    this.roles = new FormControl([]);

    this.userForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
      fullName: this.fullName,
      isActive: this.isActive,
      roles: this.roles,
    });

    this.checkRol();
  }

  async ngOnInit() {
    let errorResponse: any;

    if (this.userId) {
      this.isUpdateMode = true;
      try {
        this.user = await this.userService.getUserById(this.userId);

        this.password.clearValidators();

        this.email.setValue(this.user.email);
        this.password.setValue(this.user.password);
        this.fullName.setValue(this.user.fullName);
        this.isActive.setValue(this.user.isActive);
        this.roles.setValue(this.user.roles);

        this.userForm = this.formBuilder.group({
          email: this.email,
          password: this.password,
          fullName: this.fullName,
          isActive: this.isActive,
          roles: this.roles,
        });
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  private async updateUser(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;

    if (this.userId) {
      try {
        await this.userService.updateUserById(this.userId, this.user);
        responseOK = true;
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }

    await this.sharedService.managementToast(
      'userFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      if (!(this.isAdmin || this.isCrossover)) {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.router.navigateByUrl('/dashboard/management');
      }
    }

    return responseOK;
  }

  private async createUser(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;

    try {
      await this.userService.createUser(this.user);
      responseOK = true;
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }

    await this.sharedService.managementToast(
      'userFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      this.router.navigateByUrl('/dashboard/management');
    }

    return responseOK;
  }

  async saveUser(): Promise<void> {
    this.isValidForm = false;

    if (this.userForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.user = this.userForm.value;

    if (this.user.isActive === null) {
      this.user.isActive = false;
    }
    if (this.user.roles?.length === 0) {
      this.user.roles = ['user'];
    }

    if (this.isUpdateMode) {
      this.validRequest = await this.updateUser();
    } else {
      this.validRequest = await this.createUser();
    }
  }

  private async checkRol(): Promise<void> {
    if (this.loggedUserId) {
      this.loggedUser = await this.userService.getUserById(this.loggedUserId);
      if (this.loggedUser.roles?.includes('admin')) {
        this.isAdmin = true;
      }
      if (this.loggedUser.roles?.includes('crossuser')) {
        this.isCrossover = true;
      }
    }

    if (!(this.isAdmin || this.isCrossover)) {
      this.checkAuth();
    }

    if (!this.isAdmin) {
      this.rolesList = ['user', 'superuser', 'crossuser'];
    }
  }

  private checkAuth(): void {
    if (!this.isUpdateMode) {
      this.router.navigateByUrl('/dashboard/user/' + this.loggedUserId);
    }
  }
}
