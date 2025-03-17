import { ConfigProvider, App as AntdApp } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

import { MotionLazy } from './components/animate/motion-lazy';

import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';

// eslint-disable-next-line import/no-mutable-exports
let message: MessageInstance;
// eslint-disable-next-line import/no-mutable-exports
let notification: NotificationInstance;
// eslint-disable-next-line import/no-mutable-exports
let modal: Omit<ModalStaticFunctions, 'warn'>;

dayjs.locale('zh-cn');

const App: FC = () => {
    return (
        <ConfigProvider>
            <AntdApp>
                <FeedbackWrapper>
                    <MotionLazy>app</MotionLazy>
                </FeedbackWrapper>
            </AntdApp>
        </ConfigProvider>
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
