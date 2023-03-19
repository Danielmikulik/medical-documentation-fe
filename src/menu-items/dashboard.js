// assets
import { DashboardOutlined } from '@ant-design/icons';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

// icons
const icons = {
    DashboardOutlined,
    MonitorHeartIcon,
    MedicationIcon,
    LocalHospitalIcon,
    AddBoxIcon,
    AddBoxOutlinedIcon
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
            title: 'Vytvoriť vyšetrenie',
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
        },
        {
            id: 'addDepartmentType',
            title: 'Pridať oddelenie',
            type: 'item',
            url: '/add_department_type',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        },
        {
            id: 'addDiseaseType',
            title: 'Pridať chorobu',
            type: 'item',
            url: '/add_disease_type',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        },
        {
            id: 'addExaminationType',
            title: 'Pridať typ vyšetrenia',
            type: 'item',
            url: '/add_examination_type',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        },
        {
            id: 'addHospital',
            title: 'Pridať nemocnicu',
            type: 'item',
            url: '/add_hospital',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        },
        {
            id: 'addHealthInsurance',
            title: 'Pridať zdravotnú poisťovňu',
            type: 'item',
            url: '/add_health_insurance',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        },
        {
            id: 'addCity',
            title: 'Pridať mesto',
            type: 'item',
            url: '/add_city',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        }
    ]
};

export default dashboard;
