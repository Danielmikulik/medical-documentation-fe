// material-ui
import { Box, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

function ProfileInfo({ data }) {
    const labels = [];
    const values = [];

    Object.keys(data).forEach((el) => labels.push(el));
    Object.values(data).forEach((el) => values.push(el));

    const renderItems = labels.map((label, key) => (
        <Box key={label} display="flex" py={1} pr={2}>
            <Typography variant="body1" fontWeight="bold">
                {label}: &nbsp;
            </Typography>
            {!Array.isArray(values[key]) && renderSingleValue(values[key])}
            {Array.isArray(values[key]) && <Stack spacing={0.75}>{renderArray(values[key])}</Stack>}
        </Box>
    ));

    return <> {renderItems} </>;
}

function renderSingleValue(value) {
    return (
        <Typography variant="body1" fontWeight="regular" color="text">
            &nbsp;{value}
        </Typography>
    );
}

function renderArray(array) {
    return array.map((value) => (
        <Typography variant="body1" fontWeight="regular" color="text">
            &nbsp;{value}
        </Typography>
    ));
}

// Typechecking props for the ProfileInfoCard
// ProfileInfo.propTypes = {
//     data: PropTypes.objectOf(PropTypes.string).isRequired
// };

export default ProfileInfo;
