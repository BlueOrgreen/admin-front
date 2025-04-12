import { Dropdown, Button } from 'antd';

import useLocale, { LANGUAGE_MAP } from '@/locales/useLocale';

import { IconButton } from '../Icon';

import { LocalEnum } from '#/enum';
import type { MenuProps } from 'antd';
import { SvgIcon } from '../SvgIcon';

type Locale = keyof typeof LocalEnum;

/**
 * Locale Picker
 */
export default function LocalePicker() {
    const { setLocale, locale } = useLocale();

    const localeList: MenuProps['items'] = Object.values(LANGUAGE_MAP).map((item) => {
        return {
            key: item.locale,
            label: item.label,
            icon: <SvgIcon iconClass={item.icon} className="rounded-md !text-[18px]" />,
        };
    });

    return (
        <Dropdown
            placement="bottomRight"
            trigger={['click']}
            key={locale}
            menu={{ items: localeList, onClick: (e) => setLocale(e.key as Locale) }}
        >
            <div>
                <IconButton className="h-10 w-10 hover:scale-105">
                    <SvgIcon
                        iconClass={`ic-locale_${locale}`}
                        fontSize="24"
                        className="rounded-md"
                    />
                </IconButton>
            </div>
        </Dropdown>
    );
}
