// material-ui
import { Box, Stack, Typography } from '@mui/material';

// project import
import { Image } from 'mui-image';

export default function Attachment({ file, report }) {
    return (
        <Box key={report.substring(1, 3)} py={1} pr={2}>
            <Stack spacing={3}>
                <Typography variant="body1" fontWeight="regular" color="text" whiteSpace={'pre-wrap'}>
                    <p>{report}</p>
                </Typography>
                <Image mt={20} src={`data:image/jpeg;base64,${file}`} shift="left" distance={150} showLoading />
            </Stack>
        </Box>
    );
}
