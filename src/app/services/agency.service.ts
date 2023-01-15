import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AgencyDTO } from '../models/agency.dto';
import { ProcedureDTO } from '../models/procedure.dto';

@Injectable({
  providedIn: 'root',
})
export class AgencyService {
  private urlAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'agencies';
    this.urlAPI = 'http://localhost:3000/api' + this.controller;
  }

  getAllAgencies() {
    return firstValueFrom(this.http.get<AgencyDTO[]>(this.urlAPI));
  }

  getAgencyById(agencyId: string) {
    return firstValueFrom(
      this.http.get<AgencyDTO>(this.urlAPI + '/' + agencyId)
    );
  }

  getAllProceduresByAgencyId(agencyId: string) {
    return firstValueFrom(
      this.http.get<ProcedureDTO[]>(this.urlAPI + '/procedures/' + agencyId)
    );
  }

  createAgency(agency: AgencyDTO) {
    return firstValueFrom(this.http.post<AgencyDTO>(this.urlAPI, agency));
  }

  updateAgencyById(agencyId: string, agency: AgencyDTO) {
    return firstValueFrom(
      this.http.patch<AgencyDTO>(this.urlAPI + '/' + agencyId, agency)
    );
  }

  deleteAgencyById(agencyId: string) {
    return firstValueFrom(this.http.delete(this.urlAPI + '/' + agencyId));
  }
}
