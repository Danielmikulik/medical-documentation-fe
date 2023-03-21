// assets
import { DashboardOutlined } from '@ant-design/icons';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';

// icons
const icons = {
    DashboardOutlined,
    MonitorHeartIcon,
    MedicationIcon,
    LocalHospitalIcon,
    AddBoxIcon,
    AddBoxOutlinedIcon,
    ChangeCircleOutlinedIcon
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
            id: 'createPrescription',
            title: 'Vytvoriť recept',
            type: 'item',
            url: '/create_prescription',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'doctor'
        },
        {
            id: 'addDepartmentType',
            title: 'Pridať typ oddelenia',
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
        },
        {
            id: 'addMedication',
            title: 'Pridať liek',
            type: 'item',
            url: '/add_medication',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        },
        {
            id: 'addDepartment',
            title: 'Pridať oddelenie',
            type: 'item',
            url: '/add_department',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        },
        {
            id: 'changeDoctorsDepartment',
            title: 'Zmena oddelenia',
            type: 'item',
            url: '/department_change',
            icon: icons.ChangeCircleOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        },
        {
            id: 'changePatientsHealthInsurance',
            title: 'Zmena zdravotnej poisťovne',
            type: 'item',
            url: '/health_insurance_change',
            icon: icons.ChangeCircleOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        },
        {
            id: 'addPerson',
            title: 'Pridať osobu',
            type: 'item',
            url: '/add_person',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        },
        {
            id: 'addPatient',
            title: 'Pridať pacienta',
            type: 'item',
            url: '/add_patient',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        },
        {
            id: 'addDoctor',
            title: 'Pridať doktora',
            type: 'item',
            url: '/add_doctor',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        },
        {
            id: 'register',
            title: 'Registrácia používateľa',
            type: 'item',
            url: '/register_user',
            icon: icons.AddBoxOutlinedIcon,
            breadcrumbs: false,
            role: 'admin'
        }
    ]
};

export default dashboard;
