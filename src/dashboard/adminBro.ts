import { Models } from 'src/api/models';
import { dashBoardHandler } from 'src/dashboard/dashboardHandler';
import { adminBroAuthenticate } from 'src/middleware/adminBroAuthenticate';

// tslint:disable-next-line:no-var-requires
const AdminBro = require('admin-bro');
// tslint:disable-next-line:no-var-requires
const AdminBroExpress = require('@admin-bro/express');
// tslint:disable-next-line:no-var-requires
const AdminBroMongoose = require('@admin-bro/mongoose');

export const setAdminUI = (db: any, app: { use: (arg0: any, arg1: any) => void; }) => {
    try {
        AdminBro.registerAdapter(AdminBroMongoose);
        const dashboardPath = process.cwd() + '/src/dashboard/dashboard.tsx';
        const adminBro = new AdminBro({
            resources: [...Models],
            rootPath: '/admin',
            branding: {
                logo: process.env.LOGO_URL,
                softwareBrothers: false,
                companyName: process.env.COMPANY_NAME,
            },
            dashboard: {
                handler: dashBoardHandler,
                component: AdminBro.bundle(dashboardPath)
            },
        });
        const router = AdminBroExpress.buildAuthenticatedRouter(adminBro,
            {
                authenticate: adminBroAuthenticate,
                cookieName: process.env.COOKIE_ADMIN_NAME || 'C-4-P',
                cookiePassword: process.env.COOKIE_ADMIN_PASSWORD || 'admin-bro',
            },
            null, {
                resave: false,
                saveUninitialized: true,
            });
        app.use(adminBro.options.rootPath, router);
        console.log('admin interface available');
    }
    catch (e) {
        console.error(e.message);
        process.exit(1);
    }
};

