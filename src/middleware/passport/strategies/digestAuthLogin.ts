import { User } from '../../../api/user/user.model';

export const digestAuthLogin = async (username: string, password: string, done: Function) => {
    try {
        const user = await User.findOne({username});
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
}

export const validateCallback = (params: any, done: Function) => {
    // validate nonces as necessary
    done(null, true)
}
