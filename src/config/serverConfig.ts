export const allowedOrigins = [
    'https://localhost', // LOCAL
    // 'https://*.aws.in.here.com', // DEV
];

export const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
};
