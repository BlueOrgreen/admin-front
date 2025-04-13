import apiClient from '../apiClient';

import { UserInfo, UserToken } from '#/entity';

export interface SignInReq {
    credential: string;
    password: string;
}

export interface SignUpReq extends SignInReq {
    email: string;
}
export type SignInRes = UserToken & { user: UserInfo };

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: '/api/account/login', data });
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: '/auth/signup', data });
const logout = () => apiClient.get({ url: '/auth/logout' });
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `/user/${id}` });

export default {
    signin,
    signup,
    findById,
    logout,
};
