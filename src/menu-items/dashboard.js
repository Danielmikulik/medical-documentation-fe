// assets
import { DashboardOutlined } from '@ant-design/icons';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AddBoxIcon from '@mui/icons-material/AddBox';

// icons
const icons = {
    DashboardOutlined,
    MonitorHeartIcon,
    MedicationIcon,
    LocalHospitalIcon,
    AddBoxIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-dashboard',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/home',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        },
        {
            id: 'myExaminations',
            title: 'Moje Vyšetrenia',
            type: 'item',
            url: '/patient_examinations',
            icon: icons.MonitorHeartIcon,
            breadcrumbs: false,
            role: 'patient'
        },
        {
            id: 'examinations',
            title: 'Vyšetrenia',
            type: 'item',
            url: '/doctor_examinations',
            icon: icons.MonitorHeartIcon,
            breadcrumbs: false,
            role: 'doctor'
        },
        {
            id: 'createExaminations',
            title: 'Vyvoriť vyšetrenie',
            type: 'item',
            url: '/create_examination',
            icon: icons.AddBoxIcon,
            breadcrumbs: false,
            role: 'doctor'
        },
        {
            id: 'myPrescriptions',
            title: 'Moje Recepty',
            type: 'item',
            url: '/prescriptions',
            icon: icons.MedicationIcon,
            breadcrumbs: false,
            role: 'patient'
        },
        {
            id: 'accessRequest',
            title: 'Žiadosti o prístup',
            type: 'item',
            url: '/access_request',
            icon: icons.LocalHospitalIcon,
            breadcrumbs: false,
            role: 'doctor'
        },
        {
            id: 'accessRequestConfirm',
            title: 'Žiadosti na potvrdenie',
            type: 'item',
            url: '/access_request_confirm',
            icon: icons.LocalHospitalIcon,
            breadcrumbs: false,
            role: 'doctor',
            department: 'Ambulancia všeobecného lekára'
        }
    ]
};

export default dashboard;
