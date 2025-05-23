import { lazy } from 'react';
import { createHashRouter, Navigate, RouteObject, RouterProvider } from 'react-router-dom';

import { ErrorRoutes } from '@/router/routes/error-routes';

import { AppRouteObject } from '#/router';
import { usePermissionRoutes } from './hooks/use-permission-routes';
import Home from '@/pages/home';
import DashboardLayout from '@/layouts/dashboard';
import AuthGuard from './components/AuthGuard';

const HOMEPAGE = process.env.REACT_APP_HOMEPAGE as string;

const LoginRoute: AppRouteObject = {
    path: '/login',
    Component: lazy(() => import('@/pages/sys/login/login')),
};

const PAGE_NOT_FOUND_ROUTE: AppRouteObject = {
    path: '*',
    element: <Navigate to="/404" replace />,
};

export default function Router() {
    const permissionRoutes = usePermissionRoutes();
    console.log('Router permissionRoutes====>', permissionRoutes);

    const asyncRoutes: AppRouteObject = {
        path: '/',
        element: (
            <AuthGuard>
                <DashboardLayout />
            </AuthGuard>
        ),
        children: [
            { index: true, element: <Navigate to={HOMEPAGE} replace /> },
            ...permissionRoutes,
            // {
            //     element: <Home />,
            //     path: 'home',
            // },
        ],
    };

    const routes = [LoginRoute, asyncRoutes, ErrorRoutes, PAGE_NOT_FOUND_ROUTE];

    const router = createHashRouter(routes as unknown as RouteObject[]);

    return <RouterProvider router={router} />;
}
