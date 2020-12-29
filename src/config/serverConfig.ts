export const allowedOrigins: { [key: string]: string[] } = {
    local: [
        'https://localhost',
    ],
    test: [
        'https://test.mydomain.com',
    ]
};

export const corsOptions = {
    origin: allowedOrigins.local,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
};

export const baseApiUrl = '/api/v1';
