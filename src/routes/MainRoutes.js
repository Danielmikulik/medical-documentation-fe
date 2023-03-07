import { lazy } from 'react';
import { ProtectRoutes, ProtectRoutesByRoles } from '../hooks/protectRoutes';
// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { Navigate } from 'react-router-dom';
import Profile from '../pages/profile/profile';
import Examinations from '../pages/examinations/examinations';
import Prescriptions from '../pages/prescription/prescriptions';
import AccessRequest from '../pages/accessRequest/accessRequest';
import Attachments from '../pages/attachment/attachments';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    element: <ProtectRoutes />,
    children: [
        {
            path: '/',
            element: <MainLayout />,
            children: [
                {
                    path: '/',
                    element: <Navigate to="home" exact />
                },
                {
                    path: 'color',
                    element: <Color />
                },
                {
                    path: 'home',
                    element: <DashboardDefault />
                },
                {
                    path: 'sample-page',
                    element: <SamplePage />
                },
                {
                    path: 'profile',
                    element: <Profile />
                },
                {
                    element: <ProtectRoutesByRoles allowedRoles={['patient']} />,
                    children: [
                        {
                            path: 'patient_examinations',
                            element: <Examinations userRole={'patient'} />
                        },
                        {
                            path: 'prescriptions',
                            element: <Prescriptions />
                        },
                        {
                            path: 'access_request',
                            element: <AccessRequest />
                        }
                    ]
                },
                {
                    element: <ProtectRoutesByRoles allowedRoles={['doctor']} />,
                    children: [
                        {
                            path: 'doctor_examinations',
                            element: <Examinations userRole={'doctor'} />
                        }
                    ]
                },
                {
                    path: '/attachments/:examId',
                    element: <Attachments />
                },
                {
                    path: 'shadow',
                    element: <Shadow />
                },
                {
                    path: 'typography',
                    element: <Typography />
                },
                {
                    path: 'icons/ant',
                    element: <AntIcons />
                }
            ]
        }
    ]
};

export default MainRoutes;
