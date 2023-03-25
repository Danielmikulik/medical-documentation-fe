// material-ui
import { Box } from '@mui/material';

// project import
import Profile from './Profile';
// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
    return (
        <>
            <Box sx={{ width: '100%', ml: 1 }} />
            <Profile />
        </>
    );
};

export default HeaderContent;
