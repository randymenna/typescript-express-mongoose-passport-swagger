import { Account } from 'src/api/account/account.model';
import { Billing } from 'src/api/billing/billing.model';
import { GeoFence } from 'src/api/geoFence/geoFence.model';
import { Item } from 'src/api/item/item.model';
import { Location } from 'src/api/location/location.model';
import { Subscription } from 'src/api/subscription/subscription.model';
import { Point } from 'src/api/point/point.model';
import { User } from 'src/api/user/user.model';
import { Device } from 'src/api/device/device.model';
import { Contact } from 'src/api/contact/contact.model';
import { Alert } from 'src/api/alert/alert.model';

export const Models = [
    Account,
    Alert,
    Billing,
    Contact,
    Device,
    GeoFence,
    Item,
    Location,
    Subscription,
    Point,
    User
];

export const Accounts = Account;
export const Alerts = Alert;
export const Billings = Billing;
export const Contacts = Contact;
export const Devices = Device;
export const GeoFences = GeoFence;
export const Items = Item;
export const Locations = Location;
export const Subscriptions = Subscription;
export const Points = Point;
export const Users = User;