import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Iconify } from '@/components/Icon';
import { useSettings } from '@/store/settingStore';

import { ThemeLayout } from '#/enum';
import { AppRouteObject } from '#/router';
import { MenuProps } from 'antd';
import { SvgIcon } from '@/components/SvgIcon';

type ItemType = MenuProps['items'];

/**
 *   routes -> menus
 */
export function useRouteToMenuFn() {
    const { t } = useTranslation();
    const { themeLayout } = useSettings();
    const routeToMenuFn = useCallback(
        (items: AppRouteObject[]) => {
            return items
                .filter((item) => !item.meta?.hideMenu)
                .map((item) => {
                    const menuItem: any = [];
                    const { meta, children } = item;
                    if (meta) {
                        const { key, label, icon, disabled, suffix } = meta;
                        menuItem.key = key;
                        menuItem.disabled = disabled;
                        menuItem.label = (
                            <div
                                className={`inline-flex w-full items-center ${
                                    themeLayout === ThemeLayout.Horizontal
                                        ? 'justify-start'
                                        : 'justify-between'
                                } `}
                            >
                                <div className="">{t(label)}</div>
                                {suffix}
                            </div>
                        );
                        if (icon) {
                            if (typeof icon === 'string') {
                                if (icon.startsWith('ic')) {
                                    menuItem.icon = (
                                        <SvgIcon
                                            iconClass={icon}
                                            fontSize={24}
                                            className="!text-[22px]"
                                            // className="ant-menu-item-icon"
                                        />
                                    );
                                } else {
                                    menuItem.icon = (
                                        <Iconify
                                            icon={icon}
                                            size={24}
                                            className="ant-menu-item-icon"
                                        />
                                    );
                                }
                            } else {
                                menuItem.icon = icon;
                            }
                        }
                    }
                    if (children) {
                        menuItem.children = routeToMenuFn(children);
                    }
                    return menuItem as ItemType;
                });
        },
        [t, themeLayout],
    );
    return routeToMenuFn;
}
