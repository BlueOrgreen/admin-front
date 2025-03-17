import chalk from 'chalk';
import dayjs from 'dayjs';
import execa from 'execa';
import inquirer from 'inquirer';
import minimist from 'yargs-parser';

const { build } = minimist(process.argv.slice(2));


const charAt = `
        ${chalk.yellow('                   _ooOoo_')}
        ${chalk.yellow('                  o8888888o')}
        ${chalk.yellow('                  88" . "88')}
        ${chalk.yellow('                  (| -_- |)')}
        ${chalk.yellow('                  O\\  =  /O')}
        ${chalk.yellow("               ____/`---'\\____")}
        ${chalk.yellow("             .'  \\\\|     |//  `.")}
        ${chalk.yellow('            /  \\\\|||  :  |||//  \\')}
        ${chalk.yellow('           /  _||||| -:- |||||-  \\')}
        ${chalk.yellow('           |   | \\\\\\  -  /// |   |')}
        ${chalk.yellow("           | \\_|  ''\\---/''  |   |")}
        ${chalk.yellow('           \\  .-\\__  `-`  ___/-. /')}
        ${chalk.yellow("         ___`. .'  /--.--\\  `. . __")}
        ${chalk.yellow('      ."" \'<  `.___\\_<|>_/___.\'  >\'"".')}
        ${chalk.yellow('     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |')}
        ${chalk.yellow('     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /')}
        ${chalk.yellow("======`-.____`-.___\\_____/___.-`____.-'======")}
        ${chalk.yellow("                   `=---='")}
        ${chalk.yellow('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')}
        ${chalk.yellow('         佛祖保佑            永无BUG')},
   `

const env = {
    NODE_ENV: build ? 'production' : 'development',
    REACT_APP_API: '',
    REACT_APP_API_ENV: '',
    REACT_APP_API_ENV_NUM: '',
    REACT_APP_GITLAB_USER_NAME: '',
    REACT_APP_BUILD_TIME: '',
    REACT_APP_BUILD_TAG: '',
};

const getEnvFromCICD = (str: string) => process.env[str] || '';

// 检查是否安装了 Volta
const checkVoltaInstalled = async () => {
    try {
        await execa('volta', ['--version']);
    } catch {
        console.error(
            chalk.red('✘ 未检测到 Volta，为确保使用同一个版本 node，请先安装 Volta 后再运行脚本。'),
        );
        console.error(chalk.yellow('Volta 安装地址: https://volta.sh'));
        process.exit(1);
    }
};

const promptForEnvSelection = async (): Promise<{
    REACT_APP_API_ENV: string;
    REACT_APP_API_ENV_NUM: string;
}> => {
    const { REACT_APP_API_ENV } = await inquirer.prompt([
        {
            type: 'list',
            name: 'REACT_APP_API_ENV',
            message: '选择环境',
            choices: ['dev', 'test', 'pet', 'stg', 'prod'],
        },
    ]);

    if (REACT_APP_API_ENV === 'dev') {
        return {
            REACT_APP_API_ENV,
            REACT_APP_API_ENV_NUM: '1',
        };
    }
    const envObj: Record<string, number> = { test: 9, pet: 9, stg: 2 };
    const { REACT_APP_API_ENV_NUM } = await inquirer.prompt([
        {
            type: 'list',
            name: 'REACT_APP_API_ENV_NUM',
            message: `选择${REACT_APP_API_ENV}具体环境`,
            choices: Array.from(
                {
                    length: envObj[REACT_APP_API_ENV],
                },
                (_, i) => ({
                    name: `${REACT_APP_API_ENV} - ${i + 1}`,
                    value: `${i + 1}`,
                }),
            ),
            loop: false,
        },
    ]);

    return {
        REACT_APP_API_ENV,
        REACT_APP_API_ENV_NUM,
    };
};

const main = async (): Promise<void> => {
    const REACT_APP_GITLAB_USER_NAME = getEnvFromCICD('GITLAB_USER_NAME');
    const CI_COMMIT_REF_NAME = getEnvFromCICD('CI_COMMIT_REF_NAME');

    // 本地开发中
    if (!CI_COMMIT_REF_NAME) {
        await checkVoltaInstalled();
        const { REACT_APP_API_ENV, REACT_APP_API_ENV_NUM } = await promptForEnvSelection();
        env.REACT_APP_API_ENV = REACT_APP_API_ENV;
        env.REACT_APP_API_ENV_NUM = REACT_APP_API_ENV_NUM;
    }

    env.REACT_APP_API = 'http://127.0.0.1:3100/api/';
    env.REACT_APP_GITLAB_USER_NAME = REACT_APP_GITLAB_USER_NAME;
    env.REACT_APP_BUILD_TAG = CI_COMMIT_REF_NAME;
    env.REACT_APP_BUILD_TIME = dayjs().format('YYYY-MM-DD HH:mm:ss');

    console.log('-------------------------------------------------------');
    console.log(chalk.green('打印环境变量:'));
    console.table(
        Object.entries(env).map(([key, value]) => ({
            Variable: key,
            Value: value,
        })),
    );
    console.log('结束打印环境变量:');
    console.log('-------------------------------------------------------');
    console.log(charAt);

    await execa('rsbuild', build ? ['build'] : ['dev'], { stdio: 'inherit', env });
    console.log(chalk.green('构建完成'));
    process.exit();
};

main().catch((error) => {
    console.error(chalk.red('构建失败:'), error);
    process.exit(1);
});
