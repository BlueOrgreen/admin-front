import { lazy } from 'react';
import { createHashRouter, Navigate, RouteObject, RouterProvider } from 'react-router-dom';

import { ErrorRoutes } from '@/router/routes/error-routes';

import { AppRouteObject } from '#/router';

const HOMEPAGE = process.env.REACT_APP_HOMEPAGE as string;

const LoginRoute: AppRouteObject = {
    path: '/login',
    Component: lazy(() => import('@/pages/sys/login/Login')),
};

const PAGE_NOT_FOUND_ROUTE: AppRouteObject = {
    path: '*',
    element: <Navigate to="/404" replace />,
};

export default function Router() {
    const asyncRoutes: AppRouteObject = {
        path: '/',
        // element: <DashboardLayout />,
        element: <div>DashboardLayout</div>,
        children: [{ index: true, element: <Navigate to={HOMEPAGE} replace /> }],
    };

    const routes = [LoginRoute, asyncRoutes, ErrorRoutes, PAGE_NOT_FOUND_ROUTE];

    const router = createHashRouter(routes as unknown as RouteObject[]);

    return <RouterProvider router={router} />;
}
