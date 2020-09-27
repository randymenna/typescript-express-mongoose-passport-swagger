import { ApiKey } from 'src/api/apiKey/apiKey.model';

export const swaggerDocument = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Sessionless API Server',
            version: '1.0.0',
            description:
                'A skeleton sessionless API server, integrated to mongo and passport',
            license: {
                name: 'MIT',
                url: 'https://choosealicense.com/licenses/mit/'
            },
            contact: {
                name: 'Newport Group',
                url: 'https://newportave.com',
                email: 'Info@NewportAve.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3020/api/v1'
            }
        ],
        tags: [
            {
                name: 'ApiKey',
                description: 'Manage ApiKeys for access to this server'
            },
            {
                name: 'User',
                description: 'Manage Users of this service'
            }
        ]
    },
    apis: ['./src/api/**/*.ts']
};
