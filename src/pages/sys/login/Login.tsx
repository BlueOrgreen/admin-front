import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Typography } from 'antd';
import Overlay2 from '@/assets/images/background/overlay_2.jpg';
import { useThemeToken } from '@/theme/hooks';
import Color from 'color';
import { LoginStateProvider } from './providers/login-state-provider';
import LoginForm from './login-form';
import QrCodeFrom from './QrCodeForm';
import MobileForm from './MobileForm';
import RegisterForm from './RegisterForm';
import ResetForm from './ResetForm';
import LocalePicker from '@/components/LocalePicker';

function Login() {
    const { t } = useTranslation();
    const { colorBgElevated } = useThemeToken();

    const gradientBg = Color(colorBgElevated).alpha(0.9).toString();

    const bg = `linear-gradient(${gradientBg}, ${gradientBg}) center center / cover no-repeat,url(${Overlay2})`;

    return (
        <Layout
            style={{
                background: bg,
            }}
            className="relative flex h-screen !w-full !flex-row "
        >
            <div
                style={{
                    background: bg,
                }}
                className="relative m-auto flex  w-full max-w-[480px] flex-col justify-center p-[16px] lg:p-[64px] "
            >
                <LoginStateProvider>
                    <LoginForm />
                    <MobileForm />
                    <QrCodeFrom />
                    <RegisterForm />
                    <ResetForm />
                </LoginStateProvider>

                <div className="absolute right-[20px] top-[20px] lg:right-[60px] lg:top-[60px]">
                    <LocalePicker />
                </div>
            </div>
        </Layout>
    );
}

export default Login;
