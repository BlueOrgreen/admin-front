import { BaseMeta } from "#/api";

export interface UserInputType {
    name?: string;
    orgId?: string;
    timeRange?: string;
    rangePicker?: string;
    state?: boolean;
    describe?: string;
    page?: number;
    limit?: number;
}

export interface UserListResponse {
  items: Array<{
    id: string;
    nickname: string | null;
    username: string;
    phone: string | null;
    email: string;
    actived: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }>;
  meta: BaseMeta;
}