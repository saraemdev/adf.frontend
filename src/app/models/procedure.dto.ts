import { AgencyDTO } from './agency.dto';
import { UserDTO } from './user.dto';
export class ProcedureDTO {
  id!: string;
  title: string;
  slug!: string;
  description: string;
  details!: string;
  phone!: string;
  url: string;
  isActive!: boolean;
  createdDate!: Date;
  updatedDate!: Date | null;
  agency!: AgencyDTO;
  agencyId: string;
  createdBy!: UserDTO;
  updatedBy!: UserDTO;

  constructor(
    title: string,
    description: string,
    url: string,
    agencyId: string
  ) {
    this.title = title;
    this.description = description;
    this.url = url;
    this.agencyId = agencyId;
  }
}
