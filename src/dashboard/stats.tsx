import React, { useEffect, useState } from 'react';
// my-dashboard-component.tsx
import { ApiClient } from 'admin-bro';
import { Box } from '@admin-bro/design-system';

const api = new ApiClient();

const Stats = () => {
    const [data, setData] = useState<any>({});

    useEffect(() => {
        api.getDashboard().then((response) => {
            console.info('stats', response);
            setData(response.data);
        });
    }, []);

    return (
        <Box variant='grey'>
            {data}
        </Box>
    );
};

export default Stats;

