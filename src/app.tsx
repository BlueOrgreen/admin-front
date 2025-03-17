import { ConfigProvider, App as AntdApp } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { HelmetProvider } from 'react-helmet-async';

// import type { MessageInstance } from 'antd/es/message/interface';
// import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
// import type { NotificationInstance } from 'antd/es/notification/interface';

// let message: MessageInstance;
// let notification: NotificationInstance;
// let modal: Omit<ModalStaticFunctions, 'warn'>;

dayjs.locale('zh-cn');

const App: FC = () => {
    return (
        <HelmetProvider>
            <ConfigProvider>
                <AntdApp>
                    <FeedbackWrapper>app</FeedbackWrapper>
                </AntdApp>
            </ConfigProvider>
        </HelmetProvider>
    );
};

export const FeedbackWrapper: FC<PropsWithChildren<any>> = ({ children }) => {
    const staticFunction = AntdApp.useApp();
    // message = staticFunction.message;
    // modal = staticFunction.modal;
    // notification = staticFunction.notification;
    return children;
};

// export { message, notification, modal };

export default App;
