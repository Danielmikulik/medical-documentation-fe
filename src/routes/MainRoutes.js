import { lazy } from 'react';
import { ProtectRoutes, ProtectRoutesByDepartment, ProtectRoutesByRoles } from '../hooks/protectRoutes';
// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { Navigate } from 'react-router-dom';
import Profile from '../pages/profile/profile';
import Examinations from '../pages/examinations/examinations';
import Prescriptions from '../pages/prescription/prescriptions';
import AccessRequest from '../pages/accessRequest/accessRequest';
import Attachments from '../pages/attachment/attachments';
import AccessRequestConfirm from '../pages/accessRequest/confirm/accessRequestConfirm';
import CreateMedicalExamination from '../pages/examinations/createMedicalExamination';
import AddTypeEntry from '../pages/addForms/addTypeEntry';
import AddCity from '../pages/addForms/addCityForm';

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
                        }
                    ]
                },
                {
                    element: <ProtectRoutesByRoles allowedRoles={['admin']} />,
                    children: [
                        {
                            path: 'add_department_type',
                            element: <AddTypeEntry url={'/api/department_type'} title={'Vytvoriť oddelenie'} label={'Oddelenie'} />
                        },
                        {
                            path: 'add_disease_type',
                            element: <AddTypeEntry url={'/api/disease_type'} title={'Vytvoriť chorobu'} label={'Choroba'} />
                        },
                        {
                            path: 'add_examination_type',
                            element: (
                                <AddTypeEntry url={'/api/examination_type'} title={'Vytvoriť typ vyšetrenia'} label={'Typ vyšetrenia'} />
                            )
                        },
                        {
                            path: 'add_health_insurance',
                            element: (
                                <AddTypeEntry
                                    url={'/api/health_insurance'}
                                    title={'Vytvoriť zdravotnú poisťovňu'}
                                    label={'Zdravotná poisťovňa'}
                                />
                            )
                        },
                        {
                            path: 'add_hospital',
                            element: <AddTypeEntry url={'/api/hospital'} title={'Vytvoriť nemocnicu'} label={'Nemocnica'} />
                        },
                        {
                            path: 'add_city',
                            element: <AddCity />
                        }
                    ]
                },
                {
                    element: <ProtectRoutesByRoles allowedRoles={['doctor']} />,
                    children: [
                        {
                            path: 'doctor_examinations',
                            element: <Examinations userRole={'doctor'} />
                        },
                        {
                            path: 'access_request',
                            element: <AccessRequest />
                        },
                        {
                            path: 'create_examination',
                            element: <CreateMedicalExamination />
                        },
                        {
                            element: <ProtectRoutesByDepartment department={'Ambulancia všeobecného lekára'} />,
                            children: [
                                {
                                    path: 'access_request_confirm',
                                    element: <AccessRequestConfirm />
                                }
                            ]
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
