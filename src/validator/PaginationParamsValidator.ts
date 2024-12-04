import { EnumOrderDirection } from '../enum/EnumOrderDirection';
import { PaginationParams } from '../interface/PaginationParams';

export function sanitizePaginationParams(query: PaginationParams): PaginationParams {
  const params: PaginationParams = {};

  if (query.page) {
    const parsedPage = Number(query.page);
    params.page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  }

  if (query.size) {
    const parsedSize = Number(query.size);
    params.size = isNaN(parsedSize) || parsedSize < 1 ? 10 : parsedSize;
  }

  if (query.order) {
    const upperOrder = (query.order as string).toUpperCase();
    params.order = Object.values(EnumOrderDirection).includes(upperOrder as EnumOrderDirection)
      ? (upperOrder as EnumOrderDirection)
      : EnumOrderDirection.ASC;
  }

  if (query.orderBy) {
    const allowedFields = ['classId', 'id', 'status', 'preferredDates', 'fullName'];
    params.orderBy = allowedFields.includes(query.orderBy) ? query.orderBy : 'id';
  }

  return params;
}
