// assets
import { DashboardOutlined } from '@ant-design/icons';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MedicationIcon from '@mui/icons-material/Medication';

// icons
const icons = {
    DashboardOutlined,
    MonitorHeartIcon,
    MedicationIcon
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
            icon: icons.MonitorHeartIcon,
            breadcrumbs: false,
            role: 'patient'
        }
    ]
};

export default dashboard;
