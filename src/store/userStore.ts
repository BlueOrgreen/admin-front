import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';

import userService, { SignInReq } from '@/api/services/userService';
import { getItem, removeItem, setItem } from '@/utils/storage';

import { UserInfo, UserToken } from '#/entity';
import { StorageEnum } from '#/enum';
import { mock_permissions } from './mock';

// const { REACT_APP_HOMEPAGE: HOMEPAGE } = process.env;

type UserStore = {
    userInfo: Partial<UserInfo>;
    userToken: UserToken;
    // 使用 actions 命名空间来存放所有的 action
    actions: {
        setUserInfo: (userInfo: UserInfo) => void;
        setUserToken: (token: UserToken) => void;
        clearUserInfoAndToken: () => void;
    };
};

export const useUserStore = create<UserStore>((set) => ({
    userInfo: getItem<UserInfo>(StorageEnum.User) || {},
    userToken: getItem<UserToken>(StorageEnum.Token) || {},
    actions: {
        setUserInfo: (userInfo) => {
            set({ userInfo });
            setItem(StorageEnum.User, userInfo);
        },
        setUserToken: (userToken) => {
            set({ userToken });
            setItem(StorageEnum.Token, userToken);
        },
        clearUserInfoAndToken() {
            set({ userInfo: {}, userToken: {} });
            removeItem(StorageEnum.User);
            removeItem(StorageEnum.Token);
        },
    },
}));

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
    const { t } = useTranslation();
    const navigatge = useNavigate();
    const { notification, message } = App.useApp();
    const { setUserToken, setUserInfo } = useUserActions();

    // useMutation 是 React Query 中处理数据修改的强大工具，通过它你可以轻松管理复杂的异步状态，实现乐观更新，并保持客户端与服务器数据的同步。
    const signInMutation = useMutation(userService.signin);

    const signIn = async (data: SignInReq) => {
        try {
            const homePage = process.env.REACT_APP_HOMEPAGE;
            const res = await signInMutation.mutateAsync(data);
            const { user, token, accessToken, refreshToken } = res;
            // debugger;
            setUserToken({ accessToken: token, refreshToken });
            // @ts-ignore
            user.permissions = mock_permissions;
            setUserInfo(user);
            navigatge(homePage ?? '', { replace: true });

            notification.success({
                message: t('sys.login.loginSuccessTitle'),
                description: `${t('sys.login.loginSuccessDesc')}: ${data.credential}`,
                duration: 3,
            });
        } catch (err: any) {
            message.warning({
                content: err.message,
                duration: 3,
            });
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(signIn, []);
};
