import { isNumber } from 'lodash';

type Env = 'local' | 'dev' | 'test' | 'pet' | 'stg' | 'prod';

type Config = {
    env: Env;
    envNum: number | undefined;
    host: string;
    baseURL: string;
    upmsURL: string;
    ssoRefreshTokenURL: string;
    ssoLoginURL: string;
};

const parseEnv = (
): {
    env: Env;
    envNum: number | undefined;
    reactAppApi?: string | undefined;
} => {
    const processEnv = process.env.REACT_APP_API_ENV as Env;
    const processEnvNum = process.env.REACT_APP_API_ENV_NUM;
    const processReactAppApi = process.env.REACT_APP_API
    // 如果有环境变量 processEnv，则说明是本地启动
    if (processEnv) {
        return {
            env: processEnv,
            envNum: processEnvNum ? Number(processEnvNum) : undefined,
            reactAppApi: processReactAppApi ? processReactAppApi : undefined,
        };
    }

    // 如果没有环境变量 processEnv，则说明处于线上环境，从host取环境变量
    const host = window.location.host;

    const envRegexMap: {
        reg: RegExp;
        env: Env;
    }[] = [
        { reg: /^chenchar-ccp\.lan\.heytea\.com$/, env: 'prod' },
        { reg: /^chenchar-ccp-(.+?)\.dev\.heytea\.com$/, env: 'dev' },
        { reg: /^chenchar-ccp-(.+?)\.test\.heytea\.com$/, env: 'test' },
        { reg: /^chenchar-ccp-(.+?)\.pet\.heytea\.com$/, env: 'pet' },
        { reg: /^chenchar-ccp-(.+?)\.stg\.heytea\.com$/, env: 'stg' },
    ];

    for (const envRegexItem of envRegexMap) {
        const { reg, env } = envRegexItem;
        if (reg.test(host)) {
            return {
                env,
                envNum: Number(host.match(reg)?.[1]),
            };
        }
    }

    throw new Error('环境变量错误');
};

const generateUrlConfig = () => {
    const {
        env,
        envNum,
        reactAppApi = 'dev',
    } = parseEnv();

    if (env === 'local') {
        return {
            env,
            envNum,
            host: `chenchar-ccp-${envNum}.dev.heytea.com`,
            baseURL: reactAppApi,
            upmsURL: `https://api-upms-${envNum}.dev.heytea.com`,
            ssoRefreshTokenURL: `https://dev-go-${envNum}-base-gateway.heyteago.com`,
            ssoLoginURL: `https://cas-go-${envNum}.dev.heytea.com`,
        };
    } else if ('dev' === env) {
        return {
            env,
            envNum,
            host: `chenchar-ccp-${envNum}.dev.heytea.com`,
            baseURL: `https://chenchar-ccp-${envNum}.dev.heytea.com`,
            upmsURL: `https://api-upms-${envNum}.dev.heytea.com`,
            ssoRefreshTokenURL: `https://dev-go-${envNum}-base-gateway.heyteago.com`,
            ssoLoginURL: `https://cas-go-${envNum}.dev.heytea.com`,
        };
    } else if ('test' === env) {
        if (envNum === 1 || envNum === 4 || envNum === 5) {
            return {
                env,
                envNum,
                host: `chenchar-ccp-${envNum}.test.heytea.com`,
                baseURL: `https://chenchar-ccp-${envNum}.test.heytea.com`,
                upmsURL: 'https://api-upms-1.test.heytea.com',
                ssoRefreshTokenURL: `https://test-go-${envNum}-api.heyteago.com`,
                ssoLoginURL: `https://test-go-${envNum}-cas.heyteago.com`,
            };
        } else {
            return {
                env,
                envNum,
                host: `chenchar-ccp-${envNum}.test.heytea.com`,
                baseURL: `https://chenchar-ccp-${envNum}.test.heytea.com`,
                upmsURL: `https://api-go-${envNum}.test.heytea.com`,
                ssoRefreshTokenURL: `https://api-go-${envNum}.test.heytea.com`,
                ssoLoginURL: `https://cas-go-${envNum}.test.heytea.com`,
            };
        }
    } else if ('pet' === env) {
        return {
            env,
            envNum,
            host: `chenchar-ccp-${envNum}.pet.heytea.com`,
            baseURL: `https://chenchar-ccp-${envNum}.test.heytea.com`,
            upmsURL: `https://api-go-${envNum}.pet.heytea.com`,
            ssoRefreshTokenURL: `https://api-go-${envNum}.pet.heytea.com`,
            ssoLoginURL: `https://cas-go-${envNum}.pet.heytea.com`,
        };
    } else if ('stg' === env) {
        return {
            env,
            envNum,
            host: `chenchar-ccp-${envNum}.stg.heytea.com`,
            baseURL: `https://chenchar-ccp-${envNum}.stg.heytea.com`,
            upmsURL: `https://api-upms-${envNum}.stg.heytea.com`,
            ssoRefreshTokenURL: `https://staging${
                isNumber(envNum) && envNum > 1 ? envNum : ''
            }.heytea.com`,
            ssoLoginURL: `https://staging${envNum}-cas.heyteago.com`,
        };
    } else if ('prod' === env) {
        return {
            env,
            envNum: undefined,
            host: `chenchar-ccp.lan.heytea.com`,
            baseURL: 'https://chenchar-ccp.lan.heytea.com',
            upmsURL: `https://api-upms.lan.heytea.com`,
            ssoRefreshTokenURL: 'https://go.heytea.com',
            ssoLoginURL: `https://account.heytea.com`,
        };
    } else {
        throw new Error('环境变量错误');
    }
};

const config: Config = generateUrlConfig();

export const { env, envNum, host, baseURL, upmsURL, ssoRefreshTokenURL, ssoLoginURL } = config;

export default config;
