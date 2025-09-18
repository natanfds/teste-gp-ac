export class GroupResponseDto {
  id!: string;
  type!: 'GROUP';
  name!: string;
  parentId?: string | null;
}
