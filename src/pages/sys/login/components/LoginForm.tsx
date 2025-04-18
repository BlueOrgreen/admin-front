import { Alert, Button, Checkbox, Col, Divider, Dropdown, Form, Input, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { DEFAULT_USER, TEST_USER } from '@/_mock/assets';
import { SignInReq } from '@/api/services/userService';
import { useState } from 'react';
import ProTag from '@/theme/antd/components/tag';

import { useSignIn } from '@/store/userStore';
import { useThemeToken } from '@/theme/hooks';
import { LoginStateEnum, useLoginStateContext } from '../providers/login-state-provider';

function LoginForm() {
    const { t } = useTranslation();
    const themeToken = useThemeToken();
    const [loading, setLoading] = useState(false);
    const { loginState, setLoginState } = useLoginStateContext();

    const signIn = useSignIn();

    const handleFinish = async ({ credential, password }: SignInReq) => {
        setLoading(true);
        try {
            await signIn({ credential, password });
        } finally {
            setLoading(false);
        }
    };

    if (loginState !== LoginStateEnum.LOGIN) return null;

    return (
        <>
            <div className="mb-4 text-2xl font-bold xl:text-3xl">
                {t('sys.login.signInFormTitle')}
            </div>
            <Form
                name="login"
                size="large"
                initialValues={{
                    remember: true,
                    credential: DEFAULT_USER.account,
                    password: DEFAULT_USER.password,
                }}
                onFinish={handleFinish}
            >
                <div className="mb-4 flex flex-col">
                    <Alert
                        type="info"
                        description={
                            <div className="flex flex-col">
                                <div className="flex">
                                    <ProTag className="flex-shrink-0">
                                        Admin {t('sys.login.account')}:
                                    </ProTag>
                                    <strong
                                        className="ml-1"
                                        style={{ color: themeToken.colorInfoTextHover }}
                                    >
                                        <span>{DEFAULT_USER.account}</span>
                                    </strong>
                                </div>

                                <div className="flex">
                                    <ProTag className="flex-shrink-0">
                                        Test {t('sys.login.account')}:
                                    </ProTag>
                                    <strong
                                        className="ml-1"
                                        style={{ color: themeToken.colorInfoTextHover }}
                                    >
                                        <span>{TEST_USER.account}</span>
                                    </strong>
                                </div>

                                <div>
                                    <ProTag className="flex-shrink-0">
                                        {t('sys.login.password')}:
                                    </ProTag>
                                    <strong
                                        className=" ml-1"
                                        style={{ color: themeToken.colorInfoTextHover }}
                                    >
                                        {DEFAULT_USER.password}
                                    </strong>
                                </div>
                            </div>
                        }
                        showIcon
                    />
                </div>
                <Form.Item
                    name="credential"
                    rules={[{ required: true, message: t('sys.login.accountPlaceholder') }]}
                >
                    <Input placeholder={t('sys.login.account')} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: t('sys.login.passwordPlaceholder') }]}
                >
                    <Input.Password type="password" placeholder={t('sys.login.password')} />
                </Form.Item>
                <Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>{t('sys.login.rememberMe')}</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col span={12} className="text-right">
                            <button className="!underline">{t('sys.login.forgetPassword')}</button>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
                        {t('sys.login.loginButton')}
                    </Button>
                </Form.Item>

                <Row align="middle" gutter={8}>
                    <Col span={9} flex="1">
                        <Button
                            className="w-full !text-sm"
                            onClick={() => setLoginState(LoginStateEnum.MOBILE)}
                        >
                            {t('sys.login.mobileSignInFormTitle')}
                        </Button>
                    </Col>
                    <Col span={9} flex="1">
                        <Button
                            className="w-full !text-sm"
                            onClick={() => setLoginState(LoginStateEnum.QR_CODE)}
                        >
                            {t('sys.login.qrSignInFormTitle')}
                        </Button>
                    </Col>
                    <Col span={6} flex="1" onClick={() => setLoginState(LoginStateEnum.REGISTER)}>
                        <Button className="w-full !text-sm">
                            {t('sys.login.signUpFormTitle')}
                        </Button>
                    </Col>
                </Row>

                <Divider className="!text-xs">{t('sys.login.otherSignIn')}</Divider>
            </Form>
        </>
    );
}

export default LoginForm;
