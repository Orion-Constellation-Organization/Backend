import { EnumOrderDirection } from 'enum/EnumOrderDirection';

export interface PaginationParams {
  page?: number;
  size?: number;
  order?: EnumOrderDirection;
  orderBy?: string;
}
