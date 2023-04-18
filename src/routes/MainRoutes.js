import { lazy } from 'react';
import { ProtectDashboardByRoles, ProtectRoutes, ProtectRoutesByDepartment, ProtectRoutesByRoles } from '../hooks/protectRoutes';
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
import AddTypeEntry from '../pages/adminForms/addTypeEntry';
import AddCityForm from '../pages/adminForms/addCityForm';
import AddMedicationForm from '../pages/adminForms/addMedicationForm';
import AddDepartmentForm from '../pages/adminForms/addDepartmentForm';
import CreatePrescription from '../pages/adminForms/createPrescriptionForm';
import DepartmentChange from '../pages/adminForms/departmentChange';
import HealthInsuranceChange from '../pages/adminForms/healthInsuranceChange';
import AddPersonForm from '../pages/adminForms/addPersonForm';
import AddPatientForm from '../pages/adminForms/addPatientForm';
import RegisterUserForm from '../pages/adminForms/registerUserForm';
import AddDoctorForm from '../pages/adminForms/addDoctorForm';
import DashboardPatient from '../pages/dashboard/dashboardPatient';
import DashboardDoctor from '../pages/dashboard/dashboardDoctor';
import PrescriptionConfirm from '../pages/prescription/confirm/prescriptionConfirm';
import AddPharmacyForm from '../pages/adminForms/addPharmacyForm';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/dashboardDefault')));

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
                    path: 'home',
                    element: <ProtectDashboardByRoles />
                },
                {
                    path: 'home_default',
                    element: <DashboardDefault />
                },
                {
                    path: 'home_patient',
                    element: <DashboardPatient />
                },
                {
                    path: 'home_doctor',
                    element: <DashboardDoctor />
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
                    element: <ProtectRoutesByRoles allowedRoles={['pharmacy']} />,
                    children: [
                        {
                            path: 'confirm_prescription',
                            element: <PrescriptionConfirm />
                        }
                    ]
                },
                {
                    element: <ProtectRoutesByRoles allowedRoles={['admin']} />,
                    children: [
                        {
                            path: 'add_department_type',
                            element: <AddTypeEntry url={'/api/department_type'} title={'Pridať typ oddelenie'} label={'Typ oddelenia'} />
                        },
                        {
                            path: 'add_disease_type',
                            element: <AddTypeEntry url={'/api/disease_type'} title={'Pridať chorobu'} label={'Choroba'} />
                        },
                        {
                            path: 'add_examination_type',
                            element: <AddTypeEntry url={'/api/examination_type'} title={'Pridať typ vyšetrenia'} label={'Typ vyšetrenia'} />
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
                            element: <AddCityForm />
                        },
                        {
                            path: 'add_medication',
                            element: <AddMedicationForm />
                        },
                        {
                            path: 'add_department',
                            element: <AddDepartmentForm />
                        },
                        {
                            path: 'department_change',
                            element: <DepartmentChange />
                        },
                        {
                            path: 'health_insurance_change',
                            element: <HealthInsuranceChange />
                        },
                        {
                            path: 'add_person',
                            element: <AddPersonForm />
                        },
                        {
                            path: 'add_patient',
                            element: <AddPatientForm />
                        },
                        {
                            path: 'add_doctor',
                            element: <AddDoctorForm />
                        },
                        {
                            path: 'add_pharmacy',
                            element: <AddPharmacyForm />
                        },
                        {
                            path: 'register_user',
                            element: <RegisterUserForm />
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
                            path: 'create_prescription',
                            element: <CreatePrescription />
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
                    element: <ProtectRoutesByRoles allowedRoles={['doctor', 'patient']} />,
                    children: [
                        {
                            path: '/attachments/:examId',
                            element: <Attachments />
                        }
                    ]
                }
            ]
        }
    ]
};

export default MainRoutes;
