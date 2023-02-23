// assets
import { DashboardOutlined } from '@ant-design/icons';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

// icons
const icons = {
    DashboardOutlined,
    MonitorHeartIcon
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
        }
    ]
};

export default dashboard;
