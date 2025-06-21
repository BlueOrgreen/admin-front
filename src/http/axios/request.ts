import { message } from 'antd';
import axios, { AxiosError, AxiosResponse } from 'axios';

import { t } from '@/locales/i18n';

import { Result } from '#/api';
import { ResultEnum } from '#/enum';

// 创建 axios 实例
export const service = axios.create({
    baseURL: process.env.REACT_APP_API as string,
    timeout: 50000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 请求拦截
service.interceptors.request.use(
    (config) => {
        // 在请求被发送之前做些什么
        config.headers.Authorization = 'Bearer Token';
        return config;
    },
    (error) => {
        // 请求错误时做些什么
        return Promise.reject(error);
    },
);

// 响应拦截
service.interceptors.response.use(
    (res: AxiosResponse<Result>) => {
        if (!res.data) throw new Error(t('sys.api.apiRequestFailed'));

        const { status, data, message } = res.data;
        // 业务请求成功
        const hasSuccess = data && Reflect.has(res.data, 'status') && status === ResultEnum.SUCCESS;
        if (hasSuccess) {
            return data;
        }

        // 业务请求错误
        throw new Error(message || t('sys.api.apiRequestFailed'));
    },
    async (error: AxiosError<Result>) => {
        if (error.response)
            switch (error.response.status) {
                case 401: {
                    // 如果 auth/refresh 之外的 api 报 401 错误，就主动去发起刷新 token 的请求
                    if (
                        error.response.config.url &&
                        !error.response.config.url.includes('auth/refresh')
                    ) {
                        const res = await refreshTokenApi();
                        if (res.status === 200) {
                            return axios(error.response.config);
                        }
                        message.error('登录过期，请重新登录');
                        return Promise.reject(res);
                    }
                    // 如果 auth/refresh 也 401 了，就清空用户信息和 token，跳转至登录页面
                    // const { clearUserInfoAndToken } = useUserStore.getState().actions;
                    // clearUserInfoAndToken();

                    break;
                }
                default:
                    message.error(error.response?.data.message ?? error.message);
                    break;
            }
        return Promise.reject(error);
    },
);

// 刷新 token 的 API
const refreshTokenApi = async () => {
    // 获取 refreshToken
    // const { refreshToken } = useUserStore.getState().userToken;
    // // 调用 API
    // const res = await service.get('auth/refresh', {
    //     params: {
    //         refreshToken,
    //     },
    // });
    // if (res) {
    //     // 更新 token 信息
    //     useUserStore.getState().actions.setUserToken({
    //         accessToken: res.data.accessToken,
    //         refreshToken: res.data.refreshToken,
    //     });
    // }
    return {
        status: 200,
        value: 'xintoken',
    };
};
