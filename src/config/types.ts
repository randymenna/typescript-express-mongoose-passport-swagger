import mongoose from 'mongoose';
import { Account } from '../api/account/account.model';
// import { Billing } from '../api/billing/billing.model';
import { GeoFence } from '../api/geoFence/geoFence.model';
// import { Location } from '../api/location/location.model';
import { Subscription } from '../api/subscription/subscription.model';

export const ROLES = ['admin', 'user'] as const;
export type RoleType = typeof ROLES[number];

export const ModelNames = {
    ACCOUNT: 'Account',
    BILLING: 'Billing',
    GEOFENCE: 'GeoFence',
    LOCATION: 'Location',
    SUBSCRIPTION: 'Subscription',
    USER: 'User',
    APIKEY: 'ApiKey',
    AUTH: 'Auth'
};

export const Models: { [key: string]: mongoose.Model<any> } = {
    Account,
    // Billing,
    GeoFence,
    // Location,
    Subscription,
};


