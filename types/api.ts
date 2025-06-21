export interface Result<T = any> {
    status: number;
    message?: string;
    data?: T;
}

export interface BaseMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}