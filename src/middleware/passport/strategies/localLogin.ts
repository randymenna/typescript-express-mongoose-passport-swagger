import { User } from '../../../api/user/user.model'
import argon2 from 'argon2';

export const localLogin = async (email: string, password: string, done: Function) => {
    try {
        const user = await User.findOne({email});
        if (!user) {
            return done(null, false, {message: 'Incorrect username.'});
        }
        // @ts-ignore
        const correctPassword = await argon2.verify(user.password, password);

        if (!correctPassword) {
            return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}
