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
            url: '/examinations',
            icon: icons.MonitorHeartIcon,
            breadcrumbs: false,
            role: 'patient'
        },
        {
            id: 'myPrescriptions',
            title: 'Moje Recepty',
            type: 'item',
            url: '/prescriptions',
            icon: icons.MedicationIcon,
            breadcrumbs: false,
            role: 'patient'
        }
    ]
};

export default dashboard;
