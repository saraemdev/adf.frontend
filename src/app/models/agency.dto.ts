import { UserDTO } from './user.dto';

export class AgencyDTO {
  id!: string;
  title: string;
  img: string;
  isActive!: boolean;
  createdDate!: Date;
  updatedDate!: Date | null;
  createdBy!: UserDTO;
  updatedBy!: UserDTO;

  constructor(title: string, img: string) {
    this.title = title;
    this.img = img;
  }
}
