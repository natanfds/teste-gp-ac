export class OrganizationDto {
  id: string;
  name: string;
  depth: number;
}

export type ListOfOrganizationsDto = OrganizationDto[];
