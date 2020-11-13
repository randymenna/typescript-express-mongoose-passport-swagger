import React, { useEffect, useState } from 'react';
// my-dashboard-component.tsx
import { ApiClient } from 'admin-bro';
import { Box } from '@admin-bro/design-system';

const api = new ApiClient();

const Dashboard = () => {
    const [data, setData] = useState<any>({});

    useEffect(() => {
        api.getDashboard().then((response) => {
            console.info('dashboard', response);
            setData(response.data);
        });
    }, []);

    return (
        <Box variant='grey'>
            <Box variant='white'>
                Users: {data.users}
            </Box>
            <Box variant='white'>
                Devices: {data.devices}
            </Box>
            <Box variant='white'>
                Pets: {data.items}
            </Box>
            <Box variant='white'>
                Locations: {data.locations}
            </Box>
        </Box>
    );
};

export default Dashboard;

