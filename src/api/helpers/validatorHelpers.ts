import { ROLES } from '../../config/types';
import { User } from '../user/user.model';
import { ApiKey } from '../apiKey/apiKey.model';

// fail if the email name is in use
export const emailNotExist = (email: string) => {
    return new Promise(async (resolve, reject) => {
        const user = await User.findOne({email});
        user ? reject() : resolve();
    });
};

export const emailExists = (email: string) => {
    return new Promise(async (resolve, reject) => {
        const user = await User.findOne({email});
        user ? resolve() : reject();
    });
};

export const validateRole = (maybeRole: string) => {
    return new Promise((resolve, reject) => {
        const role = ROLES.find((validName: string) => validName === maybeRole);
        if (role) {
            resolve();
        } else {
            reject();
        }
    });
};

export const keyExists = (key: string) => {
    return new Promise(async (resolve, reject) => {
        const apiKey = await ApiKey.findOne({key});
        apiKey ? resolve() : reject();
    });
};
