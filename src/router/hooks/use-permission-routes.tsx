import { isEmpty } from 'ramda';
import { Suspense, lazy, useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Iconify } from '@/components/Icon';
import { CircleLoading } from '@/components/loading';
import { useUserPermission } from '@/store/userStore';
import ProTag from '@/theme/antd/components/tag';
import { flattenTrees } from '@/utils/tree';

import { Permission } from '#/entity';
import { BasicStatus, PermissionType } from '#/enum';
import { AppRouteObject } from '#/router';
import { mock_permissions } from '@/store/mock';

// 使用 import.meta.glob 获取所有路由组件 vite才有的API 在Rsbuild用另外方式实现
// const pages = import.meta.glob('/src/pages/**/*.tsx');
const pages = require.context(
    '@/pages', // 使用别名（需先在RSBuild中配置）
    true, // 递归查找
    /\.tsx$/, // 匹配.tsx文件
);

// 构建绝对路径的函数
function resolveComponent(path: string) {
    const homeModule: any = pages(`.${path}`);
    return homeModule;
}

/**
 * return routes about permission
 */
export function usePermissionRoutes() {
    const permissions = useUserPermission();

    return useMemo(() => {
        const flattenedPermissions = flattenTrees(permissions!);
        const permissionRoutes = transformPermissionToMenuRoutes(
            permissions || [],
            flattenedPermissions,
        );
        return [...permissionRoutes];
    }, [permissions]);
}

/**
 * transform Permission[] to  AppRouteObject[]
 * @param permissions
 * @param parent
 */
function transformPermissionToMenuRoutes(
    permissions: Permission[],
    flattenedPermissions: Permission[],
) {
    return permissions.map((permission) => {
        const {
            path,
            resourceType,
            label,
            icon,
            sortValue,
            hide,
            status,
            frameSrc,
            newFeature,
            component,
            parentId,
            children = [],
        } = permission;

        const appRoute: AppRouteObject = {
            path,
            meta: {
                label,
                key: getCompleteRoute(permission, flattenedPermissions),
                hideMenu: !!hide,
                disabled: status === BasicStatus.DISABLE,
            },
        };

        if (sortValue) appRoute.sortValue = sortValue;
        if (icon) appRoute.meta!.icon = icon;
        if (frameSrc) appRoute.meta!.frameSrc = frameSrc;
        if (newFeature)
            appRoute.meta!.suffix = (
                <ProTag
                    color="cyan"
                    icon={<Iconify icon="solar:bell-bing-bold-duotone" size={14} />}
                >
                    NEW
                </ProTag>
            );

        if (resourceType === PermissionType.CATALOGUE) {
            appRoute.meta!.hideTab = true;
            if (!parentId) {
                appRoute.element = (
                    <Suspense fallback={<CircleLoading />}>
                        <Outlet />
                    </Suspense>
                );
            }
            appRoute.children = transformPermissionToMenuRoutes(children, flattenedPermissions);
            if (!isEmpty(children)) {
                appRoute.children.unshift({
                    index: true,
                    element: <Navigate to={children[0].path} replace />,
                });
            }
        } else if (resourceType === PermissionType.MENU) {
            const Element = lazy(resolveComponent(component!) as any);
            if (frameSrc) {
                appRoute.element = <Element src={frameSrc} />;
            } else {
                appRoute.element = <Element />;
            }
        }

        return appRoute;
    });
}

/**
 * Splicing from the root permission path to the current permission path
 * @param {Permission} permission - current permission
 * @param {Permission[]} flattenedPermissions - flattened permission array
 * @param {string} path - parent permission path
 * @returns {string} - The complete path after splicing
 */
function getCompleteRoute(permission: Permission, flattenedPermissions: Permission[], path = '') {
    const currentRoute = path ? `/${permission.path}${path}` : `/${permission.path}`;

    if (permission.parentId) {
        const parentPermission = flattenedPermissions.find((p) => p.id === permission.parentId)!;
        return getCompleteRoute(parentPermission, flattenedPermissions, currentRoute);
    }

    return currentRoute;
}
