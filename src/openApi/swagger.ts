import { getExample } from './example.swagger';

export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'Flock API',
        description: 'Flock of whatever Tracking API',
        termsOfService: 'free for now',
        contact: {
            name: 'Randy Menna',
            email: 'randy@newportave.com',
            url: 'http://newportave.com'
        },
        license: {
            name: 'apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    tags: [
        {
            name: 'Example'
        }
    ],
    paths: {
        '/api/v1/examples': {
            'get': getExample
        }
    }
};
