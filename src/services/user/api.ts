import { useMutation, useQuery } from '@tanstack/react-query';

import { service } from '@/http/axios/request';
import { queryClient } from '@/http/tanstack/react-query';
import { UserInputType, UserListResponse } from './api.type';
import { globalSuccess } from '@/utils/antd-extract';

/**
 * 用户列表
 */
export const useUserList = (values?: UserInputType) => {
    return useQuery<UserListResponse>({
        queryKey: ['usersList', values], // 使用对象形式
        queryFn: () => service.get('/api/users/list', { params: values }),
    });
};

/**
 * 更新用户
 */
export const useUpdateUser = () => {
    return useMutation(async (params: UserInputType) => service.patch('/user', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            // queryClient.invalidateQueries({ queryKey: ['usersList'] }) 是 TanStack Query
            //  中的一个核心方法，用于 主动标记查询数据失效，从而触发重新请求最新数据
            // 1. 标记失效	将 usersList 查询的缓存状态设为 stale（过期）。
            // 2. 自动重请求	如果组件仍挂载并依赖此查询，TanStack Query 会自动重新调用 queryFn（你的请求函数）
            // 3. 更新 UI	新数据返回后，所有用到 usersList 的组件会自动更新。
            queryClient.invalidateQueries({ 
                queryKey: ['usersList'] 
            });
        },
    });
};

/**
 * 新建用户
 */
export const useCreateUser = () => {
    return useMutation(async (params: UserInputType) => service.post('/user', { ...params }), {
        onSuccess: () => {
            globalSuccess();
             queryClient.invalidateQueries({ 
                queryKey: ['usersList'] 
            });
        },
    });
};

/**
 * 删除多个用户
 */
export const useDeleteUser = () => {
    return useMutation(async (ids: string[]) => service.delete('/user', { data: { ids } }), {
        onSuccess: () => {
            globalSuccess();
             queryClient.invalidateQueries({ 
                queryKey: ['usersList'] 
            });
        },
    });
};
