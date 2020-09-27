import { User } from '../../../api/user/user.model';

export const basicAuthLogin = async (username: string, password: string, done: Function) => {
    try {
        const user = await User.findOne({email: username});
        if (!user) {
            return done(null, false, {message: 'Incorrect username.'});
        }
        // @ts-ignore
        const storedPassword = await user.password;
        if (!(storedPassword === password)) {
            return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
};

function deepEqual(a: any, b: any) {
    if ((typeof a === 'object' && a != null) &&
        (typeof b === 'object' && b != null)) {
        const count = [0, 0];
        // @ts-ignore
        // tslint:disable-next-line:forin prefer-const
        for (let key in a) {
            count[0]++;
        }
        // @ts-ignore
        // tslint:disable-next-line:forin prefer-const
        for (let key in b) {
            count[1]++;
        }
        if (count[0] - count[1] !== 0) {
            return false;
        }
        // tslint:disable-next-line:forin prefer-const
        for (let key in a) {
            if (!(key in b) || !deepEqual(a[key], b[key])) {
                return false;
            }
        }
        // tslint:disable-next-line:forin prefer-const
        for (let key in b) {
            if (!(key in a) || !deepEqual(b[key], a[key])) {
                return false;
            }
        }
        return true;
    } else {
        return a === b;
    }
}
