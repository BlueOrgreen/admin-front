import { App as AntdApp } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

import Router from '@/router/index';
import AntdConfig from '@/theme/antd';

import { MotionLazy } from './components/animate/motion-lazy';

import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';
import { useEffect } from 'react';
import config from '@/config/config';

// eslint-disable-next-line import/no-mutable-exports
let message: MessageInstance;
// eslint-disable-next-line import/no-mutable-exports
let notification: NotificationInstance;
// eslint-disable-next-line import/no-mutable-exports
let modal: Omit<ModalStaticFunctions, 'warn'>;

dayjs.locale('zh-cn');

const App: FC = () => {
    useEffect(() => {
        console.table([
            {
                属性: '环境',
                值: `${config.env}${config.envNum ? '-' + config.envNum : ''}`,
            },
            { 属性: 'Home页面', 值: process.env.REACT_APP_HOMEPAGE },
            { 属性: 'App Api', 值: process.env.REACT_APP_API },
            { 属性: '发布人', 值: process.env.REACT_APP_GITLAB_USER_NAME },
            { 属性: '发布时间', 值: process.env.REACT_APP_BUILD_TIME },
            { 属性: '发布TAG', 值: process.env.REACT_APP_BUILD_TAG },
        ]);
    }, []);

    return (
        <AntdConfig>
            <AntdApp>
                <FeedbackWrapper>
                    <MotionLazy>
                        <Router />
                    </MotionLazy>
                </FeedbackWrapper>
            </AntdApp>
        </AntdConfig>
    );
};

export const FeedbackWrapper: FC<PropsWithChildren<any>> = ({ children }) => {
    const staticFunction = AntdApp.useApp();
    message = staticFunction.message;
    modal = staticFunction.modal;
    notification = staticFunction.notification;
    return children;
};

export { message, notification, modal };

export default App;
