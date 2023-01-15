import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProcedureDTO } from '../models/procedure.dto';

@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  private urlAPI: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'procedures';
    this.urlAPI = 'http://localhost:3000/api' + this.controller;
  }

  getAllProcedures() {
    return firstValueFrom(this.http.get<ProcedureDTO[]>(this.urlAPI));
  }

  getProcedureById(procedureId: string) {
    return firstValueFrom(
      this.http.get<ProcedureDTO>(this.urlAPI + '/' + procedureId)
    );
  }

  createProcedure(procedure: ProcedureDTO) {
    return firstValueFrom(this.http.post<ProcedureDTO>(this.urlAPI, procedure));
  }

  updateProcedureById(procedureId: string, procedure: ProcedureDTO) {
    return firstValueFrom(
      this.http.patch<ProcedureDTO>(this.urlAPI + '/' + procedureId, procedure)
    );
  }

  deleteProcedureById(procedureId: string) {
    return firstValueFrom(this.http.delete(this.urlAPI + '/' + procedureId));
  }
}
